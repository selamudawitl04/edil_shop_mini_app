<template>
  <!-- Comment Dialog -->
  <BaseDialog v-model="open" title="Prayer Updates">
    <template #heading>
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 gap-2 px-0">
        <h3 class="text-lg lg:text-xl font-semibold text-textPrimary-light dark:text-textPrimary-dark">
          Updates ({{ _updates?.length || 0 }})
        </h3>

        <!-- Sort Dropdown -->
        <div>
          <label for="sort" class="sr-only">Sort updates</label>
          <select v-model="selectSort" id="sort"
            class="w-full lg:w-auto px-3 py-2 pr-10 rounded-md border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-slate-800 text-sm text-textPrimary-light dark:text-textPrimary-dark appearance-none">
            <option value="new_first">Newest First</option>
            <option value="old_first">Oldest First</option>
          </select>
        </div>
      </div>
    </template>

    <template #content>
      <div>
        <!-- Update List -->
        <template v-if="_updates?.length">
          <div class="space-y-4">
            <PrayerUpdateCard v-for="update in _updates" :key="update.id" :prayer-update="update" />
          </div>
        </template>

        <!-- No Updates Message -->
        <template v-else>
          <p class="text-center text-textSecondary-light dark:text-textSecondary-dark py-8">
            No updates have been added yet.
          </p>
        </template>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
const props = defineProps({
  updates: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
// Sort state
const selectSort = ref("new_first"); // options: "new_first", "old_first", etc.

const _updates = computed(() => {
  return props.updates.sort((a, b) => {
    if (selectSort.value === "new_first") {
      return b.update_order - a.update_order; // Newest first
    } else if (selectSort.value === "old_first") {
      return a.update_order - b.update_order; // Oldest first
    }
    return 0; // fallback (no sorting)
  });
});
</script>
