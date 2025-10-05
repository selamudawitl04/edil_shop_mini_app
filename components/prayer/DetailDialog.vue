<script setup>
import getPrayerRequestQuery from "@/graphql/prayers/request_item.gql";

import { formatDistanceToNow } from "date-fns";
const emit = defineEmits(["update:modelValue"]);
import { usePrayerStore } from "~/stores/prayer";
import { useTestimonyStore } from "@/stores/testimony";

const testimonyStore = useTestimonyStore();

const prayerStore = usePrayerStore();

const props = defineProps({
  modelValue: Boolean,
});
const user = useCookie("userData");

const open = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val);
    if (!val) {
      prayerStore.closePrayerRequest();
    }
  },
});

const prayerRequest = ref();
const { onResult, onError, refetch, loading } = queryItem(
  getPrayerRequestQuery,
  {
    id: prayerStore.prayerRequestId,
    include_user: !!user.value,
    clientId: prayerStore.prayerEditToken || !user.value ? "default" : "auth",
  }
);
const commentsRef = ref(null);

onResult(({ data }) => {
  if (data?.prayer_requests_by_pk) {
    prayerRequest.value = data.prayer_requests_by_pk;
  } else {
    showError(
      createError({
        statusCode: 404,
        statusMessage: "Prayer Request Not Found",
        message: "We couldn't find the prayer request you’re looking for.",
        fatal: true,
      })
    );
  }
});

onError(() => {
  // 500 — Internal Server Error
  showError(
    createError({
      statusCode: 500,
      statusMessage: "Failed to Fetch Prayer Request",
      message:
        "An unexpected error occurred while fetching the prayer request.",
      fatal: true,
    })
  );
});

provide("refetchPrayerRequest", refetch);

const showFullOriginalPrayer = ref(false);
const showFullUpdate = ref(false);

const truncatedOriginalPrayer = computed(() => {
  return prayerRequest.value.description.length > 200
    ? prayerRequest.value.description.slice(0, 200) + "..."
    : prayerRequest.value.description;
});
const truncatedUpdate = computed(() => {
  return prayerRequest.value.updates[0].content.length > 200
    ? prayerRequest.value.updates[0].content.slice(0, 200) + "..."
    : prayerRequest.value.updates[0].content;
});

const prayerRequestCreatedAt = computed(() => {
  const _createdAt = new Date(prayerRequest.value?.created_at);
  return _createdAt ? formatDistanceToNow(_createdAt) : "UnKnown";
});

const tabs = ref([
  {
    name: "Comments",
    value: "comments",
  },

  {
    name: "Updates",
    value: "updates",
  },
  {
    name: "Medias",
    value: "medias",
  },
]);

const currentUser = computed(() => {
  return user.value;
});

const currentTabIndex = ref(0);

const userReaction = computed(() => {
  return prayerRequest.value?.feed?.feed_reactions?.length > 0
    ? prayerRequest.value?.feed?.feed_reactions[0]
    : null;
});

const avatarImage = computed(() => {
  if (prayerRequest.value?.feed?.group) {
    return prayerRequest.value?.feed?.group?.profile_image;
  } else if (prayerRequest.value?.feed?.page) {
    return prayerRequest.value?.feed?.page?.profile_image;
  } else if (prayerRequest.value?.feed?.user) {
    return prayerRequest.value?.feed?.user?.profile_image;
  } else {
    return null;
  }
});

const avatarColor = computed(() => {
  if (prayerRequest.value?.feed?.group) {
    return prayerRequest.value?.feed?.group?.avatar_color;
  } else if (prayerRequest.value?.feed?.page) {
    return prayerRequest.value?.feed?.page?.avatar_color;
  } else if (prayerRequest.value?.feed?.user) {
    return prayerRequest.value?.feed?.user?.avatar_color;
  } else {
    return null;
  }
});

const name = computed(() => {
  if (prayerRequest.value?.feed?.group) {
    return prayerRequest.value?.feed?.group?.name;
  } else if (prayerRequest.value?.feed?.page) {
    return prayerRequest.value?.feed?.page?.name;
  } else if (prayerRequest.value?.feed?.user) {
    return prayerRequest.value?.feed?.user?.full_name;
  } else {
    return "Anonymous";
  }
});

const onReact = (reaction) => {
  if (userReaction.value) {
    userReaction.value.reaction_type = reaction.reaction_type;
  } else {
    prayerRequest.value.feed.feed_reactions.push(reaction);
    prayerRequest.value.feed.reaction_count++;
  }
};

const onUnReact = () => {
  if (userReaction.value) {
    prayerRequest.value.feed.feed_reactions = [];
    prayerRequest.value.feed.reaction_count--;
  }
};

const openAddToListDialog = ref(false);
</script>

<template>
  <!-- ----------------Update prayer request---------- -->
  <PrayerUpdatePrayerRequestDialog
    v-if="prayerRequest && openUpdatePrayerRequestDialog"
    v-model="openUpdatePrayerRequestDialog"
    :prayer-request="prayerRequest"
  />

  <PrayerDeletePrayerRequest
    v-if="prayerRequest && openDeletePrayerRequestDialog"
    v-model="openDeletePrayerRequestDialog"
    :prayer-request="prayerRequest"
  />

  <PrayerMarkPrayerRequestAsClosed
    v-if="prayerRequest"
    v-model="openMarkPrayerRequestAsClosedDialog"
    :prayer-request="prayerRequest"
  />

  <PrayerMarkPrayerRequestAsAnswered
    v-if="prayerRequest"
    v-model="openMarkPrayerRequestAsAnsweredDialog"
    :prayer-request="prayerRequest"
  />

  <PrayerReOpenPrayerRequest
    v-if="prayerRequest"
    v-model="openReOpenPrayerRequestDialog"
    :prayer-request="prayerRequest"
  />

  <PrayerAddToListDialog
    v-if="prayerRequest && openAddToListDialog"
    v-model="openAddToListDialog"
    :prayer-request-id="prayerRequest.id"
  />

  <BaseDialog
    v-model="open"
    :title="prayerRequest?.title || 'Prayer Request Details'"
    :loading="loading"
    :auto-close="false"
  >
    <template #content>
      <div class="flex flex-col w-full max-w-full">
        <!-- fixed height for dialog content -->

        <div
          class="flex-grow overflow-y-auto"
          :class="{
            ' pb-[5.5rem]': currentUser,
          }"
        >
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
            <div
              v-if="prayerRequest.testimony && !testimonyStore.showTestimony"
              class="mt-2"
            >
              <button
                @click.stop="
                  testimonyStore.openTestimony(prayerRequest.testimony.id)
                "
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
                  @click.stop="showFullUpdate = !showFullUpdate"
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

                    <span
                      class="text-xs text-primary-light dark:text-primary-dark"
                    >
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
                    @click.stop="currentTabIndex = 1"
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
                      @click.stop="
                        showFullOriginalPrayer = !showFullOriginalPrayer
                      "
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
                @click.stop="showFullOriginalPrayer = !showFullOriginalPrayer"
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
                    @click.stop="
                      showFullOriginalPrayer = !showFullOriginalPrayer
                    "
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
            class="pt-2 mt-4 border-t border-borderColor-light dark:border-borderColor-dark"
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
                  @click.prevent="currentTabIndex = 0"
                  class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1"
                >
                  <div class="flex items-center gap-1">
                    <span class="text-base">💬</span>
                    <span class="text-xs"
                      >({{ prayerRequest.comment_count || 0 }})</span
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

          <div>
            <template v-if="currentTabIndex == 0">
              <!-- Comments Section  -->
              <div>
                <Comments ref="commentsRef" :feed="prayerRequest" />
              </div>
            </template>

            <!-- Updates Section  -->

            <template v-if="currentTabIndex == 1">
              <div>
                <PrayerUpdates
                  :prayer-request="prayerRequest"
                  is-my-prayer-request
                />
              </div>
            </template>
          </div>

          <!-- ---------Comment one Update Section------- -->

          <BaseTab
            v-if="false"
            id="commentAndUpdate"
            :tabs="tabs"
            v-model:current-tab-index="currentTabIndex"
          >
            <template #comments>
              <!-- Comments Section  -->
              <div>
                <Comments ref="commentsRef" :feed="prayerRequest.feed" />

                <!-- <PagesRequestsComments :prayer-request="prayerRequest" :my-role-for-group="" /> -->
              </div>
            </template>

            <!-- Updates Section  -->

            <template #updates>
              <div>
                <PrayerUpdates
                  :prayer-request="prayerRequest"
                  is-my-prayer-request
                />
              </div>
            </template>

            <template #medias>
              <div class="mt-4">
                <!-- Media: Audio -->
                <div
                  v-if="prayerRequest.medias?.find((m) => m.type === 'audio')"
                  class="mb-6"
                >
                  <h4 class="text-lg font-semibold mb-2">🎧 Audio Message</h4>
                  <audio
                    :src="
                      prayerRequest.medias.find((m) => m.type === 'audio')?.url
                    "
                    controls
                    class="w-full rounded"
                  />
                </div>

                <!-- Media: Audio -->
                <div
                  v-if="
                    prayerRequest.medias?.some((m) =>
                      $mediaUtils.isAudioUrl(m.url)
                    )
                  "
                  class="mb-6"
                >
                  <h4 class="text-lg font-semibold mb-2">🎧 Audio Message</h4>
                  <audio
                    :src="
                      prayerRequest.medias.find((m) =>
                        $mediaUtils.isAudioUrl(m.url)
                      )?.url
                    "
                    controls
                    class="w-full rounded"
                  />
                </div>

                <!-- Media: Images -->
                <div
                  v-if="
                    prayerRequest.medias?.some((m) =>
                      $mediaUtils.isImageUrl(m.url)
                    )
                  "
                  class="mb-8"
                >
                  <h4 class="text-lg font-semibold mb-3">🖼️ Images</h4>
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    <img
                      v-for="(img, idx) in prayerRequest.medias.filter((m) =>
                        $mediaUtils.isImageUrl(m.url)
                      )"
                      :key="idx"
                      :src="img.url"
                      class="rounded-md shadow object-cover w-full h-48"
                      :alt="`Image ${idx + 1}`"
                    />
                  </div>
                </div>
              </div>
            </template>
          </BaseTab>
        </div>

        <!-- Fixed comment input at bottom -->
        <div
          v-if="currentUser && currentTabIndex == 0"
          class="bg-white dark:bg-card-dark flex items-end gap-3 sticky bottom-0 overflow-hidden"
        >
          <!-- Avatar aligned bottom, small fixed width -->
          <div class="flex-shrink-0 self-end">
            <BaseAvatar
              :avatar_color="currentUser?.avatar_color"
              :name="currentUser?.full_name"
              :avatar_image="currentUser?.profile_image"
            />
          </div>

          <!-- Comment Input fills remaining width -->
          <div class="">
            <CommentsInput
              :feed="prayerRequest.feed"
              @submitted="commentsRef.refetch()"
            />
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
