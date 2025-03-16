<template>
    <div v-if="issue" class="func-card rfc-card">
        <div class="func-flex-row func-flex-row--spaced app-card-toolbar">
            <span class="func-flex-grow"></span>
            <span @click="refreshIssueKey(issue.key)" class="func-tag func-nowrap">Refresh <font-awesome-icon :icon="['fas', 'rotate']" /></span>
            <span @click="removeIssueKey(issue.key)" class="func-tag func-nowrap">Close X</span>
        </div>
        <div class="func-flex-row func-flex-row--spaced issue-title func-gap-bottom">
            <MainKeyAndSummaryWithRef :jiraObj="issue" :jiraLink="getActualJiraLink(issue.key)"></MainKeyAndSummaryWithRef>
        </div>
        <div class="func-flex-row func-flex-row--spaced issue-key-info func-gap-bottom">
            <RightAssigneeStatusDateTags :jiraObj="issue"></RightAssigneeStatusDateTags>
        </div>
        <div v-if="issue.rfc" class="func-flex-row issue-rfc func-gap-bottom">
            <RightRfcTag :jiraObj="issue.rfc" :jiraLink="getActualJiraLink(issue.rfc.key)"></RightRfcTag>
        </div>
        <CommentRow :issueComment="issueComment" :issue="issue"
            @save-issue-comment="saveIssueComment" />
        <div v-if="issue.issuesInvolvingMe" class="task-list">
            <span class="func-flex-row func-bold func-gap-bottom">Issues Involving Me (highlight: assigned to me)</span>
            <div v-for="myIssue in issue.issuesInvolvingMe" :key="myIssue.key">
                <TaskRow 
                        style="overflow: hidden; border-bottom: 0px;"
                        class="func-flex-row task-row"
                        :class="{'app-highlight-task': myIssue.assigneeName === myName }"
                        :jiraObj="myIssue" :jiraLink="getActualJiraLink(myIssue.key)"></TaskRow>
                <div class="app-tasks-in-issue">
                    <div v-for="task in myIssue.myTasks" :key="task.key">
                        <TaskRow 
                                style="overflow: hidden;"
                                class="func-flex-row task-row app-highlight-task"
                                :jiraObj="task" :jiraLink="getActualJiraLink(task.key)"></TaskRow>
                    </div>
                </div>
            </div>
        </div>
    </div> <!-- issue-card -->    
</template>
<script>

export default {
    props: ['issue', 'myName', 'issueComment'],
    data(){
        return { }
    },
    methods:{
        getActualJiraLink(objId){
            return `https://redflex.atlassian.net/browse/${objId}`;
        },
        refreshIssueKey(issueKey){
            this.$emit('refresh-issue-key', issueKey);
        },
        removeIssueKey(issueKey){
            this.$emit('remove-issue-key', issueKey);
        },
        saveIssueComment(issueKey, issueComment){
            this.$emit('save-issue-comment', issueKey, issueComment);
        }
    }
}
</script>