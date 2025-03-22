<template>
    <div class="app-task-row func-flex-row func-flex-row--spaced">
        <span class="func-close-x" @click="copyIssueKey(jiraObj.key)"><font-awesome-icon :icon="['fas', 'copy']" /></span>
        <span class="func-nowrap ">
            <a target="_blank" :href="jiraLink">{{ jiraObj.key }}</a>   
        </span>
        <span class="func-nowrap func-tag" style="margin-left: 3px;margin-right: 3px;font-size:0.8em;background-color: #75a6c6">
            {{ jiraObj.status }}   
        </span>
        <span :title="jiraObj.summary"
                style="overflow: hidden;white-space:nowrap;text-overflow:ellipsis;"
                class="func-flex-grow ">{{ jiraObj.summary }}</span>
    </div>    
</template>
<script>
export default {
    props: ['jiraObj', 'jiraLink'],
    methods: {
        copyIssueKey(issueKey) {
            navigator.clipboard.writeText(issueKey)
                .then(() => {
                    console.log('Issue key copied to clipboard:', issueKey);
                })
                .catch(err => {
                    console.error('Failed to copy issue key:', err);
                });
        }
    }
}
</script>
<style>
.app-task-row .func-close-x{
    color: #666;
}
</style>