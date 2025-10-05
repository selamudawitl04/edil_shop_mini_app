<template>
  <div class="max-w-full overflow-x-auto no-scrollbar">
    <div class="inline-flex space-x-2 py-1  whitespace-nowrap">
      <button
        v-for="(status, index) in statuses"
        :key="status.name"
        @click="activeIndex = index"
        :class="[
          'flex items-center gap-2 px-4 py-1 text-sm font-medium rounded-md transition whitespace-nowrap shrink-0',
          activeIndex === index
            ? 'bg-gray-200 text-primary-light dark:bg-gray-700 dark:text-primary-dark'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
        ]"
      >
        <span>{{ status.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },

  statuses: {
    type: Array,
    default: () => [],
  },
});

const activeIndex = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
</script>
