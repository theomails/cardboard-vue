<template>
  <div>
    <div class="func-bold func-nowrap">Tracked Issues</div>
    <div ref="parent" class="app-issue-tags func-flex-grow func-flex-row func-flex-row--spaced func-flex-row--wrap"
        style="justify-content: flex-start;">
      <div v-for="(issueKey, index) in list" 
          :key="issueKey"
          :index="index"
          class="func-tag func-nowrap">
          <span class="drag-handle"><font-awesome-icon :icon="['fas', 'grip-vertical']" /></span>
          <span>{{ issueKey }}</span>
          <span class="func-close-x" @click.stop="refreshIssue(issueKey)"><font-awesome-icon :icon="['fas', 'rotate']" /></span>
          <span class="func-close-x" @click.stop="removeIssue(issueKey)">X</span>
      </div>
    </div>                
    <div v-if="list.length === 0">
      No issues currently being tracked.
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDragAndDrop } from 'vue-fluid-dnd';

const props = defineProps({
  issueKeys: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['refresh', 'remove', 'reorder']);

// Create a reactive reference to track the list
const list = ref([...props.issueKeys]);

// Watch for changes to the props
watch(() => props.issueKeys, (newValue) => {
  list.value = [...newValue];
}, { immediate: true });

// Set up drag and drop with horizontal direction
const { parent } = useDragAndDrop(list, { 
  direction: "horizontal",
  onDragEnd: () => {
    emit('reorder', list.value);
  }
});

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

.drag-handle {
  cursor: move;
  margin-right: 5px;
  color: white;
}

.func-tag:hover .drag-handle {
  color: #e0e0e0;
}

.func-tag {
  display: flex;
  align-items: center;
  margin: 2px;
  padding: 3px 6px;
}

.app-issue-tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style> 