<template>
    <div v-if="issue" class="func-card issue-card">
        <div class="func-flex-row func-flex-row--spaced app-card-toolbar">
            <span class="func-flex-grow"></span>
            <span @click="refreshIssueKey(issue.key)" class="func-tag func-nowrap">Refresh <font-awesome-icon :icon="['fas', 'rotate']" /></span>
            <span @click="removeIssueKey(issue.key)" class="func-tag func-nowrap">Close X</span>
        </div>
        <div v-if="issue.parent" class="func-flex-row func-gap-bottom" style="overflow: hidden;">
            <SmallTitleWithRef :jiraObj="issue.parent" :jiraLink="getActualJiraLink(issue.parent.key)"></SmallTitleWithRef>
        </div>
        <div class="func-flex-row func-flex-row--spaced issue-title func-gap-bottom">
            <MainKeyAndSummaryWithRef :jiraObj="issue" :jiraLink="getActualJiraLink(issue.key)"></MainKeyAndSummaryWithRef>
        </div>
        <div class="func-flex-row func-flex-row--spaced issue-key-info func-gap-bottom">
            <RightAssigneeStatusTags :jiraObj="issue"></RightAssigneeStatusTags>
        </div>
        <div v-if="issue.rfc" class="func-flex-row issue-rfc func-gap-bottom">
            <RightRfcTag :jiraObj="issue.rfc" :jiraLink="getActualJiraLink(issue.rfc.key)"></RightRfcTag>
        </div>
        <CommentRow :issueComment="issueComment" :issue="issue"
            @save-issue-comment="saveIssueComment" />
        <div v-if="issue.myTasks" class="task-list">
            <span class="func-flex-row func-bold func-gap-bottom">All Tasks (highlight: mine)</span>
            <div v-for="task in issue.allTasks" :key="task.key" 
                    style="overflow: hidden;"
                    class="func-flex-row task-row"
                    :class="{'app-highlight-task': task.assigneeName === myName }">
                <TaskRow :jiraObj="task" :jiraLink="getActualJiraLink(task.key)"></TaskRow>
            </div>
        </div>
    </div> <!-- issue-card -->    
</template>
<script>
import SmallTitleWithRef from "../widgets/SmallTitleWithRef.vue";
import MainKeyAndSummaryWithRef from "../widgets/MainKeyAndSummaryWithRef.vue";
import RightAssigneeStatusTags from "../widgets/RightAssigneeStatusTags.vue";
import RightRfcTag from "../widgets/RightRfcTag.vue";
import CommentRow from "../widgets/CommentRow.vue";
import TaskRow from "./TaskRow.vue";

export default {
    props: ['issue', 'myName', 'issueComment'],
    data(){
        return { }
    },
    methods:{
        getActualJiraLink(objId){
            return `https://redflex.atlassian.net/browse/${objId}`;
        },
        refreshIssueKey(key){
            this.$emit('refresh-issue-key', key);
        },
        removeIssueKey(key){
            this.$emit('remove-issue-key', key);
        },
        saveIssueComment(issueKey, issueComment){
            this.$emit('save-issue-comment', issueKey, issueComment);
        }
    },
    components: {
        SmallTitleWithRef,
        MainKeyAndSummaryWithRef,
        RightAssigneeStatusTags,
        RightRfcTag,
        CommentRow,
        TaskRow
    }
}
</script>