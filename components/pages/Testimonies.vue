<template>
  <div class="space-y-3 my-4 lg:my-6 w-full">
    <div class="flex justify-between items-center gap-2 px-0">
      <div>
        <input
          type="text"
          placeholder="Search testimonies..."
          v-model="search"
          class="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
        />
      </div>

      <!-- Page admin or owner can create testimony -->
      <template v-if="canCreateTestimony">
        <BaseButton :full="false" size="md" @click="createTestimony">
          <Icon name="uil:plus" size="20" class="mr-2 hidden" />

          Testimony
        </BaseButton>
      </template>
    </div>

    <BaseTabButton v-model="activeIndex" :statuses="statuses" />

    <!-- ---------------------------Testimonies List -------------------- -->
    <!-- only one column -->
    <div
      v-if="activeIndex != 1 && testimonies.length"
      class="grid gap-6 md:grid-cols-1"
    >
      <TestimoniesCard
        v-for="testimony in testimonies"
        :key="testimony.id"
        :testimony="testimony"
        :role="myRoleForPage?.role"
      />
    </div>

    <!-- ---------------No Result Found -->
    <div
      v-if="!loading && !testimonies.length && activeIndex === 0"
      class="text-center"
    >
      No testimonies found
    </div>

    <div
      v-if="loading && activeIndex === 0"
      class="class flex justify-center py-8"
    >
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
import { useTestimonyStore } from "@/stores/testimony";

const testimonyStore = useTestimonyStore();

import getTestimonies from "@/graphql/testimonies/list.gql";

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
const canCreateTestimony = computed(() => {
  return (
    props.myRoleForPage?.role === "page:admin" ||
    props.myRoleForPage?.role === "page:owner"
  );
});

const statuses = ref([
  { name: "All", value: "all", count: 0 },
  { name: "Public", value: "public", count: 0 },
  { name: "Shared", value: "shared", count: 0 },
]);
const search = ref("");
const limit = ref(50);
const offset = ref(0);
const length = ref(0);
const testimonies = ref([]);
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

const { onResult, loading, refetch } = queryList(getTestimonies, {
  clientId: user.value?.id ? "auth" : "default",
  filter: filter,
  order: sort,
  limit: limit,
  offset: offset,
  include_user: user.value?.id ? true : false,
});

onResult(({ data }) => {
  if (data.testimony_testimonies) {
    testimonies.value = data.testimony_testimonies;
  }
});
provide("refetchTestimonies", refetch);

/* --------------------Create New Testimony Dialog -------------------- */

const createTestimony = () => {
  testimonyStore.openCreate({
    communityId: props.page.id,
    communityType: "page",
    role: props.myRoleForPage.role,
  });
};
</script>
