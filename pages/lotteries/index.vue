<template>
  <NuxtLayout name="app">
    <!-- Fixed App Bar -->
    <div class="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden">
      <HomeAppBar
        @resetFilters="resetFilters"
        @applyFilters="applyFilters"
        :hasActiveFilters="hasActiveFilters"
        v-model:searchQuery="searchQuery"
        v-model:categoryId="categoryId"
      />
    </div>

    <!-- Spacer for header -->
    <div class="h-20 mb-1.5"></div>

    <BaseError v-if="errorHappened" show-retry @retry="refetch" />
    <div v-else>
      <div v-if="lotteries.length" class="p-3 space-y-3">
        <div v-for="lottery in lotteries" :key="lottery.id">
          <LotteryCard :lottery="lottery" :category="categoryId" />
        </div>
      </div>

      <!-- ---------------No Result Found -->
      <div v-if="!loading && !lotteries.length" class="text-center">
        <BaseZeroResult message="ምንም ውጤት አልተገኘም" />
      </div>

      <div v-if="loading" class="class flex justify-center py-8">
        <div class="loader"></div>
      </div>

      <BaseScrollObserver @reach-bottom="loadMore" />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from "vue";

const searchQuery = ref("");
const queryVariables = ref({
  sort: "High price",
  min_price: null,
  max_price: null,
  min_ticket_size: null,
  max_ticket_size: null,
});
const categoryId = ref("ሁሉም");

const resetFilters = (variables) => {
  queryVariables.value = variables;
};

const applyFilters = (variables) => {
  queryVariables.value = variables;
};

import listQuery from "@/graphql/lottery/list.gql";

const lotteries = ref([]);
const length = ref(0);

const filter = computed(() => {
  const andConditions = [];

  // 🔍 Search Filter
  if (searchQuery.value) {
    andConditions.push({
      _or: [
        {
          items: {
            title: { _ilike: `%${searchQuery.value}%` },
          },
        },
        {
          items: {
            category: {
              name: { _ilike: `%${searchQuery.value}%` },
            },
          },
        },
        {
          lottery_id: { _ilike: `%${searchQuery.value}%` },
        },
      ],
    });
  }

  // 🏷️ Category Filter
  if (categoryId.value !== "ሁሉም") {
    andConditions.push({
      items: {
        category_id: { _eq: categoryId.value },
      },
    });
  }

  // 💰 Price Range Filter
  const priceCondition = {};
  if (queryVariables.value.min_price !== null) {
    priceCondition._gte = queryVariables.value.min_price;
  }
  if (queryVariables.value.max_price !== null) {
    priceCondition._lte = queryVariables.value.max_price;
  }
  if (Object.keys(priceCondition).length > 0) {
    andConditions.push({
      price_per_ticket: priceCondition,
    });
  }

  // 🎟️ Ticket Size Range
  const ticketSizeCondition = {};
  if (queryVariables.value.min_ticket_size !== null) {
    ticketSizeCondition._gte = queryVariables.value.min_ticket_size;
  }
  if (queryVariables.value.max_ticket_size !== null) {
    ticketSizeCondition._lte = queryVariables.value.max_ticket_size;
  }
  if (Object.keys(ticketSizeCondition).length > 0) {
    andConditions.push({
      total_tickets: ticketSizeCondition,
    });
  }

  // 🟢 Status Filter
  andConditions.push({
    status: { _eq: "active" },
  });

  // ✅ Final combined query
  return { _and: andConditions };
});

const sort = computed(() => {
  if (queryVariables.value.sort === "High price") {
    return [{ price_per_ticket: "desc" }];
  } else if (queryVariables.value.sort === "Low price") {
    return [{ price_per_ticket: "asc" }];
  } else if (queryVariables.value.sort === "Newest") {
    return [{ created_at: "desc" }];
  } else if (queryVariables.value.sort === "Popular") {
    return [{ total_likes: "desc" }];
  } else if (queryVariables.value.sort === "Oldest") {
    return [{ created_at: "asc" }];
  }

  return [{ created_at: "desc" }];
});
const limit = ref(10);
const offset = ref(0);

const errorHappened = ref(false);
const { onResult, loading, refetch, fetchMore, onError } = queryList(
  listQuery,
  {
    clientId: "auth",
    filter: filter,
    order: sort,
    limit: limit,
    offset: offset,
  }
);

onResult(({ data }) => {
  if (data.lotteries) {
    lotteries.value = data.lotteries;
    length.value = data.lotteries_aggregate?.aggregate.count;
  }

  errorHappened.value = false;
});

onError((error) => {
  errorHappened.value = true;
});

const hasActiveFilters = computed(() => {
  return (
    queryVariables.value.sort !== "High price" ||
    queryVariables.value.min_price !== null ||
    queryVariables.value.max_price !== null ||
    queryVariables.value.min_ticket_size !== null ||
    queryVariables.value.max_ticket_size !== null
  );
});

let isLoadingMore = false;
let lastLoadedAt = 0;
const GAP_DURATION = 1000; // milliseconds

const loadMore = async () => {
  const now = Date.now();

  // Prevent overlapping or too-frequent calls
  if (
    isLoadingMore ||
    now - lastLoadedAt < GAP_DURATION ||
    lotteries.value.length >= length.value
  ) {
    return;
  }

  isLoadingMore = true;

  try {
    const { data } = await fetchMore({
      variables: {
        limit: limit.value,
        offset: lotteries.value.length, // move forward
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.lotteries.length === 0) {
          return previousResult;
        }

        return {
          ...previousResult,
          lotteries: [
            ...previousResult.lotteries,
            ...fetchMoreResult.lotteries,
          ],
          lotteries_aggregate: {
            aggregate: {
              count: fetchMoreResult.lotteries_aggregate.aggregate.count,
            },
          },
        };
      },
    });

    if (data?.lotteries?.length > 0) {
      lastLoadedAt = Date.now();
    }
  } catch (e) {
    console.error("Failed to load more:", e);
  } finally {
    isLoadingMore = false;
  }
};
</script>
