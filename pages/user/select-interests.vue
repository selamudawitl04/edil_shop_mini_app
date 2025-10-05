  <template>
    <NuxtLayout>
      <section class="min-h-screen bg-background-light dark:bg-background-dark pt-16 lg:pt-28">

        <!-- Main Content -->
        <div class="max-w-4xl mx-auto px-4 py-8">
          <!-- Step 1: Category Selection -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="text-center mb-8">
              <h2 class="text-xl font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                What prayer areas and spiritual focus areas resonate with you?
              </h2>
              <p class="text-textSecondary-light dark:text-textSecondary-dark">
                Select up to 5 prayer areas and spiritual focus areas that resonate with your faith journey
              </p>

            </div>

            <!-- Category Groups -->
            <div class="space-y-8">
              <div 
                v-for="(group, groupIndex) in categoryGroups" 
                :key="group.id"
                class="bg-card-light dark:bg-card-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-6"
              >
                <div class="mb-4">
                  <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                    {{ group.name }}
                  </h3>
                  <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark">
                    {{ group.description }}
                  </p>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <label
                    v-for="category in group.categories"
                    :key="category.id"
                    class="relative flex items-center space-x-3 p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-gray-800 transition-all"
                    :class="{
                      'border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10 cursor-pointer hover:bg-primary-light/5 dark:hover:bg-primary-dark/5': selectedCategories.includes(category.id),
                      'cursor-not-allowed opacity-50': !isCategorySelectable(category.id, groupIndex) && !selectedCategories.includes(category.id),
                      'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700': isCategorySelectable(category.id, groupIndex) && !selectedCategories.includes(category.id)
                    }"
                    @click="handleCategoryClick(category.id, groupIndex)"
                  >
                    <div class="flex-shrink-0 w-5 h-5 border-2 border-borderColor-light dark:border-borderColor-dark rounded flex items-center justify-center"
                        :class="{
                          'border-primary-light dark:border-primary-dark bg-primary-light dark:bg-primary-dark': selectedCategories.includes(category.id),
                          'opacity-50': !isCategorySelectable(category.id, groupIndex) && !selectedCategories.includes(category.id)
                        }"
                    >
                      <svg v-if="selectedCategories.includes(category.id)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                      {{ category.name }}
                    </span>
                  </label>
                </div>

                <!-- Error message when limit is reached -->
                <div v-if="showLimitError && getSelectedInGroup(groupIndex).length >= maxPerGroup" 
                    class="mt-3 p-3 bg-danger-light/10 dark:bg-danger-dark/10 border border-danger-light dark:border-danger-dark rounded-lg">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-danger-light dark:text-danger-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium text-danger-light dark:text-danger-dark">
                      You can only select up to {{ maxPerGroup }} interests for "{{ group.name }}". Please deselect one first.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Group & Page Suggestions -->
          <div v-else-if="currentStep === 2" class="space-y-6">
            <div class="text-center mb-8">
              <h2 class="text-xl font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                Discover Communities Based on Your Interests
              </h2>
              <p class="text-textSecondary-light dark:text-textSecondary-dark">
                We've found some groups and pages that match your prayer interests
              </p>
            </div>

            <!-- Suggested Groups -->
            <div class="bg-card-light dark:bg-card-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-6">
              <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-4">
                Suggested Prayer Groups
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="group in suggestedGroups" 
                  :key="group.id"
                  class="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-borderColor-light dark:border-borderColor-dark"
                >
                  <div class="w-12 h-12 bg-primary-light dark:bg-primary-dark rounded-lg flex items-center justify-center text-white font-bold">
                    {{ group.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-textPrimary-light dark:text-textPrimary-dark">{{ group.name }}</h4>
                    <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark">{{ group.memberCount }} members</p>
                  </div>
                  <button class="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg text-sm hover:brightness-105 transition">
                    Join
                  </button>
                </div>
              </div>
            </div>

            <!-- Suggested Pages -->
            <div class="bg-card-light dark:bg-card-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-6">
              <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-4">
                Suggested Prayer Pages
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="page in suggestedPages" 
                  :key="page.id"
                  class="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-borderColor-light dark:border-borderColor-dark"
                >
                  <div class="w-12 h-12 bg-primary-light dark:bg-primary-dark rounded-lg flex items-center justify-center text-white font-bold">
                    {{ page.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-textPrimary-light dark:text-textPrimary-dark">{{ page.name }}</h4>
                    <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark">{{ page.followerCount }} followers</p>
                  </div>
                  <button class="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg text-sm hover:brightness-105 transition">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex justify-center items-center pt-8 border-t border-borderColor-light dark:border-borderColor-dark">
            <button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              :disabled="!canProceed || (currentStep === 1 && updateLoading)"
              class="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
            >
              <svg v-if="currentStep === 1 && updateLoading" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span v-if="currentStep === 1 && updateLoading">Updating...</span>
              <span v-else>{{ currentStep === 1 ? 'Continue' : 'Continue' }} →</span>
            </button>

            <button
              v-else
              @click="finishOnboarding"
              :disabled="updateLoading"
              class="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span v-if="!updateLoading">🎯 Complete Setup</span>
              <span v-else>Saving...</span>
            </button>
          </div>
        </div>
      </section>
    </NuxtLayout>
  </template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toast-notification";
import listQuery from "@/graphql/categories/groups.gql";
import getUserCategoriesQuery from "@/graphql/categories/get_user_categories.gql";
import addQuery from "@/graphql/categories/add_user_categories.gql";
import mutator from "@/composables/mutator";



const router = useRouter();
const route = useRoute();
const toast = useToast();

const userData = useCookie("userData");


// State
const currentStep = ref(1);
const totalSteps = 2;
const selectedCategories = ref([]);
const categoryGroups = ref([]);
const userPreviousCategories = ref([]);
const loading = ref(false);
const maxPerGroup = 5;
const showLimitError = ref(false);

// Dummy data for suggestions
const suggestedGroups = ref([
  { id: 1, name: "Prayer Warriors", memberCount: 245 },
  { id: 2, name: "Intercessory Prayer", memberCount: 189 },
  { id: 3, name: "Family Prayer Circle", memberCount: 156 },
  { id: 4, name: "Youth Prayer Network", memberCount: 98 }
]);

const suggestedPages = ref([
  { id: 1, name: "Daily Prayer Devotions", followerCount: 1200 },
  { id: 2, name: "Prayer Ministry", followerCount: 890 },
  { id: 3, name: "Spiritual Growth", followerCount: 567 },
  { id: 4, name: "Prayer Requests", followerCount: 2340 }
]);

// Computed
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return selectedCategories.value.length > 0;
  }
  return true;
});

// Methods
const isCategorySelectable = (categoryId, groupIndex) => {
  const selectedInGroup = getSelectedInGroup(groupIndex);
  return selectedInGroup.length < maxPerGroup || selectedCategories.value.includes(categoryId);
};



const getSelectedInGroup = (groupIndex) => {
  const groupCategoryIds = categoryGroups.value[groupIndex]?.categories.map(c => c.id) || [];
  return selectedCategories.value.filter(id => groupCategoryIds.includes(id));
};

const getCategoryNameById = (id) => {
  const allCategories = categoryGroups.value.flatMap(g => g.categories);
  return allCategories.find(c => c.id === id)?.name || "Unknown";
};

// Fetch user's previous categories
const fetchUserCategories = async () => {
  try {
    if (!userData.value?.id) return;

    const filter = ref({ user_id: { _eq: userData.value.id } });
    const { onResult: onUserCategoriesResult } = queryList(getUserCategoriesQuery, {
      filter: filter,
      clientId: "auth"
    });

    onUserCategoriesResult(({ data }) => {
      if (data?.user_categories) {
        userPreviousCategories.value = data.user_categories.map(uc => uc.category_id);
        // Pre-select user's previous categories
        selectedCategories.value = [...userPreviousCategories.value];
      }
    });
  } catch (error) {
    console.error("Failed to fetch user categories:", error);
  }
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
    }, 3000); // Hide error after 3 seconds
  }
};




const { mutate: updateCategories, onDone: onUpdateDone, loading: updateLoading } = mutator(addQuery, { clientId: "auth" });

onUpdateDone(({ data }) => {
  if (data?.insert_user_categories?.affected_rows > 0) {
    toast.success("Interests updated successfully!", { position: "top-right" });
    currentStep.value++;
  } else {
    toast.error("Failed to save interests. Please try again.", { position: "top-right" });
  }
});

const nextStep = async () => {
  if (currentStep.value === 1) {
    try {
      // Use the combined mutation that handles both delete and insert
      const input = selectedCategories.value.map(id => ({ category_id: id }));
      await updateCategories({ userId: userData.value.id, input });
    } catch (error) {
      console.error("Failed to update categories:", error);
      toast.error("Failed to update interests. Please try again.", { position: "top-right" });
    }
  } else if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const finishOnboarding = async () => {
  try {
    // Redirect to main app
    router.replace(route.query.to ? String(route.query.to) : "/");
  } catch (error) {
    toast.error("Something went wrong. Please try again.", { position: "top-right" });
  }
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
        description: "Choose the areas that best reflect your spiritual walk and what you often pray about or feel called to intercede for.",
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
    
    // After categories are loaded, fetch user's previous categories
    fetchUserCategories();
  }
});

onError(() => {
  toast.error("Failed to load categories. Please refresh the page.", { position: "top-right" });
});
</script> 