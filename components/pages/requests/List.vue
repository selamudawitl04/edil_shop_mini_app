<template>
  <!-- ----------Create New Prayer Request-------- -->
  <PrayerCreateDialog v-if="openCreateNewRequestDialog && page" v-model="openCreateNewRequestDialog"
    :community-id="page.id" community-type="page" :role="myRoleForPage?.role" :community-name="page.name"
    :language="page.language_code" />
  <!-- ----------Prayer Request Detail--------- -->

  <PagesRequestsDetailDialog v-if="openPrayerRequestDetailDialog && page && selectedPrayerRequest"
    v-model="openPrayerRequestDetailDialog" :my-role-for-page="myRoleForPage"
    :prayerRequestId="selectedPrayerRequest?.id" />

  <div class="space-y-3 my-4 lg:my-6 w-full">
    <!-- -----------------Search for Prayer Request ---------------->
    <div class="flex justify-between items-center mb-4 gap-2 px-0">
      <div>
        <input type="text" placeholder="Search prayer requests..." v-model="search"
          class="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark" />
      </div>

      <!-- ----------Create new request for admins-------- -->
      <template v-if="myRoleForPage">
        <button @click="openCreateNewRequestDialog = true"
          class="inline-flex items-center justify-center px-2 samsg:px-4 py-2 text-sm font-semibold rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition whitespace-nowrap">
          <Icon name="uil:plus" size="20" class="mr-2 hidden" />
          Prayer
        </button>
      </template>
    </div>

    <!-- ---------------Prayer Request List------- -->
    <BaseTabButton v-model="activeIndex" :statuses="statuses" />

    <div v-if="prayerRequests.length" class="grid gap-6 md:grid-cols-1">
      <PrayerCard v-for="prayerRequest in prayerRequests" :key="prayerRequest.id" :prayer-request="prayerRequest" />
    </div>

    <!-- ---------------No Result Found -->
    <div v-if="!loading && !prayerRequests.length" class="text-center">
      No result found
    </div>

    <div v-if="loading" class="class flex justify-center py-8">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
import getPrayerRequestsQuery from "@/graphql/prayers/request_list.gql";
const props = defineProps({
  page: {
    type: Object,
    require: true,
  },

  myRoleForPage: {
    type: Object,
    required: true,
  },
});

const user = useCookie("userData");
/**------------------Fetch prayer requests--------- */

const statuses = ref([
  { name: "All", value: "all", count: 0 },
  { name: "Answered", value: "answered", count: 0 },
]);
const search = ref("");
const limit = ref(50);
const offset = ref(0);

const length = ref(0);
const prayerRequests = ref([]);
const sort = ref([{}]);
const activeIndex = ref(0);
const filter = computed(() => {
  const query = {};
  query._and = {};
  query._and._or = [
    {
      title: {
        _ilike: `%${search.value}%`,
      },
    },
  ];
  if (activeIndex.value === 1) {
    query._and.status = {
      _eq: "answered",
    };
  }

  query._and.feed = {
    page_id: {
      _eq: props.page.id,
    },

  };
  return query;
});

const { onResult, loading, refetch } = queryList(getPrayerRequestsQuery, {
  include_user: user.value ? true : false,
  clientId: user.value ? "auth" : "default",
  filter: filter,
  order: sort,
  limit: limit,
  offset: offset,
});

onResult(({ data }) => {
  if (data.prayer_requests) {
    prayerRequests.value = data.prayer_requests;
    length.value = data.prayer_requests_aggregate?.aggregate?.count;
  }
});

provide("refetchPrayerRequests", refetch);

const selectedPrayerRequest = ref(null);
/**--------------------Create New Request------------- */
const openCreateNewRequestDialog = ref(false);

/**--------------------View Prayer Request Detail------ */
const openPrayerRequestDetailDialog = ref(false);
const viewPrayerRequestDetail = (prayerRequest) => {
  selectedPrayerRequest.value = prayerRequest;
  openPrayerRequestDetailDialog.value = true;
};
watch(openPrayerRequestDetailDialog, (val) => {
  if (!val) {
    selectedPrayerRequest.value = null;
  }
});
</script>
