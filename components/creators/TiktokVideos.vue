<template>
  <section class="w-full">
    <!-- Header -->
    <div
      class="flex justify-between items-start md:items-center mb-2 lg:mb-8 gap-4"
    >
      <h1
        class="text-xl md:text-3xl font-extrabold text-gray-800 dark:text-gray-100"
      >
        Tiktok videos
        <span class="text-primary-light dark:text-primary-dark"
          >({{ length }})</span
        >
      </h1>
    </div>

    <!-- Lottery Cards Grid -->
    <div v-if="!loading" class="flex items-center justify-center w-full">
      <div v-if="videos.length" class="space-y-4">
        <MediaTikVideoCard v-for="video in videos" :video="video" />
      </div>

      <!-- Empty State -->
      <div v-if="!videos.length" class="text-center">
        <BaseZeroResult message="ምንም ውጤት አልተገኘም" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="class flex justify-center py-8">
      <div class="loader"></div>
    </div>

    <BaseScrollObserver @reach-bottom="loadMore" />
  </section>
</template>

<script setup>
import listQuery from "@/graphql/medias/tiktok_videos.gql";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const videos = ref([]);
const length = ref(0);

const filter = computed(() => {
  const query = {
    user_id: { _eq: props.user.id },
  };

  return query;
});

const sort = ref([{}]);
const limit = ref(30);
const offset = ref(0);

const { onResult, loading, refetch, fetchMore } = queryList(listQuery, {
  clientId: "auth",
  filter: filter,
  order: sort,
  limit: limit,
  offset: offset,
});

onResult(({ data }) => {
  if (!data.tiktok_videos) return;

  videos.value = data.tiktok_videos;

  // keep the aggregate count
  length.value = data.total?.aggregate?.count || 0;
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
    videos.value.length >= length.value
  ) {
    return;
  }

  isLoadingMore = true;

  try {
    const { data } = await fetchMore({
      variables: {
        limit: limit.value,
        offset: videos.value.length, // move forward
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.tiktok_videos.length === 0) {
          return previousResult;
        }

        return {
          ...previousResult,
          tiktok_videos: [
            ...previousResult.tiktok_videos,
            ...fetchMoreResult.tiktok_videos,
          ],
          tiktok_videos_aggregate: {
            aggregate: {
              count: fetchMoreResult.tiktok_videos_aggregate.aggregate.count,
            },
          },
        };
      },
    });

    if (data?.tiktok_videos?.length > 0) {
      lastLoadedAt = Date.now();
    }
  } catch (e) {
    console.error("Failed to load more:", e);
  } finally {
    isLoadingMore = false;
  }
};
</script>

<style scoped>
/* Optional: smooth hover effect for cards */
.LotteryTicket Card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
</style>
