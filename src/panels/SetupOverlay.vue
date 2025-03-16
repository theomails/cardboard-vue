<template>
    <div class="func-setup-overlay-outer app-modal-bg">
        <div class="func-setup-overlay app-modal-window">
            <div class="app-modal-header">
                <h3>Cardboard for JIRA - User Configuration</h3>
            </div>
            <div class="app-modal-body">
                <div class="func-setup-form">
                    <div v-if="pageNum==1" class="app-form-row">
                        <p>Welcome to Cardboard for JIRA's User Configuration page.</p>
                        <p>Please enter the credentials in the upcoming pages carefully (preferably copy paste the information)</p>

                        <p class="func-no-gap-bottom"><b>Privacy Notice</b></p>
                        <ul class="func-left-indent func-gap-bottom">
                        <li>Your credentials are safe! The credentials are stored only on <em>this browser</em> on <em>this machine</em>, not on the cloud.</li>
                        <li>You will have to setup these credentials again if you want to access your data on another brower or machine.</li>
                        <li>All your comments are stored in the cloud, against your email id.</li>
                        <li>Jira story or RFC details are accessed live from Jira and are not copied anywhere.</li>
                        </ul>
                    </div>
                    <div v-if="pageNum==2" class="app-form-row func-gap-top func-flex-col func-flex-col--spaced func-flex-col--fullwidth">
                        <label for="setup-userEmail">Your Official Email ID</label>
                        <input id="setup-userEmail" ref="setup-userEmail" @keypress="validate"
                            class="" type="text" v-model="userEmail" placeholder="first.last@company.com"/>
                        <p v-if="errorMsg" class="func-form-error-info">{{ errorMsg }}</p>

                        <ul class="func-left-indent func-gap-bottom">
                        <li>Your email ID will be used as the identifier to access your comments and story interaction history</li>
                        </ul>
                    </div>
                    <div v-if="pageNum==3" class="app-form-row func-gap-top func-flex-col func-flex-col--spaced func-flex-col--fullwidth">
                        <label for="setup-userJiraToken">Jira Token</label>
                        <textarea rows="3" id="setup-userJiraToken" ref="setup-userJiraToken" @keypress="validate"
                            style='padding: 3px 6px;'
                            class="" type="text" v-model="userJiraToken" placeholder="-- A long alpah-numeric Jira Token --">
                        </textarea>
                        <p v-if="errorMsg" class="func-form-error-info">{{ errorMsg }}</p>

                        <ul class="func-left-indent func-gap-bottom">
                        <li>Your Jira Token will be used to fetch live story details on your behalf.</li>
                        <li>Jira story or RFC details are not copied anywhere.</li>
                        <li>All credentials are stored only on <em>this browser</em> on <em>this machine</em>, not on the cloud</li>
                        </ul>
                    </div>
                    <div v-if="pageNum==4" class="app-form-row func-gap-top func-gap-bottom func-flex-col func-flex-col--spaced func-flex-col--fullwidth">
                        <label for="setup-userDisplayName">Your Display Name in Jira</label>
                        <input  id="setup-userDisplayName" ref="setup-userDisplayName" @keypress="validate"
                            class="" type="text" v-model="userDisplayName" placeholder="Firstname Surname"/>
                        <p v-if="errorMsg" class="func-form-error-info">{{ errorMsg }}</p>

                        <ul class="func-left-indent func-gap-bottom">
                        <li>Your display name in Jira will be used to identify which tasks are assigned to you</li>
                        </ul>
                    </div>
                    <div v-if="pageNum==5" class="app-form-row func-gap-top func-gap-bottom func-flex-col func-flex-col--spaced func-flex-col--fullwidth">
                        <label for="setup-userDisplayName">Backup your credentials</label>
                        <p>You can copy and keep a backup of this information in your mailbox or notes. This will help you 
                        get started easily, if you want to use a different browser or another machine.</p>
                        <ul class="func-left-indent func-gap-bottom">
                        <li><b>Official Email ID:</b> {{userEmail}}</li>
                        <li style='overflow-wrap: break-word;'><b>Jira Token:</b> {{userJiraToken}}</li>
                        <li><b>Display Name in Jira:</b> {{userDisplayName}}</li>
                        <li>If you notice any mistakes, please go back and correct the inputs right away.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="app-modal-footer func-flex-row func-flex-row--spaced">
                <div class="func-flex-grow"></div>
                <div v-if="pageNum>1" class="func-tag func-nowrap func-tag-btn" @click="previousPage">Previous</div>
                <div v-if="pageNum<5" class="func-tag func-nowrap func-tag-btn" @click="nextPage">Next</div>
                <div v-if="pageNum==5" class="func-tag func-nowrap func-tag-btn" @click="saveClick">Save</div>
            </div>
        </div>
    </div>    
</template>
<script>
import userLSDataService from '../services/userdetailsservice.js';

export default {
    props: ['reviewSetup'],
    data(){
        return {
            pageNum: 1,
            userEmail: '',
            userJiraToken: '',
            userDisplayName: '',
            errorMsg: ''
        };
    },
    mounted(){
        const userObj = userLSDataService.getLocalStorageUser();       
        if(userObj && userObj.userEmail && userObj.userEmail.length > 5){ //Something is there
            this.userEmail = userObj.userEmail;     
            this.userJiraToken = userObj.userJiraToken;
            this.userDisplayName = userObj.userDisplayName;            
            if(!this.reviewSetup){
                //Already configured, hide
                this.$emit('user-obj-found', userObj);
            }
        }
    },
    methods: {
        validate(){
            if(this.pageNum == 2) {
                if(!this.userEmail || this.userEmail.length <= 5) {
                    this.errorMsg = "Please enter a valid email id";
                    return;
                }
            } else if(this.pageNum == 3) {
                if(!this.userJiraToken || this.userJiraToken.length <= 5) {
                    this.errorMsg = "Please enter a valid Jira token";
                    return;
                }
            } else if(this.pageNum == 4) {
                if(!this.userDisplayName || this.userDisplayName.length <= 5) {
                    this.errorMsg = "Please enter a valid display name";
                    return;
                }
            }
            //Fall through for no errors
            this.errorMsg = '';
        },
        nextPage(){
            this.validate();
            if(this.errorMsg == ''){
                this.pageNum++;
                this.$nextTick(()=>{ this.focusInput() });
            }
        },
        previousPage(){
            this.pageNum--;
            this.$nextTick(()=>{ this.focusInput() });
        },
        focusInput(){
            if(this.pageNum == 2) {
                this.$refs["setup-userEmail"].focus();
            } else if(this.pageNum == 3) {
                this.$refs["setup-userJiraToken"].focus();
            } else if(this.pageNum == 4) {
                this.$refs["setup-userDisplayName"].focus();
            }
        },
        saveClick(){
            const userObj = userLSDataService.saveLocalStorageUser(this.userEmail.trim(), this.userJiraToken.trim(), this.userDisplayName.trim());
            this.$emit('user-obj-found', userObj);
        }
    }
}
</script>