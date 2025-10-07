<template>
  <BaseError v-if="errorHappened" show-retry @retry="refetch" />
  <div v-else>
    <div v-if="creators.length" class="p-3 space-y-3">
      <div v-for="creator in creators" :key="creator.id">
        <CreatorsCard :user="creator" />
      </div>
    </div>

    <!-- ---------------No Result Found -->
    <div v-if="!loading && !creators.length" class="text-center">
      <BaseZeroResult message="ምንም ውጤት አልተገኘም" />
    </div>

    <div v-if="loading" class="class flex justify-center py-8">
      <div class="loader"></div>
    </div>

    <BaseScrollObserver @reach-bottom="loadMore" />
  </div>
</template>

<script setup>
import listQuery from "@/graphql/creators/list.gql";

const creators = ref([]);
const length = ref(0);

const props = defineProps({
  searchQuery: {
    type: String,
    required: false,
  },
});
const filter = computed(() => {
  const query = {};

  query.name = { _ilike: `%${props.searchQuery}%` };
  query.role = { _eq: "creator" };

  return query;
});

const sort = computed(() => {
  return [{ created_at: "desc" }];
});
const limit = ref(20);
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
  if (data.creators) {
    creators.value = data.creators;
    length.value = data.creators_aggregate?.aggregate.count;
  }

  errorHappened.value = false;
});

onError((error) => {
  errorHappened.value = true;
});

// ---------------Load More
let isLoadingMore = false;
let lastLoadedAt = 0;
const GAP_DURATION = 1000; // milliseconds

const loadMore = async () => {
  const now = Date.now();

  // Prevent overlapping or too-frequent calls
  if (
    isLoadingMore ||
    now - lastLoadedAt < GAP_DURATION ||
    creators.value.length >= length.value
  ) {
    return;
  }

  isLoadingMore = true;

  try {
    const { data } = await fetchMore({
      variables: {
        limit: limit.value,
        offset: creators.value.length, // move forward
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.creators.length === 0) {
          return previousResult;
        }

        return {
          ...previousResult,
          creators: [...previousResult.creators, ...fetchMoreResult.creators],
          creators_aggregate: {
            aggregate: {
              count: fetchMoreResult.creators_aggregate.aggregate.count,
            },
          },
        };
      },
    });

    if (data?.creators?.length > 0) {
      lastLoadedAt = Date.now();
    }
  } catch (e) {
    console.error("Failed to load more:", e);
  } finally {
    isLoadingMore = false;
  }
};
</script>
