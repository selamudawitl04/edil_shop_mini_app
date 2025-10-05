<template>
  <div class=" pt-1">
    <!-- -----------Comment Header with Dropdown----------- -->
    <div class="flex justify-between items-center  gap-2 px-0">
      <h3 class="text-lg  font-semibold text-textPrimary-light dark:text-textPrimary-dark">
        Comments ({{ feed.comment_count || 0 }})
      </h3>

      <!-- Sort Dropdown -->

      <div class="min-w-[10rem]">
        <label for="sortComment" class="sr-only">Sort by</label>
        <BaseSelect id="sortComment" name="sortComment" return-object v-model="selectSort" :items="sort_lists" />
      </div>


    </div>

    <!-- -----------Comment List----------- -->
    <template v-if="loading">
      <p class="text-center text-textSecondary-light dark:text-textSecondary-dark py-8">
        Loading comments...
      </p>
    </template>

    <template v-else-if="comments.length === 0">
      <p class="text-center text-textSecondary-light dark:text-textSecondary-dark py-8">
        No comments yet.
      </p>
    </template>

    <template v-if="comments.length">
      <CommentsCard :level="0" v-for="comment in comments" :key="comment.id" :comment="comment" :feed="feed" />
    </template>



  </div>
</template>

<script setup>
import getCommentsQuery from "@/graphql/comments/list.gql";
const route = useRoute();
const user = useCookie("userData");

const emit = defineEmits(["commentFetched"]);

const props = defineProps({
  feed: {
    type: Object,
    required: true,
  },

});

const sort_lists = ref([
  {
    id: "newest",
    name: "Newest",
    column: "created_at",
    order: "desc",
  },
  {
    id: "oldest",
    name: "Oldest",
    column: "created_at",
    order: "asc",
  },
  {
    id: "most_liked",
    name: "Most Liked",
    column: "like_count",
    order: "desc",
  },
  {
    id: "least_liked",
    name: "Least Liked",
    column: "like_count",
    order: "asc",
  },
]);

// Sort state
const selectSort = ref(sort_lists.value[0]); // default sort
const sort = computed(() => {
  return [{ [selectSort.value.column]: selectSort.value.order }];
});

// Filters
const filter = ref({
  _and: {
    feed_id: {
      _eq: props.feed?.id,
    },
    parent_comment_id: {
      _is_null: true,
    },
  },
});



// Query
const comments = ref([]);
const { onResult, loading, refetch } = queryList(
  getCommentsQuery,
  {
    clientId: user.value?.id ? "auth" : "default",
    include_user: true,
    filter,
    order: sort,
    limit: 10,
    offset: 0,
  }
);



onResult(({ data }) => {
  if (data?.comments) {
    comments.value = data.comments;
    emit("commentFetched", data.comments);
  }
});

// Provide
provide("refetchComments", refetch);
defineExpose({
  refetch,
});
provide("comments", comments);
</script>
