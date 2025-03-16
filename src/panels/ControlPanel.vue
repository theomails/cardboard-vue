<template>
    <div class="app-data-input func-gap-bottom">
        <div class="app-data-current func-flex-row func-flex-row--spaced">
            <div class="func-bold func-nowrap">Tracked Issues</div>
            <div class="app-issue-tags func-flex-grow func-flex-row func-flex-row--spaced func-flex-row--wrap">
                <div v-for="issueKey in currentIssueKeys" class="func-tag func-nowrap">
                    <span>{{ issueKey }}</span>
                    <span class="func-close-x" @click="refreshIssueKey(issueKey)"><i class="fa-solid fa-rotate"></i></span>
                    <span class="func-close-x" @click="removeIssueKey(issueKey)">X</span>
                </div>
                <span class="func-flex-grow"></span>
            </div>
            <div v-if="currentIssueKeys.length === 0">
                No issues currently being tracked.
            </div>
            <div class="func-flex-row func-flex-row--spaced">
                <label for="id-add-issue" class="func-nowrap">Add Issue</label>
                <input id="id-add-issue" type="text" v-model="newIssueKey" @input="issueKeyToUpperCase"/>
                <div class="func-tag func-nowrap func-tag-btn" @click="addIssueKey()">Add</div>     
                <div class="func-tag func-nowrap func-tag-btn" @click="addIssueKey(true)">Add Today</div>     
            </div>

            <Menu menuId="historyMenu"
                caption='History Menu <span><i class="fa-solid fa-caret-down"></i></span>'
                :menuItems="historyMenuItems"
                    noDataCaption="No other issues in history."
                    @item-click="onHistoryItemClick" />

            <div class="func-tag func-nowrap func-tag-btn" @click="downloadData()"><span><i class="fa-solid fa-download"></i></span></div>
        </div>
    </div> <!-- END data input -->    
</template>
<script>
import moment from 'https://cdn.jsdelivr.net/npm/moment@2.29.1/dist/moment.js';
import Menu from "../widgets/Menu.vue";

export default {
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
        }
    },
    components: {
        Menu
    }
}
</script>