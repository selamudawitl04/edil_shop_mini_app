<template>
  <BaseDialog
    v-model="open"
    :autoClose="false"
    title="🙏 Choose Your Prayer Interests"
  >
    <template #content>
      <!-- Step Content -->
      <div
        v-if="step < groupSteps.length"
        class="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
      >
        <h3
          class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark"
        >
          {{ step + 1 }}. {{ groupSteps[step].name }}
        </h3>
        <p
          class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
        >
          {{ groupSteps[step].description }}
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <label
            v-for="category in groupSteps[step].categories"
            :key="category.id"
            class="flex items-center space-x-2 p-2 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-card-light dark:bg-card-dark cursor-pointer hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition"
          >
            <input
              type="checkbox"
              :value="category.id"
              v-model="selectedCategories"
              :disabled="
                !selectedInCurrentGroup.includes(category.id) &&
                selectedInCurrentGroup.length >= maxPerGroup
              "
              class="text-primary-light dark:text-primary-dark rounded border-borderColor-light dark:border-borderColor-dark focus:ring-primary-light dark:focus:ring-primary-dark"
            />
            <span
              class="text-sm text-textPrimary-light dark:text-textPrimary-dark"
            >
              {{ category.name }}
            </span>
          </label>
        </div>

        <p
          v-if="selectedInCurrentGroup.length >= maxPerGroup"
          class="text-xs text-danger-light dark:text-danger-dark"
        >
          You can select up to {{ maxPerGroup }} interests for this section.
        </p>
      </div>

      <!-- Final Step: Review -->
      <div v-else class="space-y-4 max-h-[60vh] overflow-y-auto">
        <h3
          class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark"
        >
          ✅ Review Your Selected Interests
        </h3>

        <div v-if="selectedCategories.length > 0">
          <ul
            class="list-disc list-inside text-sm text-textSecondary-light dark:text-textSecondary-dark space-y-1"
          >
            <li v-for="categoryId in selectedCategories" :key="categoryId">
              {{ getCategoryNameById(categoryId) }}
            </li>
          </ul>
          <p
            class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
          >
            These interests will help us personalize your experience.
          </p>
        </div>

        <div v-else>
          <p class="text-sm text-danger-light dark:text-danger-dark italic">
            ⚠️ You haven't selected any interests yet.
          </p>
          <p
            class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
          >
            Go back and choose at least one interest from the groups to
            personalize your experience.
          </p>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="pt-6">
        <div class="flex justify-between items-center gap-3">
          <!-- Back -->
          <button
            @click="step--"
            :disabled="step === 0"
            class="min-w-[100px] px-4 py-2 text-sm rounded-md border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark text-textPrimary-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <!-- Next or Submit -->
          <button
            v-if="step < groupSteps.length - 1"
            @click="step++"
            :disabled="loading"
            class="min-w-[100px] px-4 py-2 text-sm rounded-md bg-primary-light dark:bg-primary-dark text-white hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>

          <button
            v-else-if="step === groupSteps.length - 1"
            @click="step++"
            :disabled="loading"
            class="min-w-[100px] px-4 py-2 text-sm rounded-md bg-primary-light dark:bg-primary-dark text-white hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review →
          </button>

          <button
            v-else
            @click="onSubmit"
            :disabled="addLoading || selectedCategories.length === 0"
            class="min-w-[140px] px-4 py-2 text-sm rounded-md bg-primary-light dark:bg-primary-dark text-white hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              v-if="addLoading"
              class="w-4 h-4 animate-spin mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span v-if="!addLoading">🎯 Save</span>
            <span v-else>Saving...</span>
          </button>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { useToast } from "vue-toast-notification";
import listQuery from "@/graphql/categories/groups.gql";
import addQuery from "@/graphql/categories/add_user_categories.gql";

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue", "saved"]);

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const toast = useToast();
const step = ref(0);
const selectedCategories = ref([]);
const groupedCategories = ref([]);
const groupSteps = ref([]);
const loading = ref(true);
const error = ref(false);
const maxPerGroup = 3;

const sort = ref([{ sort_order: "asc" }]);

// Fetch categories
const { onResult, onError } = queryList(listQuery, { sort: sort });

onResult(({ data }) => {
  if (data?.category_groups?.length) {
    groupedCategories.value = data.category_groups;
    groupSteps.value = data.category_groups;
  }
  loading.value = false;
});

onError(() => {
  error.value = true;
  loading.value = false;
});

// Get selected categories for current group
const selectedInCurrentGroup = computed(() => {
  const currentGroupIds =
    groupSteps.value[step.value]?.categories.map((c) => c.id) || [];
  return selectedCategories.value.filter((id) => currentGroupIds.includes(id));
});

// Get category name by ID
const getCategoryNameById = (id) => {
  const all = groupedCategories.value.flatMap((g) => g.categories);
  return all.find((c) => c.id === id)?.name || "Unknown";
};

const {
  mutate,
  onDone,
  loading: addLoading,
  error: addError,
} = mutator(addQuery, {
  clientId: "auth",
});

onDone(({ data }) => {
  if (data.insert_user_categories?.affected_rows > 0) {
    toast.success("Intestions added successfully", { position: "top-right" });
  } else {
    toast.error("Intestions not added", { position: "top-right" });
  }
  emit("saved");
});

// Submit action
const onSubmit = () => {
  const input = selectedCategories.value.map((id) => ({
    category_id: id,
  }));
  mutate({ input });
};
</script>
