<template>
    <div class="app-data-input func-gap-bottom">
        <div class="app-data-current func-flex-row func-flex-row--spaced">
            <div>
                <TrackedIssues 
                    :issueKeys="currentIssueKeys"
                    @refresh="refreshIssueKey"
                    @remove="removeIssueKey"
                    @reorder="handleReorder"
                />
            </div>
            <div class="func-flex-grow"></div>
            <div class="func-flex-col" style="margin:0px 30px; align-items: flex-start;">
                <label for="id-add-issue" class="func-nowrap func-bold">Add Issue</label>
                    <input id="id-add-issue" type="text" v-model="newIssueKey" @input="issueKeyToUpperCase"/>
                <div class="func-flex-row func-flex-row--spaced" style="width: calc(100% + 10px); margin-top: 5px; justify-content: flex-start;">
                    <div class="func-tag func-nowrap func-tag-btn" @click="addIssueKey()">Add</div>     
                    <div class="func-tag func-nowrap func-tag-btn" @click="addIssueKey(true)">Add Today</div>     
                </div>
            </div>

            <Menu menuId="historyMenu"
                :menuItems="historyMenuItems"
                    noDataCaption="No other issues in history."
                    @item-click="onHistoryItemClick" >
                <template #caption>
                    History Menu <span><font-awesome-icon :icon="['fas', 'caret-down']" /></span>                   
                </template>
            </Menu>

            <!-- div class="func-tag func-nowrap func-tag-btn" @click="downloadData()"><span><font-awesome-icon :icon="['fas', 'download']" /></span></div -->
        </div>
    </div> <!-- END data input -->    
</template>
<script>
import moment from 'https://cdn.jsdelivr.net/npm/moment@2.29.1/dist/moment.js';
import TrackedIssues from '../components/TrackedIssues.vue';

export default {
    components: {
        TrackedIssues
    },
    props: ['currentIssueKeys', 'historyMenuItems'],
    data(){
        return {
            newIssueKey: ''
        }
    },
    methods: {
        onHistoryItemClick(issueKey){
            this.$emit('add-issue-key', issueKey);
        },
        issueKeyToUpperCase(){
            this.newIssueKey = this.newIssueKey.toUpperCase();
        },
        addIssueKey(forDateKey) {
            if(forDateKey){
                let dateKey = 'DAY-' + moment().format('DDMMM');
                this.$emit('add-issue-key', dateKey);
            }else{
                this.$emit('add-issue-key', this.newIssueKey);
                this.newIssueKey = '';
            }
        },
        removeIssueKey(issueKey) {
            this.$emit('remove-issue-key', issueKey);
        },
        refreshIssueKey(issueKey) {
            this.$emit('refresh-issue-key', issueKey);
        },
        downloadData(){
            var swdToolsDataJson = localStorage.getItem('swdToolsData');
            swdToolsDataJson = swdToolsDataJson || '{}';
            
            const blob = new Blob([swdToolsDataJson], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'swd-tools-exp-data-'+ moment().format('DDMMM') +'.json';
            link.click();
            URL.revokeObjectURL(url);
        },
        handleReorder(newOrder) {
            this.$emit('reorder-issue-keys', newOrder);
        }
    }
}
</script>

<style scoped>
.func-tag-btn {
    cursor: pointer;
}
</style>