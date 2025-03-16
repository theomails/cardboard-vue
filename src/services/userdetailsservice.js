export default {
    getLocalStorageUser: () => {
        let userObjStr = localStorage.getItem("ALT-jira-assist-user");
        let userObj = userObjStr?JSON.parse(userObjStr):null;
        if(!userObj || !userObj.userEmail){
            return null;
        }
        return userObj;
    },
    saveLocalStorageUser: (userEmail, userJiraToken, userDisplayName) => {
        const userObj = {
            userEmail,
            userJiraToken,
            userDisplayName
        };
        let userObjStr = JSON.stringify(userObj);
        localStorage.setItem("ALT-jira-assist-user", userObjStr);
        return userObj;
    }
}