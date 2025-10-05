<template>
  <div class="space-y-3 my-4 lg:my-6 w-full">
    <div class="flex justify-between items-center gap-2 px-0">
      <div>
        <input
          type="text"
          placeholder="Search devotions..."
          v-model="search"
          class="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
        />
      </div>

      <!-- Page admin or owner can create devotion -->

      <template v-if="canCreateEvent">
        <BaseButton :full="false" size="md" @click="createEvent">
          <Icon name="uil:plus" size="20" class="mr-2 hidden" />
          Event
        </BaseButton>
      </template>
    </div>

    <BaseTabButton v-model="activeIndex" :statuses="statuses" />

    <div v-if="events.length" class="grid gap-6 md:grid-cols-1">
      <EventsCard v-for="event in events" :key="event.id" :event="event" />
    </div>

    <!-- ---------------No Result Found -->
    <div v-if="!loading && !events.length" class="text-center">
      No result found
    </div>

    <div v-if="loading" class="class flex justify-center py-8">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
import getEventsQuery from "@/graphql/events/list.gql";

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

const router = useRouter();

const user = useCookie("userData");
const canCreateEvent = computed(() => {
  return (
    props.myRoleForPage?.role === "page:admin" ||
    props.myRoleForPage?.role === "page:owner"
  );
});

const statuses = ref([
  { name: "All", value: "all", count: 0 },
  { name: "Series", value: "series", count: 0 },
  { name: "Public", value: "public", count: 0 },
  { name: "Shared", value: "shared", count: 0 },
]);
const search = ref("");
const limit = ref(50);
const offset = ref(0);
const length = ref(0);
const events = ref([]);
const sort = ref([{}]);
const activeIndex = ref(0);
const filter = computed(() => {
  const query = {};
  query._and = {
    is_deleted: {
      _eq: false,
    },
  };
  query._and._or = [
    {
      title: {
        _ilike: `%${search.value}%`,
      },
    },
  ];

  if (activeIndex.value === 2) {
    query._and.visibility = {
      _eq: "public",
    };
  }

  query._and.feed = {
    page_id: {
      _eq: props.page.id,
    },
  };
  return query;
});

const enabled = computed(() => {
  // Only enable if the page is defined and the user has a role
  return activeIndex.value !== 3;
});

const { onResult, loading, refetch } = queryList(getEventsQuery, {
  clientId: user.value?.id ? "auth" : "default",
  filter: filter,
  order: sort,
  limit: limit,
  offset: offset,
  enabled: enabled,
  include_user: true,
});

onResult(({ data }) => {
  if (data.events) {
    events.value = data.events;
    length.value = data.events_aggregate.aggregate.count;
  }
});

provide("refetchEvents", refetch);

const createEvent = () => {
  router.push(
    "/events/create?communityId=" +
      props.page.id +
      "&communityType=page&role=" +
      props.myRoleForPage.role +
      "&visibility=public"
  );
};
</script>
