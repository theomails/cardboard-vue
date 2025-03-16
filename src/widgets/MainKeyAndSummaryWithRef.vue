<template>
    <span class="func-nowrap func-bold">
        <a target="_blank" :href="jiraLink">{{ jiraObj.key }}</a>
    </span>
    <span class="func-flex-grow func-bold">{{ jiraObj.summary }}</span>

</template>
<script>
export default {
    props: ['jiraObj', 'jiraLink']
}
</script>