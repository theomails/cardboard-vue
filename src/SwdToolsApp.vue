<template>
    <div style='display:flex'>
        <h2>Cardboard for JIRA</h2>
        <div style='flex-grow:1'></div>
        <div><a href="#" @click.stop="reviewSetup=true">User Credentials</a></div>
    </div>
    <SetupOverlay v-if='userObj == null || reviewSetup' 
        :reviewSetup
        @user-obj-found="onUserObjFound" />
    <div>
        <ControlPanel :currentIssueKeys='currentIssueKeys' :historyMenuItems="filteredHistoryMenuItems"
                @add-issue-key='addIssueKey' @remove-issue-key='removeIssueKey' 
                @refresh-issue-key='refreshIssueKey' ></ControlPanel>
        
        <div class="func-cards-container">
            <div v-for="issueKey in rfcKeys">
                <RfcCard v-if="currentIssuesData[issueKey]?.data" 
                    :issue="currentIssuesData[issueKey]?.data" 
                    :issueComment="swdToolsData.issueComments[issueKey]"
                    :myName='userDetails.userDisplayName'
                    @remove-issue-key='removeIssueKey'
                    @refresh-issue-key='refreshIssueKey'
                    @save-issue-comment='saveIssueComment'
                    >
                </RfcCard>
                <div v-else>
                    <div class="func-card issue-card">
                        <div class="func-flex-row func-flex-row--spaced">
                            <span>{{issueKey}}</span>
                            <span class="func-flex-grow">{{ currentIssuesData[issueKey]?.errorMsg ? currentIssuesData[issueKey]?.errorMsg : 'Loading...' }}</span>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        
        <div class="func-cards-container">
            <div v-for="issueKey in storyKeys">
                <IssueCard v-if="currentIssuesData[issueKey]?.data" 
                    :issue="currentIssuesData[issueKey]?.data" 
                    :issueComment="swdToolsData.issueComments[issueKey]"
                    :myName='userDetails.userDisplayName'
                    @remove-issue-key='removeIssueKey'
                    @refresh-issue-key='refreshIssueKey'
                    @save-issue-comment='saveIssueComment'
                    >
                </IssueCard>
                <div v-else>
                    <div class="func-card issue-card">
                        <div class="func-flex-row func-flex-row--spaced">
                            <span>{{issueKey}}</span>
                            <span class="func-flex-grow">{{ currentIssuesData[issueKey]?.errorMsg ? currentIssuesData[issueKey]?.errorMsg : 'Loading...' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </div>
</template>
<script>
import userAppDataService from './services/userappdataservice.js';
import jiraservice from './services/jiraservice.js';
import userdetailsservice from './services/userdetailsservice.js';

export default {
    data() {
        return {
            userObj: null, //User email, name, token purely in LS
            reviewSetup: false,
            currentIssuesData: {}, //PURELY memory cache of Jira details
            swdToolsData: {
                currentIssueKeysCsv: null, //Persisted
                historyMenuItems: {}, //Persisted
                issueComments: {} //Persisted
            }
        };
    },
    methods: {
        onUserObjFound(userObj){
            this.userObj = userObj;
            this.reviewSetup = false;
            this.loadUserAppData();
        },
        loadUserAppData(){
            console.log('load user data');
            userAppDataService.loadAppData()
                .then((swdToolsData)=>{
                    this.swdToolsData = swdToolsData;
                    this.$nextTick(()=>{
                        console.log('load all keys jira data');
                        console.log(this.currentIssueKeys);
                        this.currentIssueKeys.forEach(issueKey => this.loadIssueDetails(issueKey));
                    });
                })
                .catch((error)=>{
                    console.log(error);
                    alert("Error occured while loading User app data. ");
                });
        },
        persistAppData(){
            console.log('persisting user data');
            userAppDataService.persistAppData(this.swdToolsData) //Fire and inform only on error
                .catch((error)=>{
                    console.log(error);
                    alert('Some error occured while saving User app data.');
                })
        },
        addIssueKey(newIssueKey){
            if(!newIssueKey){
                alert(`Invalid issue key .`);
                return currentIssueKeysCsv;
            }
            newIssueKey = newIssueKey.trim().toUpperCase(); //clean

            console.log('appending key');
            this.swdToolsData.currentIssueKeysCsv = userAppDataService.appendIssueKeyToCsv(
                                                        this.currentIssueKeys,
                                                        this.swdToolsData.currentIssueKeysCsv,
                                                        newIssueKey);
            console.log('saving user data');
            this.persistAppData(); //Fire and forget
            console.log('loading jira data');
            this.loadIssueDetails(newIssueKey);
        },
        removeIssueKey(issueKey){
            console.log('removing key');
            this.swdToolsData.currentIssueKeysCsv = this.swdToolsData.currentIssueKeysCsv
                                            .replace(',' + issueKey, '') //Either format
                                            .replace(issueKey, '') //Either format
                                            .replace(',,', ',') //Prior missed cleanup
                                            .replace(/^,/, ""); //And no starting comma left behind.

            console.log('saving user data');
            this.persistAppData(); //Fire and forget
            console.log('clearing local jira data');
            delete this.currentIssuesData[issueKey];
        },
        refreshIssueKey(issueKey){
            console.log('clearing local jira data');
            delete this.currentIssuesData[issueKey];
            console.log('loading jira data');
            this.loadIssueDetails(issueKey);
        },
        loadIssueDetails(issueKey) {
            if(issueKey.startsWith('DAY-')){
                console.log('placing dummy data for day');
                this.placeDummyData(issueKey, 'Day log entry');
                return;
            }
            
            const apiEntity = issueKey.match('(RFC|CAB)-(.*)') ? 'rfc' : 'issue';

            console.log('Service call for jira data');
            jiraservice.getDetails(apiEntity, issueKey, issueKey)
                .then(response => {
                    console.log('api response for jira data');
                    console.log(response);

                    this.currentIssuesData[issueKey] = {
                        data: response
                    };
                    this.swdToolsData.historyMenuItems[issueKey] = response.summary;
                    this.persistAppData(); //Fire and forget
                })
                .catch(error => {
                    console.log('api error for jira data');
                    console.log(error);
                    this.placeDummyData(issueKey, 'Failed to load data');
                })
        },
        saveIssueComment(issueKey, comment){
            console.log('noting issue comment');
            this.swdToolsData.issueComments[issueKey] = comment || '';
            console.log('saving user data');
            this.persistAppData(); //Fire and forget
        },
        placeDummyData(issueKey, reasonForDummy){
            console.log('noting dummy data for issue');
            this.currentIssuesData[issueKey] = {};
            this.currentIssuesData[issueKey].data = {
                    key: issueKey,
                    summary: 'No data',
                    parent: null,
                    rfc: null,
                    changeWindowStart: null,
                    assigneeName: null,
                    status: 'Unknown',
                    myTasks: [],
                    allTasks: []
                };
            this.currentIssuesData[issueKey].errorMsg = reasonForDummy; //Not used anymore

            console.log('noting history entry for dummy key'); //Should we do this.
            this.swdToolsData.historyMenuItems[issueKey] = this.swdToolsData.historyMenuItems[issueKey] || 'No data';
            console.log('saving user data');
            this.persistAppData(); //Fire and forget
        }
    },
    mounted(){

    },
    computed:{
        userDetails(){
            return userdetailsservice.getLocalStorageUser();
        },
        currentIssueKeys(){
            var currentIssueKeysCsv = this.swdToolsData.currentIssueKeysCsv;
            currentIssueKeysCsv = currentIssueKeysCsv || '';
            return currentIssueKeysCsv.length === 0 ? [] : currentIssueKeysCsv.split(',').filter(str => str !== "");
        },
        storyKeys(){
            return this.currentIssueKeys.filter(key => !key.match('(DAY|RFC|CAB)-(.*)'));
        },
        rfcKeys(){
            return this.currentIssueKeys.filter(key => key.match('(DAY|RFC|CAB)-(.*)'));
        },
        filteredHistoryMenuItems(){
            const excludedHistoryItems = [];
            Object.keys(this.swdToolsData.historyMenuItems)
                .forEach(key => {
                    if(!this.currentIssueKeys.includes(key)){
                        const historyItem = {
                            key,
                            title: this.swdToolsData.historyMenuItems[key]
                        };
                        excludedHistoryItems.unshift(historyItem);
                    }
                });

            return excludedHistoryItems;
        }
    }
}
</script>