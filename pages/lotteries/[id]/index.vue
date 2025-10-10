<template>
  <NuxtLayout>
    <!-- Header with back icon -->
    <header
      v-if="errorHappened"
      class="sticky top-0 bg-white shadow-sm flex items-center px-4 py-3 z-50"
    >
      <button
        @click="goBack()"
        class="flex items-center text-gray-700 hover:text-primary-light transition"
      >
        <Icon name="mdi:arrow-left" class="text-2xl" />
        ውዱዋላ ተመለስ
      </button>
    </header>

    <BaseError v-if="errorHappened" show-retry @retry="refetch" />

    <div v-else>
      <!-- ---------------Loading---------------- -->

      <div v-if="loading" class="class flex justify-center py-8">
        <div class="loader"></div>
      </div>

      <!-- ---------------No Result Found -->
      <div v-if="!loading && !lottery" class="text-center">
        <BaseZeroResult message="ምንም ውጤት አልተገኘም" />
      </div>

      <!-- ---------------Main Content---------------- -->
      <section
        v-if="lottery"
        class="container px-3 lg:py-8 lg:px-4 min-h-screen max-w-6xl lg:space-y-6"
      >
        <!-- -------------------App Bar and Tab Buttons---------------- -->

        <div class="sticky top-0 z-50 bg-white">
          <!-- AppBar -->
          <header class="flex items-center justify-between py-2">
            <div class="flex items-center gap-2">
              <!-- Back Button -->
              <button @click="goBack">
                <Icon name="mdi:arrow-left" class="w-4 h-4" />
              </button>

              <!-- Title -->
              <h1 class="text-xl font-semibold text-gray-900">
                ዕጣ: {{ lottery.lottery_id }}
              </h1>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <!-- Toggle Not Sold Button -->
              <button
                @click="showNotSold = !showNotSold"
                class="flex items-center px-3 py-1.5 text-xs font-semibold rounded-md transition"
                :class="
                  showNotSold
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-600'
                "
                v-bind:class="{
                  invisible: !(
                    selectedTabIndex === 0 && lottery.status === 'active'
                  ),
                }"
              >
                ያልተሸጡ
              </button>

              <!-- Like widget -->
              <LotteryLike :lottery="lottery" />
            </div>
          </header>

          <!-- Tabs -->
          <div class="pb-2">
            <div class="flex bg-gray-200 rounded-lg">
              <button
                v-for="(tab, index) in tabs"
                :key="tab.id"
                @click="selectedTabIndex = index"
                class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                :class="
                  selectedTabIndex === index
                    ? 'bg-primary-light text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-300'
                "
              >
                <Icon :name="tab.icon" class="text-base" />
                {{ tab.name }}
              </button>
            </div>
          </div>
        </div>

        <LotteryDetailTickets
          v-if="selectedTabIndex === 0"
          :lottery="lottery"
          :showNotSold="showNotSold"
        />
        <LotteryDetailOverview
          v-if="selectedTabIndex === 1"
          :lottery="lottery"
          @buyTicket="selectedTabIndex = 0"
        />
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup>
import getLotteryQuery from "@/graphql/lottery/item.gql";

const showNotSold = ref(false);
const route = useRoute();
const router = useRouter();
const lottery = ref();
const errorHappened = ref(false);

// Tab configuration
const tabs = computed(() => [
  {
    id: "tickets",
    name: "ዕጣዎች",
    value: "tickets",
    icon: "mdi:confirmation-number",
  },
  {
    id: "overview",
    name: "መረጃ",
    value: "overview",
    icon: "mdi:person-outline",
  },
]);

function convertTabIdToIndex(tabId) {
  const index = tabs.value.findIndex((tab) => tab.id === tabId);
  return index !== -1 ? index : 0;
}

const selectedTabIndex = ref(convertTabIdToIndex(route.query.tab));

// GraphQL query
const { onResult, onError, refetch, loading } = queryItem(getLotteryQuery, {
  id: route.params.id,
  clientId: "auth",
});

onResult(({ data }) => {
  if (data?.lotteries_by_pk) {
    lottery.value = data.lotteries_by_pk;
    if (
      lottery.value.status === "active" &&
      lottery.value?.total_tickets !== lottery.value?.total_sold
    ) {
      tabs.value[0].name = "ትኬት ግዛ";
    } else {
      tabs.value[0].name = "ትኬቶች";
    }
  }

  if (!data?.lotteries_by_pk) {
    errorHappened.value = true;
  } else {
    errorHappened.value = false;
  }
});

provide("refetchLottery", refetch);

onError(() => {
  errorHappened.value = true;
});

function goBack() {
  if (window.history.length > 2) {
    window.history.back();
  } else {
    router.push("/lotteries");
  }
}
</script>
