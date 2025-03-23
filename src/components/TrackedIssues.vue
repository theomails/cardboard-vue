<template>
  <div>
    <div class="func-bold func-nowrap">Tracked Issues</div>
    <div class="app-issue-tags func-flex-grow func-flex-row func-flex-row--spaced func-flex-row--wrap"
        style="justify-content: flex-start;">
      <div v-for="issueKey in props.issueKeys" :key="issueKey" class="func-tag func-nowrap">
        <span>{{ issueKey }}</span>
        <span class="func-close-x" @click="refreshIssue(issueKey)"><font-awesome-icon :icon="['fas', 'rotate']" /></span>
        <span class="func-close-x" @click="removeIssue(issueKey)">X</span>
      </div>
    </div>                
    <div v-if="props.issueKeys.length === 0">
      No issues currently being tracked.
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  issueKeys: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['refresh', 'remove']);

const refreshIssue = (issueKey) => {
  emit('refresh', issueKey);
};

const removeIssue = (issueKey) => {
  emit('remove', issueKey);
};
</script>

<style scoped>
.func-close-x {
  cursor: pointer;
}
</style> 