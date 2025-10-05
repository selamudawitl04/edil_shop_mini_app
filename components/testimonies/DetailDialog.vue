<script setup>
import { formatDistanceToNow } from "date-fns";
import getTestimonyItem from "@/graphql/testimonies/item.gql";
import { useTestimonyStore } from "~/stores/testimony";
import { usePrayerStore } from "@/stores/prayer";

const prayerStore = usePrayerStore();
const testimonyStore = useTestimonyStore();
const user = useCookie("userData");

const testimony = ref(null);

const { onResult, onError, loading, refetch } = queryItem(getTestimonyItem, {
  id: testimonyStore.selectedTestimonyId,
  include_user: !!user.value,
  clientId: user.value ? "auth" : "default",
});

onResult(({ data }) => {
  if (data?.testimony_testimonies_by_pk) {
    testimony.value = data.testimony_testimonies_by_pk;
  } else {
    showError(
      createError({
        statusCode: 404,
        statusMessage: "Testimony Not Found",
        message: "The requested testimony does not exist.",
        fatal: true,
      })
    );
  }
});

onError((error) => {
  showError(
    createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
      message: "An error occurred while fetching the testimony.",
      fatal: true,
    })
  );
});

const testimonyCreatedAt = computed(() => {
  if (!testimony.value?.created_at) return "Unknown";
  const _createdAt = new Date(testimony.value.created_at);
  return formatDistanceToNow(_createdAt);
});

const avatarImage = computed(() => {
  if (testimony.value?.feed?.group) {
    return testimony.value.feed.group.profile_image;
  } else if (testimony.value?.feed?.page) {
    return testimony.value.feed.page.profile_image;
  } else if (testimony.value?.feed?.user) {
    return testimony.value.feed.user.profile_image;
  } else {
    return null;
  }
});

const avatarColor = computed(() => {
  if (testimony.value?.feed?.group) {
    return testimony.value.feed.group.avatar_color;
  } else if (testimony.value?.feed?.page) {
    return testimony.value.feed.page.avatar_color;
  } else if (testimony.value?.feed?.user) {
    return testimony.value.feed.user.avatar_color;
  } else {
    return null;
  }
});

const name = computed(() => {
  if (testimony.value?.feed?.group) {
    return testimony.value.feed.group.name;
  } else if (testimony.value?.feed?.page) {
    return testimony.value.feed.page.name;
  } else if (testimony.value?.feed?.user) {
    return testimony.value.feed.user.full_name;
  } else {
    return "Anonymous";
  }
});

const currentUser = computed(() => {
  return user.value;
});

const userReaction = computed(() => {
  return testimony.value?.feed?.feed_reactions?.find(
    (reaction) => reaction.user_id === user.value?.id
  );
});

const commentsRef = ref(null);

const comments = ref([]);
function onCommentFetched(data) {
  comments.value = data;
}
</script>

<template>
  <BaseDialog
    :open="testimonyStore.showTestimony"
    @close="testimonyStore.closeTestimony"
    :auto-close="false"
    :fullHeight="true"
    :title="testimony?.title || 'Testimony Detail'"
  >
    <template #content>
      <div class="flex flex-col">
        <!-- fixed height for dialog content -->
        <div
          class="flex-grow overflow-y-auto"
          :class="{
            ' pb-[5.5rem]': currentUser,
          }"
        >
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light dark:border-primary-dark"
            ></div>
          </div>

          <div v-else-if="testimony" class="space-y-3">
            <!-- Header -->
            <div class="flex items-start gap-4">
              <BaseAvatar
                :avatar_color="avatarColor"
                :name="name"
                :avatar_image="avatarImage"
              />

              <div class="flex-1">
                <h3
                  class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark"
                >
                  {{ name }}
                </h3>

                <p
                  class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >
                  ✨ {{ testimonyCreatedAt }}
                </p>

                <p
                  v-if="testimony.feed?.group"
                  class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >
                  Posted by {{ testimony.feed?.user?.full_name }}
                </p>
              </div>

              <TestimoniesOptions :testimony="testimony" />
            </div>

            <!-- Title -->
            <div class="">
              <h3
                class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark"
              >
                {{ testimony.title }}
              </h3>
            </div>

            <!-- Prayer Request Section -->
            <div
              v-if="testimony.prayer_request && !prayerStore.showPrayerRequest"
              class="mt-3"
            >
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

            <!-- Rich Text Editor    -->
            <div class="prose prose-sm max-w-none dark:prose-invert">
              <div
                class="whitespace-pre-wrap text-textSecondary-light dark:text-textSecondary-dark leading-relaxed"
              >
                <div v-html="testimony.content"></div>
              </div>
            </div>

            <!-- Cover Image -->
            <div v-if="testimony.cover_image" class="w-full">
              <img
                :src="testimony.cover_image"
                :alt="testimony.title"
                class="w-full max-h-96 object-cover rounded-lg"
              />
            </div>

            <!-- Footer Actions -->
            <div
              class="pt-2 border-t border-borderColor-light dark:border-borderColor-dark"
            >
              <div class="flex justify-between items-center text-sm mt-2">
                <div class="flex items-center gap-4">
                  <TestimoniesReactions
                    :testimony="testimony"
                    :useReaction="userReaction"
                    :totalReactions="testimony.feed.reaction_count"
                    @react="onReact"
                    @unreact="onUnReact"
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
                  <button
                    @click.prevent="onShare"
                    class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1"
                  >
                    <div class="flex items-center gap-1">
                      <span class="text-base">🔗</span>
                      <span class="text-xs"
                        >({{ testimony.feed.share_count || 0 }})</span
                      >
                    </div>
                    <span class="text-xs">Shares</span>
                  </button>
                </div>

                <div>
                  <button
                    @click.stop="onSave"
                    class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1"
                  >
                    <span class="text-xs">Save</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- ------------------------------Commment section ------------------------------ -->
            <Comments
              ref="commentsRef"
              :feed="testimony?.feed"
              @commentFetched="onCommentFetched"
            />
          </div>
        </div>

        <!-- Fixed comment input -->
        <div
          v-if="currentUser"
          class="sticky bottom-0 bg-white dark:bg-card-dark flex items-end gap-3"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0 self-end">
            <BaseAvatar
              :avatar_color="currentUser?.avatar_color"
              :name="currentUser?.full_name"
              :avatar_image="currentUser?.profile_image"
            />
          </div>

          <!-- Input -->
          <div class="flex-grow">
            <CommentsInput
              :feed="testimony?.feed"
              :previousComments="comments"
            />
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
