<script setup>
import { ref, watch } from "vue";
import { debounce } from "lodash-es";

const emit = defineEmits([
  "resetFilters",
  "applyFilters",
  "update:searchQuery",
  "update:categoryId",
]);

const props = defineProps({
  hasActiveFilters: {
    type: Boolean,
    default: false,
  },
  searchQuery: {
    type: String,
    default: "",
  },

  categoryId: {
    type: String,
    default: "ሁሉም",
  },
});

const hintText = ref("መለያ ቁጥር / የእጣ ስም / አይነት...");

const _searchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit("update:searchQuery", value),
});

const _categoryId = computed({
  get: () => props.categoryId,
  set: (value) => emit("update:categoryId", value),
});

// Props simulation
const onAdjustmentPressed = () => (openFilterDialog.value = true);

// Debounced input
const emitSearch = debounce((value) => {
  console.log("Search triggered:", value);
}, 400);

const clearSearch = () => {
  _searchQuery.value = "";
  emitSearch("");
};

const openFilterDialog = ref(false);

const queryVariables = ref({
  sort: "High price",
  min_price: null,
  max_price: null,
  min_ticket_size: null,
  max_ticket_size: null,
});

const resetFilters = () => {
  queryVariables.value = {
    sort: "High price",
    min_price: null,
    max_price: null,
    min_ticket_size: null,
    max_ticket_size: null,
  };
  emit("resetFilters", { ...queryVariables.value });
  openFilterDialog.value = false;
};

const applyFilters = () => {
  emit("applyFilters", { ...queryVariables.value });
  openFilterDialog.value = false;
};
</script>

<template>
  <HomeFilterDialog
    v-model="openFilterDialog"
    :queryVariables="queryVariables"
    @resetFilters="resetFilters"
    @applyFilters="applyFilters"
  />
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white shadow p-2 text-sm space-y-1"
  >
    <div class="flex items-center gap-3">
      <!-- Avatar -->
      <div
        @click="$router.push('/auth/logout')"
        class="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center text-white font-semibold text-sm"
      >
        ES
      </div>

      <!-- Search Input -->
      <div class="flex-1 relative">
        <input
          v-model="_searchQuery"
          :placeholder="hintText"
          class="w-full h-9 pl-9 pr-9 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-gray-800 placeholder:font-medium"
        />
        <span
          class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
        >
          <i class="mdi mdi-magnify"></i>
        </span>
        <button
          v-if="_searchQuery"
          @click="clearSearch"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
        >
          <i class="mdi mdi-close"></i>
        </button>
      </div>

      <!-- Filter Button -->
      <div class="relative">
        <button
          @click="onAdjustmentPressed"
          class="p-1 rounded-md border border-gray-300 hover:bg-gray-100 relative text-sm"
          :class="hasActiveFilters ? 'border-primary-light' : ''"
        >
          <i class="mdi mdi-tune text-primary-light text-xl"></i>
        </button>
        <span
          v-if="hasActiveFilters"
          class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"
        ></span>
      </div>
    </div>
    <HomeCategories v-model="_categoryId" :addAllCategories="true" />
  </header>

  <!-- Spacer to prevent content from hiding behind fixed header -->
  <div class="h-14"></div>
</template>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css");
</style>
