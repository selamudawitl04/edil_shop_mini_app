<template>
  <!-- Comment Dialog -->
  <BaseDialog v-model="open" title="Prayer Comments">
    <template #heading>
      <div class="flex justify-between items-center">
        <h3 class="flex items-center gap-2">
          Comments ({{ length }})

          <HeadlessPopover class="relative inline-block text-left">
            <HeadlessPopoverButton
              class="p-1 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition"
              aria-label="Sort options">
              <Icon name="mi:sort" size="20" class="text-textPrimary-light dark:text-textPrimary-dark" />
            </HeadlessPopoverButton>

            <HeadlessPopoverPanel
              class="absolute right-0 mt-2 w-40 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-white dark:bg-card-dark z-50">
              <div class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark">
                <button @click="setSort('created_at')"
                  class="w-full text-left px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md">
                  Sort by Created
                </button>
                <button @click="setSort('like_count')"
                  class="w-full text-left px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md">
                  Sort by Like Count
                </button>
              </div>
            </HeadlessPopoverPanel>
          </HeadlessPopover>
        </h3>
      </div>
    </template>

    <template #content>
      <template v-if="loading">
        <div class="class flex justify-center py-8">
          <div class="loader"></div>
        </div>
      </template>
      <template v-else-if="length === 0">
        <p class="text-center text-textSecondary-light dark:text-textSecondary-dark py-8">
          No comments yet.
        </p>
      </template>
      <template v-else>
        <CommentsCard :level="0" v-for="comment in comments" :key="comment.id" :comment="comment" />
      </template>

      <CommentsInput :prayer-request-id="prayerRequest.id" />
    </template>
  </BaseDialog>
</template>

<script setup>
import getPrayerRequestCommentsQuery from "@/graphql/comments/list.gql";

const props = defineProps({
  modelValue: Boolean,
  prayerRequest: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

// Sort state
const selectSort = ref("like_count");
const sort = computed(() => [{ [selectSort.value]: "desc" }]);

function setSort(key) {
  if (selectSort.value !== key) {
    selectSort.value = key;
    refetch(); // refetch comments when sort changes
  }
}

// Query variables
const filter = ref({
  _and: {
    prayer_request_id: { _eq: props.prayerRequest?.id },
    parent_id: { _is_null: true },
  },
});

const comments = ref([]);
const length = ref(0);

// Assume queryList is your composable or helper to run the query
const { onResult, loading, refetch } = queryList(
  getPrayerRequestCommentsQuery,
  {
    filter: filter,
    order: sort,
  }
);

onResult(({ data }) => {
  if (data?.prayer_comments?.length) {
    comments.value = data.prayer_comments;
    length.value = data.prayer_comments_aggregate?.aggregate?.count ?? 0;
  }
});

// Provide for nested components
provide("refetchComments", refetch);
provide("comments", comments);
</script>
