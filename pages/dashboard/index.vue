<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              የሎተሪ አፈጣጠር ዳሽቦርድ
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              የእርስዎን ሎተሪ እንቅስቃሴዎች ይከታተሉ
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon name="mdi:plus" class="w-5 h-5 mr-2 inline" />
              አዲስ ሎተሪ
            </button>
            <button
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon name="mdi:refresh" class="w-5 h-5 mr-2 inline" />
              ያደሱ
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Icon
                name="mdi:ticket"
                class="w-8 h-8 text-blue-600 dark:text-blue-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                ጠቅላላ ሎተሪዎች
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalLotteries }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Icon
                name="mdi:currency-usd"
                class="w-8 h-8 text-green-600 dark:text-green-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                ጠቅላላ ገቢ
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(stats.totalRevenue) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Icon
                name="mdi:account-group"
                class="w-8 h-8 text-purple-600 dark:text-purple-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                አጠቃላይ ተሳታፊዎች
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalParticipants }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Icon
                name="mdi:chart-line"
                class="w-8 h-8 text-orange-600 dark:text-orange-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                የተሸጡ ትኬቶች
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.soldTickets }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            የገቢ እድገት
          </h3>
          <div class="h-64 flex items-center justify-center">
            <div class="text-center">
              <Icon
                name="mdi:chart-line"
                class="w-16 h-16 text-gray-400 mx-auto mb-4"
              />
              <p class="text-gray-500 dark:text-gray-400">የገቢ ገበታ እዚህ ይታያል</p>
            </div>
          </div>
        </div>

        <!-- Lottery Status Distribution -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            የሎተሪ ሁኔታ
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span class="text-gray-700 dark:text-gray-300">አልውጣም</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">{{
                lotteryStatus.active
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span class="text-gray-700 dark:text-gray-300">ያልተጀመረ</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">{{
                lotteryStatus.pending
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span class="text-gray-700 dark:text-gray-300">ዎቱዋል</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">{{
                lotteryStatus.closed
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span class="text-gray-700 dark:text-gray-300">ተጠናቀቀ</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">{{
                lotteryStatus.finished
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Lotteries -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              የቅርብ ጊዜ ሎተሪዎች
            </h3>
            <button
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              ሁሉንም ይመልከቱ
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="lottery in recentLotteries"
              :key="lottery.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start mb-3">
                <h4 class="font-semibold text-gray-900 dark:text-white">
                  ሎተሪ #{{ lottery.id }}
                </h4>
                <span
                  :class="getStatusClass(lottery.status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getStatusText(lottery.status) }}
                </span>
              </div>
              <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex justify-between">
                  <span>የትኬት ዋጋ:</span>
                  <span class="font-medium">{{ lottery.price }} ብር</span>
                </div>
                <div class="flex justify-between">
                  <span>ተሸጡ:</span>
                  <span class="font-medium"
                    >{{ lottery.sold }}/{{ lottery.total }}</span
                  >
                </div>
                <div
                  class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                >
                  <div
                    class="bg-blue-600 h-2 rounded-full"
                    :style="{
                      width: `${(lottery.sold / lottery.total) * 100}%`,
                    }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-500">
                  {{ formatDate(lottery.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dummy data
const stats = ref({
  totalLotteries: 24,
  totalRevenue: 125000,
  totalParticipants: 1847,
  soldTickets: 3420,
});

const lotteryStatus = ref({
  active: 8,
  pending: 5,
  closed: 6,
  finished: 5,
});

const recentLotteries = ref([
  {
    id: 1001,
    status: "active",
    price: 50,
    sold: 45,
    total: 100,
    createdAt: "2024-01-15",
  },
  {
    id: 1002,
    status: "pending",
    price: 25,
    sold: 0,
    total: 200,
    createdAt: "2024-01-14",
  },
  {
    id: 1003,
    status: "closed",
    price: 100,
    sold: 80,
    total: 80,
    createdAt: "2024-01-13",
  },
  {
    id: 1004,
    status: "finished",
    price: 75,
    sold: 150,
    total: 150,
    createdAt: "2024-01-12",
  },
  {
    id: 1005,
    status: "active",
    price: 30,
    sold: 25,
    total: 50,
    createdAt: "2024-01-11",
  },
  {
    id: 1006,
    status: "pending",
    price: 60,
    sold: 0,
    total: 100,
    createdAt: "2024-01-10",
  },
]);

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("am-ET", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusClass = (status) => {
  const classes = {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    closed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    finished:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return (
    classes[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  );
};

const getStatusText = (status) => {
  const texts = {
    active: "አልውጣም",
    pending: "ያልተጀመረ",
    closed: "ዎቱዋል",
    finished: "ተጠናቀቀ",
  };
  return texts[status] || "ያልታወቀ";
};

// Set page title
useHead({
  title: "የሎተሪ አፈጣጠር ዳሽቦርድ",
});
</script>
