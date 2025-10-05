<script setup>
import { formatDistanceToNow } from "date-fns";
import { usePrayerStore } from "@/stores/prayer";
import { useTestimonyStore } from "@/stores/testimony";
import { useShareStore } from "@/stores/share";
const prayerStore = usePrayerStore();
const shareStore = useShareStore();
const testimonyStore = useTestimonyStore();
const user = useCookie("userData");
const emits = defineEmits(["openDetail"]);
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const eventCreatedAt = computed(() => {
  const _createdAt = new Date(props.event?.created_at);
  if (_createdAt) {
    return formatDistanceToNow(_createdAt);
  } else {
    return "UnKnown";
  }
});

const userReaction = computed(() => {
  return props.event?.feed?.feed_reactions?.length > 0
    ? props.event?.feed?.feed_reactions[0]
    : null;
});

const avatarImage = computed(() => {
  if (props.event?.feed?.group) {
    return props.event?.feed?.group?.profile_image;
  } else if (props.event?.feed?.page) {
    return props.event?.feed?.page?.profile_image;
  } else {
    return null;
  }
});

const avatarColor = computed(() => {
  if (props.event?.feed?.group) {
    return props.event?.feed?.group?.avatar_color;
  } else if (props.event?.feed?.page) {
    return props.event?.feed?.page?.avatar_color;
  } else {
    return null;
  }
});

const name = computed(() => {
  if (props.event?.feed?.group) {
    return props.event?.feed?.group?.name;
  } else if (props.event?.feed?.page) {
    return props.event?.feed?.page?.name;
  } else {
    return "Unknown";
  }
});

const onReact = (reaction) => {
  if (userReaction.value) {
    userReaction.value.reaction_type = reaction.reaction_type;
  } else {
    props.event.feed.feed_reactions.push(reaction);
    props.event.feed.reaction_count++;
  }
};

const onUnReact = () => {
  if (userReaction.value) {
    props.event.feed.feed_reactions = [];
    props.event.feed.reaction_count--;
  }
};

const showFullDescription = ref(false);
const showFullUpdate = ref(false);

const truncatedDescription = computed(() => {
  return props.event.description.length > 200
    ? props.event.description.slice(0, 200) + "..."
    : props.event.description;
});
const truncatedUpdate = computed(() => {
  return props.event.updates[0].content.length > 200
    ? props.event.updates[0].content.slice(0, 200) + "..."
    : props.event.updates[0].content;
});

const toggleFullOriginalPrayer = () => {
  showFullDescription.value = !showFullDescription.value;
  if (props.event?.description?.length < 200) {
    showDetailDialog();
  }
};

const toggleFullUpdate = () => {
  showFullUpdate.value = !showFullUpdate.value;
  if (props.event?.updates[0]?.content?.length < 200) {
    showDetailDialog();
  }
};

const openAddToListDialog = ref(false);

function onShare() {
  shareStore.shareFeed(props.event);
}

const showDetailDialog = () => {
  prayerStore.openEvent(props.event.id);
};
</script>

<template>
  <div
    @click="showDetailDialog"
    :title="`Click to view details of: ${event.title}`"
    class="flex flex-col justify-between h-full hover:cursor-pointer min-h-[300px] bg-white dark:bg-slate-800 border border-borderColor-light dark:border-borderColor-dark px-4 py-4 2xl:py-6 2xl:px-6 rounded-lg shadow hover:shadow-lg hover:ring-1 hover:ring-primary-light dark:hover:ring-primary-dark transition-all duration-150"
  >
    <!-- Top Content -->
    <div>
      <div class="flex justify-between items-start">
        <!-- ✅ User Info -->
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
              class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
            >
              📖 {{ event.share_count }} people prayed,
              {{ eventCreatedAt }}
            </span>
          </div>
        </div>

        <EventsOptions :event="event" />
      </div>

      <!-- ✅ Title -->
      <div class="">
        <h3
          class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark"
        >
          {{ event.title }}
        </h3>
      </div>

      <!-- -----------Main content ------------ -->
      <div class="mb-2">
        <!-- ✅ Description Section -->
        <div class="mb-4">
          <div>
            <p
              class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
            >
              {{
                showFullDescription ? event.description : truncatedDescription
              }}

              <button
                v-if="event.description.length > 200"
                @click.stop="showFullDescription = !showFullDescription"
                class="text-xs font-medium text-primary-light dark:text-primary-dark hover:underline"
              >
                {{ showFullDescription ? "Read less" : "Read more" }}
              </button>
            </p>
          </div>
        </div>
      </div>

      <!-- --------------Media section -->
      <div v-if="event.banner_url" class="mb-3">
        <img
          :src="event.banner_url"
          :alt="event.title"
          class="w-full h-auto max-h-72 object-cover rounded-lg border border-borderColor-light dark:border-borderColor-dark"
        />
      </div>
    </div>

    <!-- ✅ Footer -->
    <div
      class="pt-2 border-t border-borderColor-light dark:border-borderColor-dark"
    >
      <div class="flex justify-between items-center text-sm mt-1">
        <div class="flex items-center gap-4">
          <PrayerReactions
            :prayerRequest="event"
            :useReaction="userReaction"
            :totalReactions="event.feed.reaction_count"
            @react="onReact"
            @unreact="onUnReact"
          />

          <button
            @click.prevent="showDetailDialog"
            class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1"
          >
            <div class="flex items-center gap-1">
              <span class="text-base">💬</span>
              <span class="text-xs">({{ event.feed.comment_count || 0 }})</span>
            </div>
            <span class="text-xs">Comments</span>
          </button>
          <FeedsShares :item="event" />
        </div>

        <!-- ✅ Pray for request -->
        <!-- 
        <div class="flex flex-col items-start gap-1">
          <button
            @click.stop="openAddToListDialog = true"
            class="text-primary-light dark:text-primary-dark hover:underline"
          >
            Save Prayer
          </button>
          <PrayerIPrayed :prayerRequest="prayerRequest" />
        </div> -->
      </div>
    </div>
  </div>
</template>
