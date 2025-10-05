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
  prayerRequest: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const prayerRequestCreatedAt = computed(() => {
  const _createdAt = new Date(props.prayerRequest?.created_at);
  if (_createdAt) {
    return formatDistanceToNow(_createdAt);
  } else {
    return "UnKnown";
  }
});

const userReaction = computed(() => {
  return props.prayerRequest?.feed?.feed_reactions?.length > 0
    ? props.prayerRequest?.feed?.feed_reactions[0]
    : null;
});

const avatarImage = computed(() => {
  if (props.prayerRequest?.feed?.group) {
    return props.prayerRequest?.feed?.group?.profile_image;
  } else if (props.prayerRequest?.feed?.page) {
    return props.prayerRequest?.feed?.page?.profile_image;
  } else if (props.prayerRequest?.feed?.user) {
    return props.prayerRequest?.feed?.user?.profile_image;
  } else {
    return null;
  }
});

const avatarColor = computed(() => {
  if (props.prayerRequest?.feed?.group) {
    return props.prayerRequest?.feed?.group?.avatar_color;
  } else if (props.prayerRequest?.feed?.page) {
    return props.prayerRequest?.feed?.page?.avatar_color;
  } else if (props.prayerRequest?.feed?.user) {
    return props.prayerRequest?.feed?.user?.avatar_color;
  } else {
    return null;
  }
});

const name = computed(() => {
  if (props.prayerRequest?.feed?.group) {
    return props.prayerRequest?.feed?.group?.name;
  } else if (props.prayerRequest?.feed?.page) {
    return props.prayerRequest?.feed?.page?.name;
  } else if (props.prayerRequest?.feed?.user) {
    return props.prayerRequest?.feed?.user?.full_name;
  } else {
    return "Anonymous";
  }
});

const onReact = (reaction) => {
  if (userReaction.value) {
    userReaction.value.reaction_type = reaction.reaction_type;
  } else {
    props.prayerRequest.feed.feed_reactions.push(reaction);
    props.prayerRequest.feed.reaction_count++;
  }
};

const onUnReact = () => {
  if (userReaction.value) {
    props.prayerRequest.feed.feed_reactions = [];
    props.prayerRequest.feed.reaction_count--;
  }
};

const showFullOriginalPrayer = ref(false);
const showFullUpdate = ref(false);

const truncatedOriginalPrayer = computed(() => {
  return props.prayerRequest.description.length > 200
    ? props.prayerRequest.description.slice(0, 200) + "..."
    : props.prayerRequest.description;
});
const truncatedUpdate = computed(() => {
  return props.prayerRequest.updates[0].content.length > 200
    ? props.prayerRequest.updates[0].content.slice(0, 200) + "..."
    : props.prayerRequest.updates[0].content;
});

const toggleFullOriginalPrayer = () => {
  showFullOriginalPrayer.value = !showFullOriginalPrayer.value;
  if (props.prayerRequest?.description?.length < 200) {
    showDetailDialog();
  }
};

const toggleFullUpdate = () => {
  showFullUpdate.value = !showFullUpdate.value;
  if (props.prayerRequest?.updates[0]?.content?.length < 200) {
    showDetailDialog();
  }
};

const openAddToListDialog = ref(false);

function onShare() {
  shareStore.shareFeed(props.prayerRequest);
}

const showDetailDialog = () => {
  prayerStore.openPrayerRequest(props.prayerRequest.id);
};
</script>

<template>
  <PrayerAddToListDialog
    v-if="prayerRequest && openAddToListDialog"
    v-model="openAddToListDialog"
    :prayer-request-id="prayerRequest.id"
  />

  <div
    @click="showDetailDialog"
    :title="`Click to view details of: ${prayerRequest.title}`"
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
              v-if="prayerRequest.feed?.group"
              class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
            >
              Posted by {{ prayerRequest.feed?.user?.full_name }}
            </span>

            <span
              class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
            >
              📖 {{ prayerRequest.share_count }} people prayed,
              {{ prayerRequestCreatedAt }}
            </span>
          </div>
        </div>

        <PrayerOptions :prayerRequest="prayerRequest" />
      </div>

      <!-- ✅ Title -->
      <div class="">
        <h3
          class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark"
        >
          {{ prayerRequest.title }}
        </h3>

        <div v-if="prayerRequest?.for_who" class="mt-2">
          <span
            class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
          >
            <span class="text-sm">🙏</span>
            <span>For: {{ prayerRequest.for_who }}</span>
          </span>
        </div>
      </div>

      <!-- Testimony Section -->
      <div v-if="prayerRequest.testimony" class="mt-3">
        <button
          @click.stop="testimonyStore.openTestimony(prayerRequest.testimony.id)"
          class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
        >
          <span class="text-base">✨</span>
          <span>View Testimony</span>
        </button>
      </div>

      <!-- -----------Main content ------------ -->
      <div class="mb-2">
        <!-- ✅ Description Section -->
        <div class="mb-4">
          <!-- ✅ Case: Show Update if exists -->
          <div
            v-if="prayerRequest.updates?.length"
            @click.stop="toggleFullUpdate"
          >
            <p
              class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
            >
              <span
                v-if="prayerRequest.status == 'answered'"
                class="text-xs text-primary-light dark:text-primary-dark"
              >
                Answered:
              </span>

              <span class="text-xs text-primary-light dark:text-primary-dark">
                #{{ prayerRequest.updates[0].update_order }} Update:
              </span>
              {{
                showFullUpdate
                  ? prayerRequest.updates[0].content
                  : truncatedUpdate
              }}

              <button
                v-if="prayerRequest.updates[0].content.length > 200"
                @click.stop="showFullUpdate = !showFullUpdate"
                class="text-xs font-medium text-primary-light dark:text-primary-dark hover:underline"
              >
                <!-- Read more or read less -->
                {{ showFullUpdate ? "Read less" : "Read more" }}
              </button>
            </p>

            <!-- ---Show all updates -->
            <button
              v-if="prayerRequest.updates.length > 1"
              @click.stop="showDetailDialog"
              class="text-xs font-medium text-primary-light dark:text-primary-dark hover:underline"
            >
              See all {{ prayerRequest.updates.length }} updates
            </button>
          </div>

          <!-- ✅ Case: Show Original Description if no updates -->
          <div v-else>
            <p
              class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
            >
              {{
                showFullOriginalPrayer
                  ? prayerRequest.description
                  : truncatedOriginalPrayer
              }}

              <button
                v-if="prayerRequest.description.length > 200"
                @click.stop="showFullOriginalPrayer = !showFullOriginalPrayer"
                class="text-xs font-medium text-primary-light dark:text-primary-dark hover:underline"
              >
                {{ showFullOriginalPrayer ? "Read less" : "Read more" }}
              </button>
            </p>
          </div>
        </div>

        <!-- ✅ Original Prayer Section (only if updates exist) -->
        <div
          v-if="prayerRequest.updates?.length"
          @click.stop="toggleFullOriginalPrayer"
        >
          <p
            class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
          >
            <span class="text-xs text-black dark:text-white">
              Original Prayer:
            </span>
            {{
              showFullOriginalPrayer
                ? prayerRequest.description
                : truncatedOriginalPrayer
            }}

            <button
              v-if="prayerRequest.description.length > 200"
              @click.stop="showFullOriginalPrayer = !showFullOriginalPrayer"
              class="text-xs font-medium text-primary-light dark:text-primary-dark hover:underline"
            >
              {{ showFullOriginalPrayer ? "Read less" : "Read more" }}
            </button>
          </p>
        </div>
      </div>

      <!-- --------------Media section -->
      <div v-if="prayerRequest.photo_url" class="mb-3">
        <img
          :src="prayerRequest.photo_url"
          :alt="prayerRequest.title"
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
            :prayerRequest="prayerRequest"
            :useReaction="userReaction"
            :totalReactions="prayerRequest.feed.reaction_count"
            @react="onReact"
            @unreact="onUnReact"
          />

          <button
            @click.prevent="showDetailDialog"
            class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1"
          >
            <div class="flex items-center gap-1">
              <span class="text-base">💬</span>
              <span class="text-xs"
                >({{ prayerRequest.feed.comment_count || 0 }})</span
              >
            </div>
            <span class="text-xs">Comments</span>
          </button>
          <FeedsShares :item="prayerRequest" />
        </div>

        <!-- ✅ Pray for request -->

        <div class="flex flex-col items-start gap-1">
          <button
            @click.stop="openAddToListDialog = true"
            class="text-primary-light dark:text-primary-dark hover:underline"
          >
            Save Prayer
          </button>
          <PrayerIPrayed :prayerRequest="prayerRequest" />
        </div>
      </div>
    </div>
  </div>
</template>
