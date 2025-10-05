<script setup>
import getUserPrayerLists from "~/graphql/prayers/user_prayer_lists.gql";

const router = useRouter();
const route = useRoute();

function handleBack() {
  router.back("");
}

const listTypes = ref([
  { name: "All", value: "all", count: 0 },
  { name: "Daily", value: "daily", count: 0 },
  { name: "Weekly", value: "weekly", count: 0 },
  { name: "Custom", value: "custom", count: 0 },
]);

const activeIndex = ref(0);
const openSearch = ref(false);
const openCreatePrayerListDialog = ref(false);
const showDashboard = ref(false);

/**-----------------------Fetch Prayer Lists */
const filter = computed(() => {
  let query = {};
  if (activeIndex.value != 0 && activeIndex.value != -1) {
    query.type = { _eq: listTypes.value[activeIndex.value].value };
  }
  if (search.value) {
    query.name = { _ilike: `%${search.value}%` };
  }
  return query;
});

const limit = ref(100);
const offset = ref(0);
const search = ref("");
const prayerLists = ref([]);
const { onResult, onError, loading, refetch, fetchMore } = queryList(
  getUserPrayerLists,
  {
    filter: filter,
    limit: limit,
    offset: offset,
    clientId: "auth",
    include_user: true,
  }
);

onResult(({ data }) => {
  if (data.user_prayer_lists) {
    let lists = [...data.user_prayer_lists];
    // Get user's timezone
    const user = useCookie("userData");
    const tz =
      user.value?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Helper: Get YYYY-MM-DD string in user's timezone
    function formatDateToYYYYMMDD_TZ(date, timezone) {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(date);

      const y = parts.find((p) => p.type === "year").value;
      const m = parts.find((p) => p.type === "month").value;
      const d = parts.find((p) => p.type === "day").value;

      return `${y}-${m}-${d}`;
    }

    // Helper: Get Monday of a given date
    function getMonday(date) {
      const day = date.getDay(); // Sunday=0, Monday=1, ...
      const diff = (day === 0 ? -6 : 1) - day;
      const monday = new Date(date);
      monday.setDate(date.getDate() + diff);
      return monday;
    }

    try {
      // Check if we need to add "Today" for daily or all type
      if (activeIndex.value === 1 || activeIndex.value === 0) {
        // Daily
        const today = new Date();
        const todayInTZ = formatDateToYYYYMMDD_TZ(today, tz);
        const weekdayName = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          timeZone: tz,
        }).format(today);

        const hasToday = lists.some(
          (list) => list.type === "daily" && list.scheduled_date === todayInTZ
        );

        if (!hasToday) {
          lists.unshift({
            id: `today-${Date.now()}`,
            name: "Today",
            type: "daily",
            scheduled_date: todayInTZ,
            num_requests: 0,
            percentage_completed: 0,
          });
        }
      }

      // Check if we need to add "This Week" for weekly or all type
      if (activeIndex.value === 2 || activeIndex.value === 0) {
        // Weekly
        const today = new Date();
        const monday = getMonday(new Date(formatDateToYYYYMMDD_TZ(today, tz)));
        const mondayInTZ = formatDateToYYYYMMDD_TZ(monday, tz);

        const hasThisWeek = lists.some(
          (list) => list.type === "weekly" && list.scheduled_week === mondayInTZ
        );

        if (!hasThisWeek) {
          lists.unshift({
            id: `this-week-${Date.now()}`,
            name: "This Week",
            type: "weekly",
            scheduled_week: mondayInTZ,
            num_requests: 0,
            percentage_completed: 0,
          });
        }
      }
    } catch (error) {
      console.log("Error adding today/this week placeholders:", error);
    }

    prayerLists.value = lists;
  }
});

// Handle create new prayer list
function handleCreateNew(type) {
  openCreatePrayerListDialog.value = true;
  // You can pass the type to the create dialog if needed
}

// Handle tab change - make dashboard inactive
function handleTabChange() {
  showDashboard.value = false;
}

// Handle dashboard toggle
function handleDashboardToggle() {
  showDashboard.value = !showDashboard.value;
  // Only set activeIndex to negative on small screens
  if (showDashboard.value && !isDesktop.value) {
    activeIndex.value = -1; // Set to negative when dashboard is active on small screens only
  }
}

// Detect desktop
const isDesktop = ref(false);
function handleResize() {
  isDesktop.value = window.innerWidth >= 1024;
}
handleResize();
window.addEventListener("resize", handleResize);

// Create Custom List Dialog
const openCreateListDialog = ref(false);

function onListCreated(list) {
  openCreateListDialog.value = false;
  if (activeIndex.value === 3) {
    refetch();
  } else {
    activeIndex.value = 3;
  }
  router.push(
    `/user/saved-requests/${list.id}?type=custom&name=${list.name}&num_requests=0`
  );
}
</script>

<template>
  <!-- Create Custom List Dialog -->
  <PrayerCreateCustomList
    v-if="openCreateListDialog"
    v-model="openCreateListDialog"
    @list-created="onListCreated"
  />
  <NuxtLayout name="user">
    <!-- Sticky Mobile Header -->
    <header
      v-if="!$route.params?.id && !$route.path?.includes('create')"
      class="sticky top-0 z-50 w-full border-b border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark shadow-sm px-4 py-1 lg:hidden"
    >
      <div class="flex items-center justify-between gap-2 w-full">
        <!-- Left Section -->
        <div class="flex items-center gap-2 w-full">
          <transition name="fade" mode="out-in">
            <!-- Title Mode Group -->
            <div
              v-if="!openSearch"
              key="title-group"
              class="flex items-center gap-2 w-full"
            >
              <button
                @click="handleBack"
                class="text-textPrimary-light dark:text-textPrimary-dark hover:opacity-75 transition"
              >
                <Icon name="mdi:arrow-left" size="24" />
              </button>
              <h2
                class="text-base font-semibold text-textPrimary-light dark:text-textPrimary-dark truncate"
              >
                My Prayer Lists
              </h2>
            </div>

            <!-- Search Mode Group -->
            <div
              v-else
              key="search-group"
              class="flex items-center gap-2 w-full"
            >
              <button
                @click="handleBack"
                class="text-textPrimary-light dark:text-textPrimary-dark hover:opacity-75 transition"
              >
                <Icon name="mdi:arrow-left" size="24" />
              </button>
              <input
                type="text"
                v-model="search"
                placeholder="Search communities ..."
                class="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all duration-200"
              />
            </div>
          </transition>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-2 shrink-0">
          <transition name="fade" mode="out-in">
            <div
              v-if="!openSearch"
              key="right-title"
              class="flex items-center gap-2"
            >
              <!-- <button @click="openSearch = true"
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition" aria-label="Open Search">
                <Icon name="heroicons:magnifying-glass" size="20"
                  class="text-textPrimary-light dark:text-textPrimary-dark" />
              </button> -->
              <button
                @click="openCreateListDialog = true"
                class="px-3 py-1.5 text-sm rounded-md bg-primary-light text-white dark:bg-primary-dark font-medium hover:bg-blue-700 dark:hover:bg-blue-300 dark:hover:text-black transition whitespace-nowrap"
              >
                + Create
              </button>
            </div>

            <div v-else key="right-search" class="flex items-center gap-2">
              <button
                @click="openSearch = false"
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition"
                aria-label="Close Search"
              >
                <Icon
                  name="heroicons:x-mark"
                  size="20"
                  class="text-textPrimary-light dark:text-textPrimary-dark"
                />
              </button>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <div class="flex max-w-full lg:overflow-hidden">
      <!-- Sidebar: show always on desktop or on mobile if not in create/detail view -->
      <aside
        v-if="!$route.params.id || isDesktop"
        class="w-full lg:w-1/4 lg:max-w-xs mx-auto sticky top-20 h-[calc(100vh)] lg:border-r lg:pr-2 hide-scrollbar flex flex-col"
        :class="[
          'bg-background-light dark:bg-background-dark',
          'border-borderColor-light dark:border-borderColor-dark',
          isDesktop
            ? 'lg:fixed lg:top-[90px] lg:h-[calc(100vh-90px)] lg:z-40'
            : '',
        ]"
      >
        <!-- Sticky Header (Desktop) -->
        <header
          class="sticky top-0 z-50 w-full hidden lg:block bg-background-light dark:bg-background-dark px-3"
        >
          <div
            class="flex items-center justify-between gap-2 w-full min-h-[42px]"
          >
            <!-- Left Section: Title/Search -->
            <div class="flex items-center gap-2 w-full">
              <transition name="fade" mode="out-in">
                <!-- Search Mode -->
                <div v-if="openSearch" key="search" class="relative w-full">
                  <input
                    type="text"
                    v-model="search"
                    placeholder="Search prayer lists ..."
                    class="w-full px-3 py-2 pr-10 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all duration-200"
                  />
                  <!-- Close Icon inside input -->
                  <button
                    @click="openSearch = false"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-textSecondary-light dark:text-textSecondary-dark hover:text-textPrimary-light dark:hover:text-textPrimary-dark transition"
                    aria-label="Close Search"
                  >
                    <Icon name="heroicons:x-mark" size="18" />
                  </button>
                </div>

                <!-- Title Mode -->
                <div v-else key="title" class="flex items-center gap-2">
                  <h2
                    class="text-base font-semibold text-textPrimary-light dark:text-textPrimary-dark truncate"
                  >
                    My Prayer Lists
                  </h2>
                </div>
              </transition>
            </div>

            <!-- Right Section: Buttons (Always visible) -->
            <div class="flex items-center gap-2 shrink-0">
              <!-- Search Toggle -->
              <!-- <transition name="fade" mode="out-in">
                <button v-if="!openSearch" key="search-btn" @click="openSearch = true"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition" aria-label="Open Search">
                  <Icon name="heroicons:magnifying-glass" size="20"
                    class="text-textPrimary-light dark:text-textPrimary-dark" />
                </button>
              </transition> -->

              <!-- Create Button -->
              <button
                @click="openCreateListDialog = true"
                class="px-3 py-1.5 text-sm rounded-md bg-primary-light text-white dark:bg-primary-dark font-medium hover:bg-blue-700 dark:hover:bg-blue-300 dark:hover:text-black transition whitespace-nowrap"
              >
                + Create
                <span class="hidden xs:inline lg:hidden">New Prayer List</span>
              </button>
            </div>
          </div>
        </header>
        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto hide-scrollbar px-3">
          <div class="space-y-2">
            <!-- Prayer Lists List -->

            <div class="flex items-center gap-2">
              <!-- Dashboard Toggle (Small Screen Only) -->
              <button
                v-if="!isDesktop"
                @click="handleDashboardToggle"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
                :class="
                  showDashboard ? 'bg-indigo-100 dark:bg-indigo-900/20' : ''
                "
              >
                <Icon
                  name="mdi:view-dashboard"
                  size="20"
                  :class="
                    showDashboard
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-textSecondary-light dark:text-textSecondary-dark'
                  "
                />
              </button>

              <BaseTabButton
                :statuses="listTypes"
                v-model="activeIndex"
                @update:modelValue="handleTabChange"
              />
            </div>

            <div v-if="loading" class="flex justify-center py-8">
              <div class="loader"></div>
            </div>

            <template v-else>
              <!-- Dashboard View -->
              <div v-if="showDashboard">
                <PrayerListDashboard />
              </div>

              <!-- Prayer Lists View -->
              <div v-else>
                <ul v-if="prayerLists.length" class="space-y-3">
                  <PrayerListCard
                    v-for="prayerList in prayerLists"
                    :key="
                      prayerList.id +
                      prayerList.scheduled_date +
                      prayerList.scheduled_week
                    "
                    :prayerList="prayerList"
                    @createNew="handleCreateNew"
                  />
                </ul>
                <!-- No Results -->
                <p
                  v-else
                  class="text-center text-sm text-textSecondary-light dark:text-textSecondary-dark mt-4"
                >
                  No prayer lists found.
                </p>
              </div>
            </template>
          </div>
        </div>
      </aside>

      <!--  Detail Community -->
      <section
        v-if="$route.path?.includes('create') || $route.params.id"
        class="flex-1 w-full lg:overflow-y-auto h-[calc(100vh-100px)] lg:ml-[25%]"
      >
        <NuxtPage />
      </section>

      <!-- Dashboard (Large Screen) -->
      <section v-else-if="isDesktop" class="flex-1 p-6 lg:ml-[25%]">
        <div class="max-w-6xl mx-auto">
          <div class="mb-6">
            <h2
              class="text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-2"
            >
              Prayer Lists Dashboard
            </h2>
            <p class="text-textSecondary-light dark:text-textSecondary-dark">
              Overview of your prayer lists and recent activity
            </p>
          </div>
          <PrayerListDashboard />
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>
