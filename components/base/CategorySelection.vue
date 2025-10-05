<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark mb-2">
        {{ header }}
      </label>
      <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark mb-4">
        {{ description }}
      </p>
    </div>

    <!-- Category Groups -->
    <div class="space-y-6">
      <div v-for="(group, groupIndex) in categoryGroups" :key="group.id"
        class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4">
        <div class="mb-3">
          <h4 class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-1">
            {{ group.name }}
          </h4>
          <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
            {{ group.description }}
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <label v-for="category in group.categories" :key="category.id"
            class="relative flex items-center space-x-2 p-2 rounded border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-gray-800 transition-all"
            :class="{
              'border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10 cursor-pointer hover:bg-primary-light/5 dark:hover:bg-primary-dark/5': selectedCategories.includes(category.id),
              'cursor-not-allowed opacity-50': !isCategorySelectable(category.id, groupIndex) && !selectedCategories.includes(category.id),
              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700': isCategorySelectable(category.id, groupIndex) && !selectedCategories.includes(category.id)
            }" @click="handleCategoryClick(category.id, groupIndex)">
            <div
              class="flex-shrink-0 w-4 h-4 border-2 border-borderColor-light dark:border-borderColor-dark rounded flex items-center justify-center"
              :class="{
                'border-primary-light dark:border-primary-dark bg-primary-light dark:bg-primary-dark': selectedCategories.includes(category.id),
                'opacity-50': !isCategorySelectable(category.id, groupIndex) && !selectedCategories.includes(category.id)
              }">
              <svg v-if="selectedCategories.includes(category.id)" class="w-2.5 h-2.5 text-white" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-xs font-medium text-textPrimary-light dark:text-textPrimary-dark">
              {{ category.name }}
            </span>
          </label>
        </div>

        <!-- Error message when limit is reached -->
        <div v-if="showLimitError && getSelectedInGroup(groupIndex).length >= maxPerGroup"
          class="mt-2 p-2 bg-danger-light/10 dark:bg-danger-dark/10 border border-danger-light dark:border-danger-dark rounded text-xs">
          <div class="flex items-center space-x-1">
            <svg class="w-3 h-3 text-danger-light dark:text-danger-dark" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            <span class="text-danger-light dark:text-danger-dark">
              You can only select up to {{ maxPerGroup }} categories for "{{ group.name }}".
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Categories Summary -->
    <div v-if="selectedCategories.length > 0"
      class="mt-4 p-3 bg-primary-light/5 dark:bg-primary-dark/5 border border-primary-light/20 dark:border-primary-dark/20 rounded-lg">
      <p class="text-xs font-medium text-textPrimary-light dark:text-textPrimary-dark mb-2">
        Selected Categories ({{ selectedCategories.length }})
      </p>
      <div class="flex flex-wrap gap-1">
        <span v-for="categoryId in selectedCategories" :key="categoryId"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark">
          {{ getCategoryNameById(categoryId) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toast-notification";
import listQuery from "@/graphql/categories/groups.gql";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  header: {
    type: String,
    default: "Categories"
  },
  description: {
    type: String,
    default: "Select up to 5 categories that best describe your content"
  },
  maxPerGroup: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['update:modelValue']);

const toast = useToast();

// State
const selectedCategories = ref(props.modelValue || []);
const categoryGroups = ref([]);
const showLimitError = ref(false);

// Computed
const selectedCategoriesComputed = computed({
  get: () => selectedCategories.value,
  set: (value) => {
    selectedCategories.value = value;
    emit('update:modelValue', value);
  }
});

// Methods
const isCategorySelectable = (categoryId, groupIndex) => {
  const selectedInGroup = getSelectedInGroup(groupIndex);
  return selectedInGroup.length < props.maxPerGroup || selectedCategories.value.includes(categoryId);
};

const getSelectedInGroup = (groupIndex) => {
  const groupCategoryIds = categoryGroups.value[groupIndex]?.categories.map(c => c.id) || [];
  return selectedCategories.value.filter(id => groupCategoryIds.includes(id));
};

const getCategoryNameById = (id) => {
  const allCategories = categoryGroups.value.flatMap(g => g.categories);
  return allCategories.find(c => c.id === id)?.name || "Unknown";
};

const handleCategoryClick = (categoryId, groupIndex) => {
  if (selectedCategories.value.includes(categoryId)) {
    // If already selected, deselect it
    selectedCategories.value = selectedCategories.value.filter(id => id !== categoryId);
  } else if (isCategorySelectable(categoryId, groupIndex)) {
    // If not selected and selectable, select it
    selectedCategories.value.push(categoryId);
  } else {
    // If not selectable, show error
    showLimitError.value = true;
    setTimeout(() => {
      showLimitError.value = false;
    }, 3000);
  }

  // Emit the updated value
  emit('update:modelValue', selectedCategories.value);
};

// Fetch categories
const { onResult, onError } = queryList(listQuery, {});
onResult(({ data }) => {
  if (data?.category_groups?.length) {
    // Filter out Community category and merge Spiritual Focus with Prayer Intentions
    const filteredGroups = data.category_groups.filter(group =>
      !group.name.toLowerCase().includes('community')
    );

    // Find Spiritual Focus and Prayer Intentions groups
    const spiritualFocus = filteredGroups.find(group =>
      group.name.toLowerCase().includes('spiritual focus')
    );
    const prayerIntentions = filteredGroups.find(group =>
      group.name.toLowerCase().includes('prayer intention')
    );

    // Merge them if both exist
    if (spiritualFocus && prayerIntentions) {
      const mergedGroup = {
        id: spiritualFocus.id,
        name: "Prayer Focus & Intentions",
        description: "Choose the areas that best reflect your spiritual focus and prayer intentions.",
        categories: [...spiritualFocus.categories, ...prayerIntentions.categories]
      };

      // Remove the original groups and add the merged one
      const otherGroups = filteredGroups.filter(group =>
        group.id !== spiritualFocus.id && group.id !== prayerIntentions.id
      );

      categoryGroups.value = [mergedGroup, ...otherGroups];
    } else {
      // If one or both don't exist, just filter out community
      categoryGroups.value = filteredGroups;
    }
  }
});

onError(() => {
  toast.error("Failed to load categories. Please refresh the page.", { position: "top-right" });
});
</script>