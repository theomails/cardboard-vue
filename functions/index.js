const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");
const axios = require("axios");

const allowedOrigins = [
  "https://cardboard.applib.tech",
  "https://applib-tech-cardboard.web.app",
  "http://localhost:5000",
  "http://localhost:5173"
];

async function toRfcDto(responseData, credentials, originalKey){
  if (!responseData) return null;

  let result = {
      key: responseData.key,
      summary: responseData.fields.summary,
      assigneeName: responseData.fields.assignee?.displayName,
      description: responseData.fields.description,
      status: responseData.fields.status?.name,
      changeWindowStart: responseData.fields.customfield_13474,
      changeWindowEnd: responseData.fields.customfield_13475,
      linkedIssues: (responseData.fields.issuelinks || []).
          map((issueLink) => {
              return { 
                  inwardIssue: toIssueDto(issueLink.inwardIssue, credentials),
                  outwardIssue: toIssueDto(issueLink.outwardIssue, credentials)
              }
          })
  };
  //console.log('toRfcDto result (pre): ');
  //console.log(result);
  let linkedIssueDetails = await fetchLinkedIssueDetails(result.linkedIssues, credentials, originalKey);
  //console.log(linkedIssueDetails);
  result.issuesInvolvingMe = linkedIssueDetails.filter(issue => issue.myTasks.length > 0)
  //console.log('toRfcDto ' + result.key);
  //console.log(result.assigneeName);
  return result;
}

async function fetchLinkedIssueDetails(linkedIssues, credentials, originalKey) {
  return Promise.all(
      linkedIssues
      .filter((linkedIssue) => {
          const issueKey = (linkedIssue.inwardIssue || linkedIssue.outwardIssue).key;
          return !(/(RFC|CAB)-(.*)/.test(issueKey));
      })
      .map(async (linkedIssue) => {
          //console.log(linkedIssue)
          const issueKey = (linkedIssue.inwardIssue || linkedIssue.outwardIssue).key;
          return await getEntityDetails(credentials, 'issue', issueKey, originalKey);
      })
  );
}

function toIssueDto(responseData, credentials){
  if(!responseData) return null;
  
  let result = {
      key: responseData.key,
      summary: responseData.fields.summary,
      assigneeName: responseData.fields.assignee?.displayName,
      description: responseData.fields.description,
      status: responseData.fields.status?.name,
      parent: toIssueDto(responseData.fields.parent, credentials),
      linkedIssues: (responseData.fields.issuelinks || []).
          map((issueLink) => {
              return { 
                  inwardIssue: toIssueDto(issueLink.inwardIssue, credentials),
                  outwardIssue: toIssueDto(issueLink.outwardIssue, credentials)
              }
          }),
      allTasks: (responseData.fields.subtasks || []).map(task => toIssueDto(task, credentials))
  }
  //console.log('toIssueDto result (pre): ');
  //console.log(result);

  let rfcSearchResult = result.linkedIssues.find(issueLink => /(RFC|CAB)-(.*)/.test((issueLink.inwardIssue || {}).key));
  result.rfc = (rfcSearchResult || {}).inwardIssue;
  result.myTasks = result.allTasks.filter(task => credentials.displayName == task.assigneeName);
  //console.log('toIssueDto ' + result.key);
  //console.log(result.assigneeName);
  return result;
}

async function invokeJira(username, apiKey, issueKey){
  // Encode Basic Auth
  const authHeader = `Basic ${Buffer.from(`${username}:${apiKey}`).toString("base64")}`;
  let jiraUrl = `https://redflex.atlassian.net/rest/api/2/issue/${issueKey}?expand=subtasks.assignee`;
  console.log(`Calling Jira API: ${jiraUrl}`);
  console.log(`Credentials ${username} ${apiKey.slice(0, 10)}`);

  // Make Jira API request
  const response = await axios.get(jiraUrl, {
    headers: { Authorization: authHeader, Accept: "application/json" }
  });  
  // Return Jira response as-is
  return response;
}
async function getEntityDetails(credentials, entity, issueKey, originalKey){
  let response = await invokeJira(credentials.username, credentials.apiKey, issueKey);
  let data = (response.data);
  let responseCopiedData = { key: data.key, fields: data.fields };
  let result;
  if(entity=='rfc'){
      result = await toRfcDto(responseCopiedData, credentials, originalKey);
  } else {
      result = toIssueDto(responseCopiedData, credentials);
  }
  return result;
}
exports.callJiraAPI = onRequest(async (req, res) => {
    try {
        // Set CORS headers (Allows all origins)
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
          res.set("Access-Control-Allow-Origin", origin);
        }
        res.set("Access-Control-Allow-Methods", "GET, OPTIONS");

        // Extract Jira credentials & API URL from request body
        const entity = req.query.entity;
        const issueKey = decodeURIComponent(req.query.issueKey);
        const username = decodeURIComponent(req.query.username);
        const apiKey = decodeURIComponent(req.query.apiKey);
        const displayName = decodeURIComponent(req.query.displayName);
    
        if (!entity || !issueKey || !username || !apiKey) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        let credentials = {username, apiKey, displayName};
    
        let responseData = await getEntityDetails(credentials, entity, issueKey, issueKey);
    
        return res.json(responseData);
      } catch (error) {
        console.error("Error calling Jira API:", error);
        return res.status(error.response?.status || 500).json({ error: error.message });
      }
});
