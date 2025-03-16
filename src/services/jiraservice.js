import axios from 'axios';
import userdetailsservice from './userdetailsservice.js';

const instance = {
    getDetails: async (entity, issueKey, originalKey)=>{
        console.log(`getDetails ${entity}, ${issueKey}, ${originalKey}`);
        const params = new URLSearchParams({
            entity,
            issueKey: encodeURIComponent(issueKey),
            username: encodeURIComponent(userdetailsservice.getLocalStorageUser().userEmail),
            apiKey: encodeURIComponent(userdetailsservice.getLocalStorageUser().userJiraToken),
            displayName: encodeURIComponent(userdetailsservice.getLocalStorageUser().userDisplayName)
          });

        let firebaseFunctionUrl = 'https://us-central1-applib-tech.cloudfunctions.net/callJiraAPI';

        let response = await axios.get(`${firebaseFunctionUrl}?${params.toString()}`);
        console.log(response.data);
        return response.data;
    }
};

export default instance;