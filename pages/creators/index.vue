<template>
  <NuxtLayout name="app">
    <!-- -------------------App Bar and Tab Buttons---------------- -->
    <div class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="flex items-center justify-between px-3 py-2">
        <div class="flex-1">
          <transition name="fade" mode="out-in">
            <!-- 🔍 Search Input -->
            <div
              v-if="showSearch"
              key="search"
              class="flex items-center justify-end gap-2"
            >
              <input
                v-model="searchQuery"
                type="text"
                placeholder="በስም ይፈልጉ..."
                class="w-full max-w-xs border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              <button
                @click="toggleSearch"
                class="text-gray-600 hover:text-primary-light transition"
              >
                <Icon name="mdi:close" class="text-xl" />
              </button>
            </div>

            <!-- 🧭 Tabs + Search Icon -->
            <div v-else key="tabs" class="flex items-center justify-between">
              <div class="flex flex-1 bg-gray-200 rounded-lg overflow-hidden">
                <button
                  v-for="(tab, index) in tabs"
                  :key="tab.id"
                  @click="selectedTabIndex = index"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-sm font-medium transition-colors duration-200"
                  :class="
                    selectedTabIndex === index
                      ? 'bg-primary-light text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-300'
                  "
                >
                  <Icon :name="tab.icon" class="text-base" />
                  {{ tab.name }}
                </button>
              </div>

              <!-- 🔍 Search Icon (Right Side) -->
              <button
                @click="toggleSearch"
                class="ml-2 p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Icon name="mdi:magnify" class="text-lg text-gray-700" />
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <CreatorsList v-if="selectedTabIndex === 0" :searchQuery="searchQuery" />
    <CreatorsLikedCreators
      v-if="selectedTabIndex === 1"
      :searchQuery="searchQuery"
    />
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from "vue";

const route = useRoute();
const showSearch = ref(false);
const searchQuery = ref("");

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) searchQuery.value = "";
};

// Tab configuration
const tabs = computed(() => [
  { id: "all", name: "ሁሉም", value: "all", icon: "mdi:apps" },
  { id: "liked", name: "የተወደዱ", value: "liked", icon: "mdi:heart" },
]);

const selectedTabIndex = ref(
  route.query.tab
    ? tabs.value.findIndex((tab) => tab.id === route.query.tab)
    : 0
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
