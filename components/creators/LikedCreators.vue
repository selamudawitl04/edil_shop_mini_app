<template>
  <BaseError v-if="errorHappened" show-retry @retry="refetch" />

  <div v-else>
    <!-- --------------- Creator List ---------------- -->
    <div v-if="likedCreators.length" class="p-3 space-y-3">
      <div v-for="creator in likedCreators" :key="creator.id">
        <CreatorsCard :user="creator.creator" />
      </div>
    </div>

    <!-- --------------- No Result Found ---------------- -->
    <div v-if="!loading && !likedCreators.length" class="text-center py-8">
      <BaseZeroResult message="ምንም ውጤት አልተገኘም" />
    </div>

    <!-- --------------- Loading Spinner ---------------- -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="loader"></div>
    </div>

    <!-- --------------- Infinite Scroll ---------------- -->
    <BaseScrollObserver @reach-bottom="loadMore" />
  </div>
</template>

<script setup>
import listQuery from "@/graphql/creators/liked_creators.gql";

const likedCreators = ref([]);
const totalCount = ref(0);

const props = defineProps({
  searchQuery: { type: String, default: "" },
});

const user = useCookie("userData");

const filter = computed(() => {
  const query = {
    user_id: { _eq: user.value?.id },
  };

  if (props.searchQuery?.trim()) {
    query.creator = { name: { _ilike: `%${props.searchQuery}%` } };
  }

  return query;
});

const sort = computed(() => [{ created_at: "desc" }]);
const limit = ref(20);
const offset = ref(0);
const errorHappened = ref(false);

// --------------- GraphQL Query ----------------
const { onResult, loading, refetch, fetchMore, onError } = queryList(
  listQuery,
  {
    clientId: "auth",
    filter,
    order: sort,
    limit,
    offset,
  }
);
onResult(({ data }) => {
  if (data?.creator_likes?.length) {
    // Loop through each creator_like and attach likes array to its creator
    data.creator_likes.forEach((creator_like) => {
      // Ensure `creator.likes` exists
      if (!Array.isArray(creator_like.creator.likes)) {
        creator_like.creator.likes = [];
      }

      // Push the like data
      creator_like.creator.likes.push({
        id: creator_like.id,
        user_id: creator_like.user_id,
      });
    });

    // Save all liked creators and total count
    likedCreators.value = data.creator_likes;
    totalCount.value = data.creator_likes_aggregate?.aggregate?.count ?? 0;
  } else {
    likedCreators.value = [];
  }

  errorHappened.value = false;
});

onError((error) => {
  console.error("Liked creators query error:", error);
  errorHappened.value = true;
});

// --------------- Load More ----------------
let isLoadingMore = false;
let lastLoadedAt = 0;
const GAP_DURATION = 1000; // milliseconds

const loadMore = async () => {
  const now = Date.now();

  if (
    isLoadingMore ||
    now - lastLoadedAt < GAP_DURATION ||
    likedCreators.value.length >= totalCount.value
  ) {
    return;
  }

  isLoadingMore = true;

  try {
    const { data } = await fetchMore({
      variables: {
        limit: limit.value,
        offset: likedCreators.value.length,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.creator_likes?.length) {
          return previousResult;
        }

        return {
          ...previousResult,
          creator_likes: [
            ...previousResult.creator_likes,
            ...fetchMoreResult.creator_likes,
          ],
          creator_likes_aggregate: fetchMoreResult.creator_likes_aggregate,
        };
      },
    });

    if (data?.creator_likes?.length > 0) {
      lastLoadedAt = Date.now();
    }
  } catch (e) {
    console.error("Failed to load more creators:", e);
  } finally {
    isLoadingMore = false;
  }
};
</script>
