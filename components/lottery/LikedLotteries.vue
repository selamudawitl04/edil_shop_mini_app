<template>
  <div>
    <BaseError v-if="errorHappened" show-retry @retry="refetch" />
    <div v-else>
      <div v-if="lottery_likes.length" class="p-3 space-y-3">
        <div v-for="lotter_like in lottery_likes" :key="lotter_like.id">
          <LotteryCard :lottery="lotter_like.lottery" />
        </div>
      </div>

      <!-- ---------------No Result Found -->
      <div v-if="!loading && !lottery_likes.length" class="text-center">
        <BaseZeroResult message="ምንም ውጤት አልተገኘም" />
      </div>

      <div v-if="loading" class="class flex justify-center py-8">
        <div class="loader"></div>
      </div>

      <BaseScrollObserver @reach-bottom="loadMore" />
    </div>
  </div>
</template>

<script setup>
const errorHappened = ref(false);
import listQuery from "@/graphql/lottery/liked_lotteries.gql";

const user = useCookie("userData");

const lottery_likes = ref([]);
const length = ref(0);

const filter = computed(() => {
  const query = {
    user_id: {
      _eq: user.value.id,
    },
  };

  return query;
});

const sort = ref([{ created_at: "desc" }]);
const limit = ref(10);
const offset = ref(0);

const { onResult, loading, refetch, onError, fetchMore } = queryList(
  listQuery,
  {
    filter: filter,
    order: sort,
    limit: limit,
    offset: offset,
  }
);

onResult(({ data }) => {
  if (data?.lottery_likes?.length) {
    // Loop through each lottery_like
    data.lottery_likes.forEach((lottery_like) => {
      // Ensure `lottery.likes` exists
      if (!Array.isArray(lottery_like.lottery.likes)) {
        lottery_like.lottery.likes = [];
      }

      // Push the like ID into the lottery.likes array
      lottery_like.lottery.likes.push({
        id: lottery_like.id,
        user_id: lottery_like.user_id,
      });
    });

    // Save all likes and count
    lottery_likes.value = data.lottery_likes;
    length.value = data.lottery_likes_aggregate?.aggregate?.count || 0;
  }
});

onError((error) => {
  errorHappened.value = true;
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
    lottery_likes.value.length >= length.value
  ) {
    return;
  }

  isLoadingMore = true;

  try {
    const { data } = await fetchMore({
      variables: {
        limit: limit.value,
        offset: lottery_likes.value.length, // move forward
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.lottery_likes.length === 0) {
          return previousResult;
        }

        return {
          ...previousResult,
          lottery_likes: [
            ...previousResult.lottery_likes,
            ...fetchMoreResult.lottery_likes,
          ],
          lottery_likes_aggregate: {
            aggregate: {
              count: fetchMoreResult.lottery_likes_aggregate.aggregate.count,
            },
          },
        };
      },
    });

    if (data?.lottery_likes?.length > 0) {
      lastLoadedAt = Date.now();
    }
  } catch (e) {
    console.error("Failed to load more:", e);
  } finally {
    isLoadingMore = false;
  }
};
</script>
