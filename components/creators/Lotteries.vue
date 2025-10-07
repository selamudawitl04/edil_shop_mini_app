<template>
  <BaseError v-if="errorHappened" show-retry @retry="refetch" />
  <div v-else>
    <div v-if="lotteries.length" class="p-3 space-y-3">
      <div v-for="lottery in lotteries" :key="lottery.id">
        <LotteryCard :lottery="lottery" />
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
</template>

<script setup>
import listQuery from "@/graphql/lottery/list.gql";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  selected: {
    type: Number,
    required: true,
  },
});

const lotteries = ref([]);
const length = ref(0);

const filter = computed(() => {
  const query = {};

  query.user_id = {
    _eq: props.user.id,
  };

  if (props.selected === 0) {
    query.status = {
      _neq: "pending",
    };
  } else if (props.selected === 1) {
    query.status = {
      _eq: "active",
    };
  } else if (props.selected === 2) {
    query.status = {
      _eq: "closed",
    };
  } else if (props.selected === 3) {
    query.status = {
      _eq: "finished",
    };
  }

  return query;
});

const sort = computed(() => {
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
