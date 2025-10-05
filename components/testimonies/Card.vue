<script setup>
import { formatDistanceToNow } from "date-fns";
import { useTestimonyStore } from "@/stores/testimony";
import { usePrayerStore } from "@/stores/prayer";

const testimonyStore = useTestimonyStore();
const prayerStore = usePrayerStore();
const user = useCookie("userData");
const emits = defineEmits(["openDetail"]);

const props = defineProps({
  testimony: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const testimonyCreatedAt = computed(() => {
  const _createdAt = new Date(props.testimony?.created_at);
  if (_createdAt) {
    return formatDistanceToNow(_createdAt);
  } else {
    return "Unknown";
  }
});

const userReaction = computed(() => {
  return props.testimony?.feed?.feed_reactions?.length > 0
    ? props.testimony?.feed?.feed_reactions[0]
    : null;
});

const avatarImage = computed(() => {
  if (props.testimony?.feed?.group) {
    return props.testimony?.feed?.group?.profile_image;
  } else if (props.testimony?.feed?.page) {
    return props.testimony?.feed?.page?.profile_image;
  } else if (props.testimony?.feed?.user) {
    return props.testimony?.feed?.user?.profile_image;
  } else {
    return null;
  }
});

const avatarColor = computed(() => {
  if (props.testimony?.feed?.group) {
    return props.testimony?.feed?.group?.avatar_color;
  } else if (props.testimony?.feed?.page) {
    return props.testimony?.feed?.page?.avatar_color;
  } else if (props.testimony?.feed?.user) {
    return props.testimony?.feed?.user?.avatar_color;
  } else {
    return null;
  }
});

const name = computed(() => {
  if (props.testimony?.feed?.group) {
    return props.testimony?.feed?.group?.name;
  } else if (props.testimony?.feed?.page) {
    return props.testimony?.feed?.page?.name;
  } else if (props.testimony?.feed?.user) {
    return props.testimony?.feed?.user?.full_name;
  } else {
    return "Anonymous";
  }
});

const onReact = (reaction) => {
  if (userReaction.value) {
    userReaction.value.reaction_type = reaction.reaction_type;
  } else {
    props.testimony.feed.feed_reactions.push(reaction);
    props.testimony.feed.reaction_count++;
  }
};

const onUnReact = () => {
  if (userReaction.value) {
    props.testimony.feed.feed_reactions = [];
    props.testimony.feed.reaction_count--;
  }
};

const showFullContent = ref(false);

const truncatedContent = computed(() => {
  return props.testimony.content.length > 200
    ? props.testimony.content.slice(0, 200) + "..."
    : props.testimony.content;
});

const toggleFullContent = () => {
  showFullContent.value = !showFullContent.value;
  if (props.testimony?.content?.length < 200) {
    showDetailDialog();
  }
};

const showDetailDialog = () => {
  testimonyStore.openTestimony(props.testimony.id);
};
</script>

<template>
  <div
    @click="showDetailDialog"
    :title="`Click to view details of: ${testimony.title}`"
    class="flex flex-col justify-between h-full hover:cursor-pointer min-h-[300px] bg-white dark:bg-slate-800 border border-borderColor-light dark:border-borderColor-dark px-4 py-4 2xl:py-6 2xl:px-6 rounded-lg shadow hover:shadow-lg hover:ring-1 hover:ring-primary-light dark:hover:ring-primary-dark transition-all duration-150"
  >
    <!-- Top Content -->
    <div>
      <div class="flex justify-between items-start">
        <!-- User Info -->
        <div class="flex items-center gap-3 mb-3">
          <BaseAvatar
            :avatar_color="avatarColor"
            :name="name"
            :avatar_image="avatarImage"
          />

          <div class="flex flex-col">
            <span
              class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark capitalize"
            >
              {{ name }}
            </span>

            <span
              v-if="testimony.feed?.group"
              class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
            >
              Posted by {{ testimony.feed?.user?.full_name }}
            </span>

            <span
              class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
            >
              ✨ {{ testimonyCreatedAt }}
            </span>
          </div>
        </div>

        <TestimoniesOptions :testimony="testimony" />
      </div>

      <!-- Title -->
      <div class="mb-3">
        <h3
          class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark"
        >
          {{ testimony.title }}
        </h3>
      </div>

      <!-- Prayer Request Section -->
      <div v-if="testimony.prayer_request" class="mt-3">
        <button
          @click.stop="
            prayerStore.openPrayerRequest(testimony.prayer_request.id)
          "
          class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
        >
          <span class="text-base">🙏</span>
          <span>View Prayer Request</span>
        </button>
      </div>

      <!-- ✅ Content Preview with Show More -->
      <div
        class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-3"
      >
        <div
          v-html="showFullContent ? testimony.content : truncatedContent"
          class="prose prose-sm dark:prose-invert max-w-none"
        ></div>
        <button
          v-if="testimony.content.length > 300"
          @click.stop="showFullContent = !showFullContent"
          class="text-xs text-primary-light dark:text-primary-dark hover:underline mt-1"
        >
          {{ showFullContent ? "Show Less" : "Show More" }}
        </button>
      </div>

      <!-- Cover Image -->
      <div v-if="testimony.cover_image" class="mb-3">
        <img
          :src="testimony.cover_image"
          :alt="testimony.title"
          class="w-full h-48 object-cover rounded-lg"
        />
      </div>
    </div>

    <!-- ✅ Footer -->
    <div
      class="pt-2 border-t border-borderColor-light dark:border-borderColor-dark"
    >
      <div class="flex justify-between items-center text-sm mt-2">
        <!-- Actions -->
        <div class="flex items-center gap-4">
          <TestimoniesReactions
            :testimony="testimony"
            :useReaction="userReaction"
            :totalReactions="testimony.feed?.reaction_count || 0"
          />
          <button
            @click.prevent="openCommentDialog = true"
            class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1"
          >
            <div class="flex items-center gap-1">
              <span class="text-base">💬</span>
              <span class="text-xs"
                >({{ testimony.feed.comment_count || 0 }})</span
              >
            </div>
            <span class="text-xs">Comments</span>
          </button>

          <FeedsShares :item="testimony" />
        </div>

        <!-- Save -->
        <div>
          <button
            @click.prevent="onSave"
            class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1"
          >
            <span class="text-xs">Save</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
