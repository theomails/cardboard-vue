<template>
        <span class="func-flex-grow"></span>
        <span class="func-tag">
            <b><a target="_blank" :href="jiraLink">{{ jiraObj.key }}</a></b> : 
            <b>{{ jiraObj.summary }}</b></span>    
</template>
<script>
export default {
    props: ['jiraObj', 'jiraLink']
}
</script>