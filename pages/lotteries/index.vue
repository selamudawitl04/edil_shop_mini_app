<template>
  <NuxtLayout name="app">
    <section class="container mx-auto px-3 lg:px-6 lg:py-8 min-h-screen">
      <!-- Header -->
      <div
        class="flex justify-between items-start md:items-center mb-2 lg:mb-8 gap-4"
      >
        <h1
          class="text-xl md:text-3xl font-extrabold text-gray-800 dark:text-gray-100"
        >
          ዕጣዎች
          <span class="text-primary-light dark:text-primary-dark"
            >({{ length }})</span
          >
        </h1>
        <BaseButton
          @click="$router.push('/create-lottery')"
          :full="false"
          class="flex items-center gap-2 px-4 py-2 text-sm md:text-base"
        >
          <Icon name="mdi:plus" />
          ዕጣ ጨምር
        </BaseButton>
      </div>

      <!-- Tabs -->
      <div class="mb-4 lg:mb-6">
        <BaseTab v-model:current-tab-index="activeIndex" :tabs="tabs">
          <template #tab="{ tabData }">
            <span class="text-sm font-medium">
              {{ tabData.tab.name }}
              <span class="text-xs font-normal text-gray-700">
                ({{ tabData.tab.count }})
              </span>
            </span>
          </template>
        </BaseTab>
      </div>

      <!-- Lottery Cards Grid -->
      <div v-if="!loading">
        <div
          v-if="lotteries.length"
          class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6"
        >
          <LotteryCard
            v-for="lottery in lotteries"
            :key="lottery.id"
            :lottery="lottery"
            class="hover:scale-105 transition-transform duration-150"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-20 text-center text-gray-500 dark:text-gray-400"
        >
          <div class="text-6xl mb-4">🎟️</div>
          <p class="text-lg font-medium">ሎተሪች አልተገኙም</p>
          <p class="text-sm mt-2">እባክዎ አዲስ ሎተሪ ይፍጠሩ</p>
        </div>

        <div class="py-8">
          <BasePaginate
            :items-per-page="limit"
            :total-data="length"
            v-model:offset="offset"
          />
        </div>
      </div>

      <!-- Loading State -->

      <div v-if="loading" class="class flex justify-center py-8">
        <div class="loader"></div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import listQuery from "@/graphql/lottery/list.gql";

const user = useCookie("userData");
const activeIndex = ref(0);
const tabs = ref([
  { name: "ሁሉም", value: "ሁሉም", count: 0 },
  { name: "ያልዎጡ", value: "ያልዎጡ", count: 0 },
  { name: "የዎጡ", value: "የዎጡ", count: 0 },
  { name: "ያልተጀመሩ", value: "ያልተጀመሩ", count: 0 },
  { name: "የተጠናቀቁ", value: "ተጠናቀቀ", count: 0 },
]);

const lotteries = ref([]);
const length = ref(0);

const filter = computed(() => {
  const query = {
    user_id: {
      _eq: user.value.id,
    },
  };

  if (activeIndex.value === 1) {
    query.status = {
      _eq: "active",
    };
  } else if (activeIndex.value === 2) {
    query.status = {
      _eq: "closed",
    };
  } else if (activeIndex.value === 3) {
    query.status = {
      _eq: "pending",
    };
  } else if (activeIndex.value === 4) {
    query.status = {
      _eq: "finished",
    };
  }

  return query;
});

const sort = ref([{ created_at: "desc" }]);
const limit = ref(12);
const offset = ref(0);

const { onResult, loading, refetch } = queryList(listQuery, {
  clientId: "auth",
  filter: filter,
  order: sort,
  limit: limit,
  offset: offset,
  include_user: true,
});

onResult(({ data }) => {
  if (data.lotteries) {
    lotteries.value = data.lotteries;
    length.value = data.total.aggregate.count;

    tabs.value[0].count = data.total.aggregate.count;
    tabs.value[1].count = data.active.aggregate.count;
    tabs.value[2].count = data.closed.aggregate.count;
    tabs.value[3].count = data.pending.aggregate.count;
    tabs.value[4].count = data.finished.aggregate.count;
  }
});

provide("refetchLotteries", refetch);
</script>

<style scoped>
/* Optional: smooth hover effect for cards */
.LotteryCard:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
</style>
