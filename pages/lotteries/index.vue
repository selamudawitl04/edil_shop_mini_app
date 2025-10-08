<template>
  <NuxtLayout name="app">
    <!-- Fixed App Bar -->
    <div class="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden">
      <HomeAppBar
        @resetFilters="resetFilters"
        @applyFilters="applyFilters"
        :hasActiveFilters="hasActiveFilters"
        v-model:searchQuery="searchQuery"
      />
    </div>

    <!-- Spacer for header -->
    <div class="h-14"></div>

    <BaseError v-if="errorHappened" show-retry @retry="refetch" />
    <div v-else>
      <div v-if="lotteries.length" class="p-3 space-y-3">
        <div v-for="lottery in lotteries" :key="lottery.id">
          <LotteryCard
            :lottery="lottery"
            :category="queryVariables.category_id"
          />
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
  category_id: "ሁሉም",
  sort: "High price",
  price_range: [0, 5000],
  ticket_size_range: [0, 2000],
});

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
  const query = {};

  if (searchQuery.value) {
    query._or = {
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
    };
  }

  // category_id
  if (queryVariables.value.category_id !== "ሁሉም") {
    query.items = {
      category_id: { _eq: queryVariables.value.category_id },
    };
  }

  // price_range

  if (
    queryVariables.value.price_range[0] !== 0 ||
    queryVariables.value.price_range[1] !== 5000
  ) {
    query.price_per_ticket = {
      _gte: queryVariables.value.price_range[0],
      _lte: queryVariables.value.price_range[1],
    };
  }

  // ticket_size_range

  if (
    queryVariables.value.ticket_size_range[0] !== 0 ||
    queryVariables.value.ticket_size_range[1] !== 2000
  ) {
    query.total_tickets = {
      _gte: queryVariables.value.ticket_size_range[0],
      _lte: queryVariables.value.ticket_size_range[1],
    };
  }
  // status

  // query.status = {
  //   _eq: "active",
  // };

  return query;
});

const sort = computed(() => {
  if (queryVariables.value.sort === "High price") {
    return [{ price_per_ticket: "desc" }];
  } else if (queryVariables.value.sort === "Low price") {
    return [{ price_per_ticket: "asc" }];
  } else if (queryVariables.value.sort === "Newest") {
    return [{ created_at: "desc" }];
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
  // alert(error.message);
});

const hasActiveFilters = computed(() => {
  return (
    queryVariables.value.category_id !== "ሁሉም" ||
    queryVariables.value.sort !== "High price" ||
    queryVariables.value.price_range[0] !== 0 ||
    queryVariables.value.price_range[1] !== 5000 ||
    queryVariables.value.ticket_size_range[0] !== 0 ||
    queryVariables.value.ticket_size_range[1] !== 2000
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
