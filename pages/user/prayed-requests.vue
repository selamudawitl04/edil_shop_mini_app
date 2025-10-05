<template>
  <NuxtLayout name="user">
    <section
      class="bg-background-light dark:bg-background-dark pt-24 pb-20 px-4 sm:px-8 min-h-screen"
    >
      <div
        class="mb-10 flex flex-wrap justify-between items-start gap-4 flex-col md:flex-row"
      >
        <!-- Category Filter Dropdown -->
        <div class="flex items-center gap-2">
          <label for="category" class="sr-only">Filter by Category</label>
          <SelectCategory v-model="category" add-all-categories />
        </div>

        <!-- Language Filter -->
        <div class="flex flex-wrap items-center gap-2">
          <label for="language" class="sr-only">Filter by Language</label>
          <SelectLanguage v-model="language" add-all-languages />

          <!-- Sort Dropdown -->
          <label for="sort" class="sr-only">Sort by</label>
          <select
            v-model="selectSort"
            id="sort"
            class="px-3 py-2 rounded-md border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-slate-800 text-sm text-textPrimary-light dark:text-textPrimary-dark"
          >
            <option value="created_at">Sort by Created</option>
            <option value="prayer_count">Sort by Pray Count</option>
            <!-- <option value="urgency">Sort by Urgency Level</option> -->
          </select>
        </div>
      </div>
      <div v-if="prayerRequests.length" class="grid gap-6 md:grid-cols-2">
        <PrayerCard
          v-for="prayerRequest in prayerRequests"
          :key="prayerRequest.id"
          :prayer-request="prayerRequest"
        />
      </div>

      <!-- ---------------No Result Found -->
      <div v-if="!loading && !prayerRequests.length" class="text-center">
        No result found
      </div>

      <div v-if="loading" class="class flex justify-center py-8">
        <div class="loader"></div>
      </div>

      <BaseScrollObserver @reach-bottom="loadMore" />
    </section>
  </NuxtLayout>
</template>

<script setup>
import getPrayerRequestsQuery from "@/graphql/prayers/request_list.gql";

/**----------------------Fetch prayer requests------------------ */
const user = useCookie("userData");
const selectSort = ref("created_at");
const sort = computed(() => {
  return [{ [selectSort.value]: "desc" }];
});

const length = ref(0);
const limit = ref(20);
const offset = ref(0);
const prayerRequests = ref([]);
const category = ref("All Categories");
const language = ref("All Languages");
const filter = computed(() => {
  const query = {};
  query._and = {};
  if (category.value != "" && category.value != "All Categories") {
    query._and.prayer_category = {
      _eq: category.value,
    };
  }

  if (language.value != "" && language.value != "All Languages") {
    query._and.language = {
      _eq: language.value,
    };
  }
  query._and.bookmarked_prayers = {
    user_id: {
      _eq: user.value?.id,
    },
  };
  return query;
});

const { onResult, loading, fetchMore, refetch } = queryList(
  getPrayerRequestsQuery,
  {
    order: sort,
    filter: filter,
    offset: offset,
    limit: limit,
  }
);

onResult(({ data }) => {
  if (data.prayer_requests?.length) {
    prayerRequests.value = data.prayer_requests;
    length.value = data.prayer_requests_aggregate?.aggregate?.count;
  }
});

provide("refetchPrayers", refetch);

let isLoadingMore = false;
let lastLoadedAt = 0;
const GAP_DURATION = 1000; // milliseconds

const loadMore = async () => {
  const now = Date.now();

  if (
    isLoadingMore ||
    now - lastLoadedAt < GAP_DURATION ||
    prayerRequests.value.length >= length.value
  )
    return;

  isLoadingMore = true;

  try {
    await fetchMore({
      variables: {
        limit: limit.value,
        offset: prayerRequests.value.length,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return {
          prayer_requests: [
            ...previousResult.prayer_requests,
            ...fetchMoreResult.prayer_requests,
          ],
        };
      },
    });

    lastLoadedAt = Date.now();
  } catch (e) {
    console.error("Failed to load more:", e);
  } finally {
    isLoadingMore = false;
  }
};
</script>

<style scoped></style>
