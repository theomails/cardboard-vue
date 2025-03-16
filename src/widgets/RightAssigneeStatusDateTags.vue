<template>
    <span class="func-flex-grow"></span>
    <span v-if="jiraObj.changeWindowStart" class="func-tag func-nowrap">{{ jiraObj.changeWindowStart.substring(0, 10) }}</span>
    <span v-if="jiraObj.assigneeName" class="func-tag func-nowrap">{{ jiraObj.assigneeName }}</span>
    <span class="func-tag func-nowrap">{{ jiraObj.status }}</span>
</template>
<script>
export default {
    props: ['jiraObj']
}
</script>