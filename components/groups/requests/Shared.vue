<template>


  <div class="space-y-3 my-4 lg:my-6 w-full">
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
  group: {
    type: Object,
    require: true,
  },


  search: {
    type: String,
    default: "",
  },
});

/**--------------------Tabs--------------- */

/**------------------Fetch prayer requests--------- */

const search = ref("");
const limit = ref(50);
const offset = ref(0);

const length = ref(0);
const prayerRequests = ref([]);
const sort = ref([{}]);
const filter = computed(() => {
  const query = {};
  query._and = {
    group_prayer_shares: {
      group_id: {
        _eq: props.group.id,
      },
    },
  };
  query._and._or = [
    {
      title: {
        _ilike: `%${props.search}%`,
      },
    },
  ];

  return query;
});
const { onResult, loading, refetch } = queryList(getPrayerRequestsQuery, {
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

provide("refetchPrayers", refetch);

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
