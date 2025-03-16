<template>
    <span :title="jiraObj.summary"
        style="overflow: hidden;white-space:nowrap;text-overflow:ellipsis;font-size: 0.8em" 
        class="func-flex-grow">
        <a target="_blank" :href="jiraLink">{{ jiraObj.key }}: {{ jiraObj.summary }}</a>
    </span>    

</template>
<script>
export default {
    props: ['jiraObj', 'jiraLink']
}
</script>