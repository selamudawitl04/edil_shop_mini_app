<script setup>
import getPrayerRequestQuery from "@/graphql/prayers/request_item.gql";
import { formatDistanceToNow } from "date-fns";

const route = useRoute();
const prayerRequest = ref();
const openUpdatePrayerDialog = ref(false);

const { onResult, onError, refetch } = queryItem(getPrayerRequestQuery, {
  id: route.params.id,
});

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

provide("refechPrayerRequest", refetch);

const prayerRequestCreatedAt = computed(() => {
  const _createdAt = new Date(prayerRequest.value?.created_at);
  return _createdAt ? formatDistanceToNow(_createdAt) : "UnKnown";
});

const openDeletePrayerRequestDialog = ref(false);
const openMarkPrayerRequestAsAnsweredDialog = ref(false);
const openMarkPrayerRequestAsClosedDialog = ref(false);
const openReOpenPrayerRequestDialog = ref(false);

const tabs = ref([
  {
    name: "Comments",
    value: "comments",
  },

  {
    name: "Updates",
    value: "updates",
  },
]);

const currentTabIndex = ref(0);
</script>

<template>
  <PrayerUpdatePrayerRequestDialog
    v-if="prayerRequest && openUpdatePrayerDialog"
    v-model="openUpdatePrayerDialog"
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

  <NuxtLayout>
    <section
      v-if="prayerRequest"
      class="bg-background-light dark:bg-background-dark min-h-screen py-28 px-6 lg:px-32"
    >
      <div class="max-w-5xl mx-auto flex flex-col gap-4 lg:gap-8 2xl:gap-12">
        <!-- Main Content -->
        <div>
          <div class="mb-6 flex justify-between items-start">
            <!-- Header With Avatar & Name -->
            <div class="mb-4 flex items-center gap-4">
              <!-- Avatar or Fallback -->
              <div>
                <img
                  v-if="prayerRequest.photo_url"
                  :src="prayerRequest.photo_url"
                  alt="Avatar"
                  class="w-20 h-20 object-cover rounded-md border border-slate-300 dark:border-slate-600"
                />
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-20 h-20 rounded-md bg-slate-200 dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>

              <!-- Who and Meta -->
              <div class="flex-1">
                <div
                  class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark capitalize"
                >
                  {{ prayerRequest.for_who || "Anonymous" }}
                </div>
                <div
                  class="text-xs text-textSecondary-light dark:text-textSecondary-dark mt-1"
                >
                  🙏
                  {{}} prayed ·
                  {{ prayerRequestCreatedAt }}
                </div>

                <!-- 👇 Insert status badge here -->
                <div
                  class="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 capitalize"
                  :class="{
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100':
                      prayerRequest.status === 'pending',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100':
                      prayerRequest.status === 'answered',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100':
                      prayerRequest.status === 'closed',
                  }"
                >
                  {{
                    prayerRequest.status == "pending"
                      ? "open"
                      : prayerRequest.status
                  }}
                </div>

                <!-- Category -->
                <div
                  v-if="prayerRequest.prayer_category"
                  class="inline-block text-xs mt-2 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  {{ prayerRequest.prayer_category }}
                </div>
              </div>
            </div>

            <HeadlessPopover class="relative inline-block text-left">
              <HeadlessPopoverButton
                class="p-2 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition"
              >
                <Icon
                  name="mi:options-vertical"
                  size="22"
                  class="text-textPrimary-light dark:text-textPrimary-dark"
                />
              </HeadlessPopoverButton>

              <HeadlessPopoverPanel
                class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50"
              >
                <div
                  class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark"
                >
                  <!-- Update -->
                  <button
                    @click="openUpdatePrayerDialog = true"
                    class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
                  >
                    <Icon name="mdi:file-edit-outline" class="w-4 h-4" />
                    Edit Prayer Request
                  </button>

                  <!-- Show only if status is 'pending' -->
                  <template v-if="prayerRequest.status === 'pending'">
                    <button
                      @click="openMarkPrayerRequestAsAnsweredDialog = true"
                      class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
                    >
                      <Icon
                        name="mdi:check-circle-outline"
                        class="w-4 h-4 text-success-light dark:text-success-dark"
                      />
                      Mark as Answered
                    </button>

                    <button
                      @click="openMarkPrayerRequestAsClosedDialog = true"
                      class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
                    >
                      <Icon
                        name="mdi:close-circle-outline"
                        class="w-4 h-4 text-warning-light dark:text-warning-dark"
                      />
                      Mark as Closed
                    </button>
                  </template>

                  <!-- Show only if status is 'answered' or 'closed' -->
                  <template
                    v-if="
                      prayerRequest.status === 'answered' ||
                      prayerRequest.status === 'closed'
                    "
                  >
                    <button
                      @click="openReOpenPrayerRequestDialog = true"
                      class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
                    >
                      <Icon
                        name="mdi:refresh"
                        class="w-4 h-4 text-primary-light dark:text-primary-dark"
                      />
                      Reopen Prayer
                    </button>
                  </template>

                  <!-- Delete -->
                  <button
                    @click="openDeletePrayerRequestDialog = true"
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md"
                  >
                    <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                    Delete Request
                  </button>
                </div>
              </HeadlessPopoverPanel>
            </HeadlessPopover>
          </div>

          <!-- Title -->
          <h1
            class="text-2xl font-semibold mb-4 text-textPrimary-light dark:text-textPrimary-dark"
          >
            {{ prayerRequest.title }}
          </h1>

          <!-- Description -->
          <p
            class="text-base text-textSecondary-light dark:text-textSecondary-dark mb-6"
          >
            {{ prayerRequest.description }}
          </p>

          <!-- Media: Audio -->
          <div
            v-if="prayerRequest.medias?.find((m) => m.type === 'audio')"
            class="mb-6"
          >
            <h4 class="text-lg font-semibold mb-2">🎧 Audio Message</h4>
            <audio
              :src="prayerRequest.medias.find((m) => m.type === 'audio')?.url"
              controls
              class="w-full rounded"
            />
          </div>

          <!-- Media: Audio -->
          <div
            v-if="
              prayerRequest.medias?.some((m) => $mediaUtils.isAudioUrl(m.url))
            "
            class="mb-6"
          >
            <h4 class="text-lg font-semibold mb-2">🎧 Audio Message</h4>
            <audio
              :src="
                prayerRequest.medias.find((m) => $mediaUtils.isAudioUrl(m.url))
                  ?.url
              "
              controls
              class="w-full rounded"
            />
          </div>

          <!-- Media: Images -->
          <div
            v-if="
              prayerRequest.medias?.some((m) => $mediaUtils.isImageUrl(m.url))
            "
            class="mb-8"
          >
            <h4 class="text-lg font-semibold mb-3">🖼️ Images</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

        <!-- ---------Comment one Update Section------- -->

        <BaseTab
          id="commentAndUpdate"
          :tabs="tabs"
          v-model:current-tab-index="currentTabIndex"
        >
          <template #comments>
            <!-- Comments Section  -->
            <div>
              <Comments :prayer-request="prayerRequest" />
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
        </BaseTab>
      </div>
    </section>
  </NuxtLayout>
</template>
