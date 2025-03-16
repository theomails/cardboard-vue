<template>
    <div class="func-flex-row func-flex-row--spaced app-comment-row" :style="styleFromComment">
        <div class="func-nowrap">Comments: </div>
        <div class="func-flex-grow" :class="{'func-ta-subtle': !isCommentChanged}">
            <textarea :rows="commentLineCount" v-model="myIssueComment"></textarea></div>

        <Menu :menuId="'colorMenu-' + issue.key"
            menuMaxWidth="200px"
            :menuItems="colorStatusItems"
                noDataCaption="No match."
                :itemRenderer="colorItemRenderer"
                :searchTextRenderer="colorItemSearchTextRenderer"
                @item-click="onColorItemClick" >
            <template #caption>
                <font-awesome-icon :icon="['fas', 'palette']" />
            </template>
        </Menu>

        <div v-if="isCommentChanged" class="func-tag func-nowrap func-tag-btn" @click="saveIssueComment">Save</div>
        <div v-if="isCommentChanged" class="func-tag func-nowrap func-tag-btn" @click="revertIssueComment">
            <font-awesome-icon :icon="['fas', 'arrow-rotate-left']" />
        </div>
    </div>    
</template>
<script>
import Menu from "../widgets/Menu.vue";

export default {
    props: ['issueComment', 'issue'],
    data(){
        return {
            myIssueComment: '',
            colorStatusItems: [
             { key: "white", title: "-No Color-" },
             { key: "lightpink", title: "To Do" },
             { key: "lightyellow", title: "In Progress" },
             { key: "palegreen", title: "Done" },
             { key: "lightskyblue", title: "On Hold" },
             { key: "lavender", title: "Groomed" },
             { key: "lightcoral", title: "Overdue" },
             { key: "peachpuff", title: "Waiting" },
             { key: "mintcream", title: "Low Prio" },
             { key: "lightsteelblue", title: "Blocked" },
             { key: "thistle", title: "Backlog" }
           ]
        }
    },
    mounted(){
        this.myIssueComment = this.issueComment || '';
    },
     watch:{
         issueComment(){
             this.myIssueComment = this.issueComment || '';
         }
     },
    methods: {
        saveIssueComment(){
            this.$emit('save-issue-comment', this.issue.key, this.myIssueComment);
        },
        revertIssueComment(){
            this.myIssueComment = this.issueComment || '';
        },
        onColorItemClick(colorItemKey){
            const colorItem = this.colorStatusItems.find((item)=> item.key == colorItemKey);
            var colorLine = `${colorItem.title} (#color: ${colorItem.key})`;
            var colorLinePlus = colorLine + '\n';
            if(colorItemKey == 'white'){
                colorLine = '';
                colorLinePlus = '';
            }

            if(!this.myIssueComment){
                this.myIssueComment = colorLine;
            } else {
                const lines = this.myIssueComment.split('\n');
                const firstLine = lines[0];
                const remainingText = lines.slice(1).join('\n');
                if( firstLine.includes('#') && firstLine.includes('color') ){
                    this.myIssueComment = colorLinePlus + remainingText;
                } else {
                    this.myIssueComment = colorLinePlus + this.myIssueComment;
                }
            }
            this.saveIssueComment();
        },
        colorItemRenderer(colorItem){
            return `<div class="func-color-square" style="background-color: ${colorItem.key}" title="${colorItem.key}"></div>`
                + ` <span title="${colorItem.key}">${colorItem.title}</span>`;
        },
        colorItemSearchTextRenderer(colorItem){
            return `${colorItem.key} ${colorItem.title}`;
        }
    },
    computed: {
        isCommentChanged(){
            var myIssueComment = this.myIssueComment || '';
            var inIssueComment = this.issueComment || '';
            return myIssueComment !== inIssueComment;
        },
        commentLineCount() {
            var comment = this.myIssueComment || '';
            const matches = comment.match(/\n/g);
            return matches ? matches.length + 1 : 1;
        },
        styleFromComment(){
            const regex = /([\s\S]*?)#color:([\s\S]*?)([\w#]+)([\s\S]*)/;

            var myIssueComment = this.myIssueComment || '';
            const match = myIssueComment.match(regex);

            if (match) {
                const color = match[3];
                return {
                    backgroundColor: color
                };
            }
            return {};
        }
    },
    components: {
        Menu
    }
}
</script>