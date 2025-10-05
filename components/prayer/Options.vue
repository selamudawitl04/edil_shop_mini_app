<script setup>
import { usePrayerStore } from "@/stores/prayer";
import { useTestimonyStore } from "@/stores/testimony";

const testimonyStore = useTestimonyStore();

const prayerStore = usePrayerStore();

const props = defineProps({
  prayerRequest: {
    type: Object,
    required: true,
  },
});

const user = useCookie("userData");
const openUpdatePrayerRequestDialog = ref(false);
const openDeletePrayerRequestDialog = ref(false);
const openMarkPrayerRequestAsAnsweredDialog = ref(false);
const openMarkPrayerRequestAsClosedDialog = ref(false);
const openReOpenPrayerRequestDialog = ref(false);
const openUpdateVisibilityDialog = ref(false);
const openCreateNewTestimonyDialog = ref(false);

/**-----------------------------Save Prayer Request--- */

const openAddToListDialog = ref(false);

const isUserOwner = computed(() => {
  return (
    props.prayerRequest?.feed?.created_by == user.value?.id ||
    prayerStore.prayerEditToken
  );
});

const canDeletePrayerRequest = computed(() => {
  let isPageAdmin = props.prayerRequest?.feed?.page?.page_admins?.length > 0;
  let groupAdmin = props.prayerRequest?.feed?.group?.group_members?.find(
    (member) => member.role != "group:member"
  );
  return isUserOwner.value || isPageAdmin || groupAdmin;
});

// community id, community type, role

const ownerInfo = computed(() => {
  const feed = props.prayerRequest?.feed;
  const userId = user.value?.id;

  // Community details
  const communityId = feed.page?.id || feed.group?.id || null;
  const communityType = feed.page ? "page" : feed.group ? "group" : null;

  // Role resolution
  let role = null;

  if (feed.page?.page_admins?.[0]?.role) {
    role = feed.page.page_admins[0].role;
  } else if (feed.group?.group_members?.[0]?.role) {
    role = feed.group.group_members[0].role;
  } else if (feed.created_by === userId) {
    role = "user";
  }

  return {
    communityId,
    communityType,
    role,
  };
});

const createTestimony = () => {
  testimonyStore.openCreate({
    prayerRequestId: props.prayerRequest.id,
    communityId: ownerInfo.value.communityId,
    communityType: ownerInfo.value.communityType,
    role: ownerInfo.value.role,
    isPrivateGroup: ownerInfo.value.isPrivateGroup,
  });
};
</script>

<template>
  <PrayerAddToListDialog
    v-if="prayerRequest && openAddToListDialog"
    v-model="openAddToListDialog"
    :prayer-request-id="prayerRequest.id"
  />

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
    v-if="prayerRequest && openMarkPrayerRequestAsClosedDialog"
    v-model="openMarkPrayerRequestAsClosedDialog"
    :prayer-request="prayerRequest"
  />

  <PrayerMarkPrayerRequestAsAnswered
    v-if="prayerRequest && openMarkPrayerRequestAsAnsweredDialog"
    v-model="openMarkPrayerRequestAsAnsweredDialog"
    :prayer-request="prayerRequest"
  />

  <PrayerReOpenPrayerRequest
    v-if="prayerRequest && openReOpenPrayerRequestDialog"
    v-model="openReOpenPrayerRequestDialog"
    :prayer-request="prayerRequest"
  />

  <FeedsChangeFeedVisibilityDialog
    v-if="prayerRequest && openUpdateVisibilityDialog"
    v-model="openUpdateVisibilityDialog"
    :feed="prayerRequest.feed"
  />

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
        <!-- Add to list -->
        <button
          v-if="user"
          @click.stop="openAddToListDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
        >
          <Icon name="mdi:file-edit-outline" class="w-4 h-4" />
          Add To Your List
        </button>
        <!-- Update -->
        <button
          v-if="isUserOwner"
          @click.stop="openUpdatePrayerRequestDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
        >
          <Icon name="mdi:file-edit-outline" class="w-4 h-4" />
          Edit Prayer Request
        </button>

        <!-- Update Visibility -->
        <button
          v-if="isUserOwner && prayerRequest.feed?.group?.is_private"
          @click.stop="openUpdateVisibilityDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
        >
          <Icon name="mdi:eye-outline" class="w-4 h-4" />
          Update Visibility
        </button>

        <!-- ---------------Convert to testimony -->
        <button
          v-if="isUserOwner"
          @click.stop="createTestimony"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
        >
          <Icon name="mdi:file-edit-outline" class="w-4 h-4" />
          Convert to Testimony
        </button>

        <!-- Show only if status is 'pending' -->
        <template v-if="prayerRequest.status === 'pending'">
          <button
            v-if="isUserOwner"
            @click.stop="openMarkPrayerRequestAsAnsweredDialog = true"
            class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
          >
            <Icon
              name="mdi:check-circle-outline"
              class="w-4 h-4 text-success-light dark:text-success-dark"
            />
            Mark as Answered
          </button>
          <button
            v-if="isUserOwner"
            @click.stop="openMarkPrayerRequestAsClosedDialog = true"
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
            v-if="isUserOwner"
            @click.stop="openReOpenPrayerRequestDialog = true"
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
          v-if="canDeletePrayerRequest"
          @click.stop="openDeletePrayerRequestDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md"
        >
          <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
          Delete Request
        </button>

        <!-- Report -->
        <button
          @click.stop="openReportDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
        >
          <Icon name="mdi:flag-outline" class="w-4 h-4" />
          Report Prayer
        </button>
      </div>
    </HeadlessPopoverPanel>
  </HeadlessPopover>
</template>
