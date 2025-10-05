<script setup>
import getPrayerListItems from "~/graphql/prayers/prayer_list_items.gql";

const route = useRoute();
const router = useRouter();

const id = route.params.id;
const type = route.query.type;
const scheduled_date = route.query.scheduled_date;
const scheduled_week = route.query.scheduled_week;
const num_requests = route.query.num_requests;
const name = route.query.name;

const prayerListItems = ref([]);
const sort = ref({
  created_at: "desc",
});

const limit = ref(100);
const offset = ref(0);

const filter = computed(() => {
  let query = {
    _and: [
      {
        prayer_list_id: {
          _eq: id,
        },
      },
    ],
  };

  if (type === "daily") {
    query._and.push({
      scheduled_date: {
        _eq: scheduled_date,
      },
    });
  } else if (type === "weekly") {
    query._and.push({
      scheduled_week: {
        _eq: scheduled_week,
      },
    });
  }

  return query;
});

const { onResult, refetch, loading } = queryList(getPrayerListItems, {
  order: sort,
  offset: offset,
  limit: limit,
  clientId: "auth",
  filter: filter,
  include_user: true,
});

onResult(({ data }) => {
  if (data) {
    prayerListItems.value = data.prayer_list_items;
  }
});

provide("refetchPrayerListItems", refetch);

// Handle back navigation
function handleBack() {
  console.log("handleBack", window.history);

  if (window.history.length) {
    router.back();
  } else {
    router.push("/");
  }
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get type badge color
const getTypeBadgeClass = (type) => {
  const classes = {
    daily: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    weekly:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
    monthly:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    custom:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
    general:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200",
  };
  return classes[type] || classes.general;
};
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 w-full border-b border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark shadow-sm px-4 py-3"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="handleBack"
            class="text-textPrimary-light dark:text-textPrimary-dark hover:opacity-75 transition"
          >
            <Icon name="mdi:arrow-left" size="24" />
          </button>
          <div>
            <h1
              class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark capitalize"
            >
              {{ name }}
            </h1>
            <div class="flex items-center gap-2 mt-1">
              <span
                class="text-xs px-2 py-1 rounded-full capitalize"
                :class="getTypeBadgeClass(type)"
              >
                {{ type }}
              </span>
              <span
                class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
              >
                {{ num_requests }} prayer requests
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="refetch"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition"
            :disabled="loading"
          >
            <Icon
              name="mdi:refresh"
              size="20"
              class="text-textPrimary-light dark:text-textPrimary-dark"
              :class="{ 'animate-spin': loading }"
            />
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="w-full max-w-full py-4 px-3 lg:px-6">
      <!-- Prayer Requests -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2
            class="text-xl font-semibold text-textPrimary-light dark:text-textPrimary-dark"
          >
            Saved Prayer Requests
          </h2>
          <span
            class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
          >
            {{ prayerListItems.length }} items
          </span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="loader"></div>
        </div>

        <!-- Prayer Requests List -->
        <div v-else-if="prayerListItems.length > 0" class="space-y-4">
          <PrayerSavedPrayerCard
            v-for="prayerItem in prayerListItems"
            :key="prayerItem.id"
            :prayerItem="prayerItem"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
          >
            🙏
          </div>
          <h3
            class="text-lg font-medium text-textPrimary-light dark:text-textPrimary-dark mb-2"
          >
            No prayer requests saved yet
          </h3>
          <p
            class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-4"
          >
            Start adding prayer requests to this list to see them here.
          </p>
          <button
            @click="handleBack"
            class="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition"
          >
            Browse Prayer Requests
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
