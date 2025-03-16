function fixAppDataFormat(swdToolsData){
    //Ensure fields
    swdToolsData.currentIssueKeysCsv = swdToolsData.currentIssueKeysCsv || '';
    swdToolsData.historyMenuItems =swdToolsData.historyMenuItems || {};
    swdToolsData.issueComments = swdToolsData.issueComments || {};
}

export default {

    persistAppData: (swdToolsData) => {
        var swdToolsDataJson = JSON.stringify(swdToolsData);
        localStorage.setItem('swdToolsData', swdToolsDataJson);
    },

    loadAppData: () => {
        var swdToolsDataJson = localStorage.getItem('swdToolsData');
        swdToolsDataJson = swdToolsDataJson || '{}';
        const swdToolsData = JSON.parse(swdToolsDataJson);

        fixAppDataFormat(swdToolsData);
        return swdToolsData;
    },

    appendIssueKeyToCsv: (currentIssueKeys, currentIssueKeysCsv, newIssueKey) => {
            const keyExists = currentIssueKeys.includes(newIssueKey);
            if(keyExists === true){
                alert(`Issue key ${newIssueKey} already exists.`);
                return currentIssueKeysCsv;
            }
            const toAddPrefix = currentIssueKeys.length >0 ? ',':'';
            const toAdd = toAddPrefix + newIssueKey;

            currentIssueKeysCsv += toAdd;
            return currentIssueKeysCsv;
    }

}