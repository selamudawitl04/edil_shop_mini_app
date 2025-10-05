<script setup>
import getDashboardData from "~/graphql/prayers/user_list_dashboard.gql";
import { formatDistanceToNow } from "date-fns";
const router = useRouter();

const user = useCookie("userData");

const dashboardData = ref({
  totalLists: 0,
  totalRequests: 0,
  totalPrayed: 0,
  overallProgress: 0,
  todayList: {
    completed: 0,
    total: 0,
    percentage: 0,
    greeting: "Hello",
  },
  recentActivity: [],
  listStats: [],
});

const { onResult, loading, onError, refetch } = queryList(getDashboardData, {
  include_user: true,
  clientId: "auth",
});

onError((error) => {
  console.error("Dashboard data fetch error:", error);
});

onResult(({ data }) => {
  // Total lists, progress, total requests, prayed for
  if (data.user_prayer_list_numbers?.length > 0) {
    const numbers = data.user_prayer_list_numbers[0];
    dashboardData.value.totalLists = numbers?.total_lists || 0;
    dashboardData.value.totalRequests = numbers?.total_requests || 0;
    dashboardData.value.totalPrayed = numbers?.prayed_for || 0;
    dashboardData.value.overallProgress = numbers?.progress || 0;
  }

  // Today list
  if (data.user_today_list?.length > 0) {
    const todayList = data.user_today_list[0];
    const hour = new Date().getHours();
    let greeting = "Hello";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 17) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    dashboardData.value.todayList = {
      completed: todayList?.prayed_for || 0,
      total: todayList?.total_requests || 0,
      percentage: todayList?.progress || 0,
      greeting: greeting,
    };
  }

  // List type overview
  if (data.user_prayer_list_type_overview?.length > 0) {
    dashboardData.value.listStats = data.user_prayer_list_type_overview.map(
      (stat) => ({
        type: stat.type,
        prayed: stat.prayed || 0,
        total: stat.total || 0,
        percentage: stat.percentage || 0,
      })
    );
  }

  // Recent activity
  if (data.user_prayer_list_recent_activity?.length > 0) {
    dashboardData.value.recentActivity =
      data.user_prayer_list_recent_activity.map((activity) => ({
        id: activity.id,
        type: activity.type,
        message: activity.message,
        time: activity.activity_time,
        listName: activity.list_name,
      }));
  }
});

const getTypeColor = (type) => {
  const colors = {
    daily: "blue",
    weekly: "purple",
    custom: "orange",
    general: "indigo",
  };
  return colors[type] || "gray";
};

const getTypeIcon = (type) => {
  const icons = {
    daily: "mdi:calendar-day",
    weekly: "mdi:calendar-week",
    custom: "mdi:format-list-bulleted",
    general: "mdi:heart",
  };
  return icons[type] || "mdi:format-list-bulleted";
};

const getActivityIcon = (type) => {
  const icons = {
    prayed: "mdi:heart",
    added: "mdi:plus",
    completed: "mdi:check-circle",
  };
  return icons[type] || "mdi:information";
};

const getActivityColor = (type) => {
  const colors = {
    prayed: "text-green-600 dark:text-green-400",
    added: "text-blue-600 dark:text-blue-400",
    completed: "text-purple-600 dark:text-purple-400",
  };
  return colors[type] || "text-gray-600 dark:text-gray-400";
};

// Get YYYY-MM-DD string in user's timezone
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
const toTodayListPage = () => {
  // get user's timezone or device timezone
  const tz =
    user.value?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date();

  const todayInTZ = formatDateToYYYYMMDD_TZ(today, tz);

  const toDayListId = user.value?.prayer_lists?.find(
    (pl) => pl.type == "daily"
  )?.id;

  const num_requests = dashboardData.value.todayList.total;

  router.push(
    `/user/saved-requests/${toDayListId}?type=daily&scheduled_date=${todayInTZ}&name=Today's%20List&num_requests=${num_requests}`
  );
};
</script>

<template>
  <div v-if="loading" class="space-y-4 sm:space-y-6">
    <!-- Loading State -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-borderColor-light dark:border-borderColor-dark animate-pulse"
      >
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </div>
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else-if="
      dashboardData.totalLists === 0 && dashboardData.totalRequests === 0
    "
    class="space-y-4 sm:space-y-6"
  >
    <!-- Empty State -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl p-8 border border-borderColor-light dark:border-borderColor-dark text-center"
    >
      <div
        class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Icon name="mdi:format-list-bulleted" size="32" class="text-gray-400" />
      </div>
      <h3
        class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
      >
        No Prayer Lists Yet
      </h3>
      <p class="text-textSecondary-light dark:text-textSecondary-dark mb-4">
        Start by creating your first prayer list to see your dashboard here.
      </p>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Create Prayer List
      </button>
    </div>
  </div>

  <div v-else class="space-y-4 sm:space-y-6">
    <!-- Overview Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <!-- Total Lists -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-borderColor-light dark:border-borderColor-dark"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-xs sm:text-sm text-textSecondary-light dark:text-textSecondary-dark"
            >
              Total Lists
            </p>
            <p
              class="text-xl sm:text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark"
            >
              {{ dashboardData.totalLists }}
            </p>
          </div>
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center"
          >
            <Icon
              name="mdi:format-list-bulleted"
              size="20"
              class="sm:text-2xl text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
      </div>

      <!-- Total Requests -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-borderColor-light dark:border-borderColor-dark"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-xs sm:text-sm text-textSecondary-light dark:text-textSecondary-dark"
            >
              Total Requests
            </p>
            <p
              class="text-xl sm:text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark"
            >
              {{ dashboardData.totalRequests }}
            </p>
          </div>
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center"
          >
            <span class="text-lg sm:text-2xl">🙏</span>
          </div>
        </div>
      </div>

      <!-- Prayed Requests -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-borderColor-light dark:border-borderColor-dark"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-xs sm:text-sm text-textSecondary-light dark:text-textSecondary-dark"
            >
              Prayed For
            </p>
            <p
              class="text-xl sm:text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark"
            >
              {{ dashboardData.totalPrayed }}
            </p>
          </div>
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center"
          >
            <Icon
              name="mdi:heart"
              size="20"
              class="sm:text-2xl text-purple-600 dark:text-purple-400"
            />
          </div>
        </div>
      </div>

      <!-- Overall Progress -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-borderColor-light dark:border-borderColor-dark"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-xs sm:text-sm text-textSecondary-light dark:text-textSecondary-dark"
            >
              Progress
            </p>
            <p
              class="text-xl sm:text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark"
            >
              {{ dashboardData.overallProgress }}%
            </p>
          </div>
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center"
          >
            <Icon
              name="mdi:trending-up"
              size="20"
              class="sm:text-2xl text-orange-600 dark:text-orange-400"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Today's List -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 border border-borderColor-light dark:border-borderColor-dark"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="flex-1">
          <h3
            class="text-base sm:text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-1"
          >
            👋 {{ dashboardData.todayList.greeting }}
          </h3>
          <p
            class="text-xs sm:text-sm text-textSecondary-light dark:text-textSecondary-dark mb-3"
          >
            Today's List: {{ dashboardData.todayList.completed }}/{{
              dashboardData.todayList.total
            }}
            Completed ({{ dashboardData.todayList.percentage }}%)
          </p>

          <!-- Progress Bar -->
          <div
            class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4"
          >
            <div
              class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${dashboardData.todayList.percentage}%` }"
            ></div>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              @click="toTodayListPage"
              class="px-3 py-2 sm:py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              View Today's List
            </button>
            <button
              class="px-3 py-2 sm:py-1.5 text-xs border border-gray-300 dark:border-gray-600 text-textPrimary-light dark:text-textPrimary-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Add Prayer Request
            </button>
          </div>
        </div>

        <!-- Progress Ring -->
        <div
          class="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto sm:mx-0"
        >
          <svg
            class="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <!-- Background circle -->
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              class="text-gray-200 dark:text-gray-700"
            />
            <!-- Progress circle -->
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              stroke-linecap="round"
              :stroke-dasharray="`${2 * Math.PI * 40}`"
              :stroke-dashoffset="`${
                2 *
                Math.PI *
                40 *
                (1 - dashboardData.todayList.percentage / 100)
              }`"
              class="text-blue-500 transition-all duration-300"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span
              class="text-base sm:text-lg font-bold text-textPrimary-light dark:text-textPrimary-dark"
            >
              {{ dashboardData.todayList.percentage }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- List Type Statistics -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 border border-borderColor-light dark:border-borderColor-dark"
    >
      <h3
        class="text-base sm:text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-4"
      >
        List Type Overview
      </h3>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <div
          v-for="stat in dashboardData.listStats"
          :key="stat.type"
          class="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
            :class="`bg-${getTypeColor(stat.type)}-100 dark:bg-${getTypeColor(
              stat.type
            )}-900/20`"
          >
            <Icon
              :name="getTypeIcon(stat.type)"
              size="16"
              class="sm:text-xl"
              :class="`text-${getTypeColor(
                stat.type
              )}-600 dark:text-${getTypeColor(stat.type)}-400`"
            />
          </div>
          <div class="flex-1">
            <p
              class="text-xs sm:text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark capitalize"
            >
              {{ stat.type }}
            </p>
            <p
              class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
            >
              {{ stat.prayed }}/{{ stat.total }} prayed ({{ stat.percentage }}%)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 border border-borderColor-light dark:border-borderColor-dark"
    >
      <h3
        class="text-base sm:text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-4"
      >
        Recent Activity
      </h3>
      <div class="space-y-3">
        <div
          v-for="activity in dashboardData.recentActivity"
          :key="activity.id"
          class="flex items-start gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700"
          >
            <Icon
              :name="getActivityIcon(activity.type)"
              size="14"
              class="sm:text-base"
              :class="getActivityColor(activity.type)"
            />
          </div>
          <div class="flex-1">
            <p
              class="text-xs sm:text-sm text-textPrimary-light dark:text-textPrimary-dark"
            >
              {{ activity.message }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span
                class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
                >{{ formatDistanceToNow(new Date(activity.time)) }}
              </span>
              <span
                class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-textSecondary-light dark:text-textSecondary-dark"
              >
                {{ activity.listName }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
