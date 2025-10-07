<template>
  <NuxtLayout name="app">
    <!-- Fixed App Bar -->
    <div
      class="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden bg-white"
    >
      <h1 class="text-2xl font-bold text-center py-1.5">ማሳወቂያዎች</h1>
    </div>
    <div class="h-10"></div>
    <BaseError v-if="errorHappened" show-retry @retry="refetch" />
    <div v-else>
      <div v-if="notifications.length" class="p-3 space-y-3">
        <div v-for="notification in notifications" :key="notification.id">
          <NotificationCard
            :notification="notification"
            @deleteDone="handleDeleteDone(notification.id)"
          />
        </div>
      </div>

      <!-- ---------------No Result Found -->
      <div v-if="!loading && !notifications.length" class="text-center">
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
import listQuery from "@/graphql/notifications/list.gql";

const notifications = ref([]);
const length = ref(0);

const filter = computed(() => {
  const query = {};

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
  if (data.notifications) {
    notifications.value = data.notifications;
    length.value = data.notifications_aggregate?.aggregate.count;
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
    notifications.value.length >= length.value
  ) {
    return;
  }

  isLoadingMore = true;

  try {
    const { data } = await fetchMore({
      variables: {
        limit: limit.value,
        offset: notifications.value.length, // move forward
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.notifications.length === 0) {
          return previousResult;
        }

        return {
          ...previousResult,
          notifications: [
            ...previousResult.notifications,
            ...fetchMoreResult.notifications,
          ],
          notifications_aggregate: {
            aggregate: {
              count: fetchMoreResult.notifications_aggregate.aggregate.count,
            },
          },
        };
      },
    });

    if (data?.notifications?.length > 0) {
      lastLoadedAt = Date.now();
    }
  } catch (e) {
    console.error("Failed to load more:", e);
  } finally {
    isLoadingMore = false;
  }
};

const handleDeleteDone = (id) => {
  notifications.value = notifications.value.filter(
    (notification) => notification.id !== id
  );
};
</script>
