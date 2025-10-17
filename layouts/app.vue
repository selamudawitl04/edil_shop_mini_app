<script setup>
import { ref } from "vue";
import { useLotteryStore } from "@/stores/lottery";
import { useCreatorStore } from "@/stores/creator";

const lotteryStore = useLotteryStore();
const creatorStore = useCreatorStore();

const navs = ref([
  { name: "መዉጫ", icon: "mdi:home-outline", to: "/lotteries" },
  { name: "የኔ እጣዎች", icon: "mdi:ticket-percent-outline", to: "/my-tickets" },
  { name: "አዘጋጆች", icon: "mdi:account-group-outline", to: "/creators" },
  { name: "ማሳወቂያ", icon: "mdi:bell-outline", to: "/notifications" },
  { name: "ተጨማሪ", icon: "mdi:dots-horizontal", to: "/more" },
]);

import listQuery from "@/graphql/lottery/list.gql";
const lotteries = ref([]);
const length = ref(0);

const filter = computed(() => {
  const query = {};

  return query;
});

const sort = computed(() => {
  return [{ created_at: "desc" }];
});
const limit = ref(14);
const offset = ref(0);

const { onResult } = queryList(listQuery, {
  clientId: "auth",
  filter: filter,
  order: sort,
  limit: limit,
  offset: offset,
});

onResult(({ data }) => {
  if (data.lotteries) {
    lotteries.value = data.lotteries;
    length.value = data.lotteries_aggregate?.aggregate.count;
  }
});
</script>

<template>
  <LotteryDetail v-if="lotteryStore.showLottery" />
  <CreatorsDetail v-if="creatorStore.showCreator" />
  <div class="min-h-screen h-screen max-h-screen flex flex-col">
    <!-- Main Content -->
    <main class="flex-1 bg-gray-50 overflow-y-auto">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="bg-white border-t border-gray-200 shadow-lg">
      <ul class="flex justify-around">
        <li
          v-for="nav in navs"
          :key="nav.name"
          class="flex flex-col items-center justify-center py-2 transition-colors duration-200"
        >
          <NuxtLink
            :to="nav.to"
            class="flex flex-col items-center justify-center"
            active-class="text-blue-600"
            exact-active-class="text-blue-600 font-bold"
          >
            <Icon :name="nav.icon" class="w-6 h-6" />
            <span class="text-xs mt-1 font-bold">{{ nav.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
nav {
  position: sticky;
  bottom: 0;
  width: 100%;
}
</style>
