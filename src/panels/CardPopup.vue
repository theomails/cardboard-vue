<template>
    <div class="func-card-popup-outer app-modal-bg">
        <div class="func-card-popup app-modal-window">
            <div v-if="issue">
                <RfcCard v-if="cardType == 'rfc'" 
                    :issue
                    :issueComment
                    :myName
                    @remove-issue-key='closeCardPopup'
                    @refresh-issue-key='refreshIssueKey'
                    @save-issue-comment='saveIssueComment'
                    >
                </RfcCard>
                <IssueCard v-if="cardType == 'issue'" 
                    :issue
                    :issueComment
                    :myName
                    @remove-issue-key='closeCardPopup'
                    @refresh-issue-key='refreshIssueKey'
                    @save-issue-comment='saveIssueComment'
                    >
                </IssueCard>                         
            </div>   
            <div v-else>
                Loading...
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        cardType: {
            type: String,
            required: true
        },
        issueKey: {
            type: String,
            required: true
        },
        issue: {
            type: Object,
            required: true
        },
        issueComment: {
            type: String
        },
        myName: {
            type: String,
            required: true
        }
    },
    emits: ['close-card-popup', 'refresh-issue-key', 'save-issue-comment'],
    data() {

    },
    methods: {
        closeCardPopup() {
            this.$emit('close-card-popup');
        },
        refreshIssueKey(key) {
            this.$emit('refresh-issue-key', key);
        },
        saveIssueComment(issueKey, comment) {
            this.$emit('save-issue-comment', issueKey, comment);
        }
    }
}
</script>
<style>
.func-card-popup {
    margin-left: auto;
    margin-right: auto;
    clear: both;
}
</style>