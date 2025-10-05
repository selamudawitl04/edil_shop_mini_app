<template>
  <!-- ----------Revoke Admin Role-------- -->
  <GroupsAcceptInvitationDialog
    v-if="openAcceptInvitationDialog"
    v-model="openAcceptInvitationDialog"
    :group-member="myRoleForGroup"
  />

  <GroupsLeaveGroupDialog
    v-if="openLeaveGroupDialog"
    v-model="openLeaveGroupDialog"
    :group-member="myRoleForGroup"
    :my-role-for-group="myRoleForGroup"
  />

  <GroupsDeclineInvitationDialog
    v-if="openDeclineInvitationDialog"
    v-model="openDeclineInvitationDialog"
    :group-member="myRoleForGroup"
  />

  <GroupsEditGroupDialog
    v-if="openEditGroupDialog && group"
    v-model="openEditGroupDialog"
    :group="group"
    :my-role-for-group="myRoleForGroup"
  />

  <GroupsDeleteGroupDialog
    v-if="openDeleteGroupDialog && group"
    v-model="openDeleteGroupDialog"
    :group="group"
  />

  <div class="flex flex-col">
    <!-- ✅ Back Button on Mobile -->
    <BaseBackHeader :title="group?.name || 'Group Detail'" />

    <div
      v-if="group && !loading"
      class="text-textPrimary-light dark:text-textPrimary-dark"
    >
      <!-- Cover Image Section -->
      <div
        @click.stop="handleCoverImageClick"
        class="relative w-full h-48 md:h-64 lg:h-80 bg-gradient-to-br from-primary-light/20 to-primary-dark/20 dark:from-primary-dark/20 dark:to-primary-light/20 hover:cursor-pointer"
      >
        <!-- Cover Image -->
        <img
          v-if="group.cover_image"
          :src="group.cover_image"
          :alt="group.name"
          class="w-full h-full object-cover"
        />

        <!-- Fallback Background -->
        <div v-else class="w-full h-full flex items-center justify-center">
          <div class="text-center">
            <Icon
              name="mdi:account-group"
              size="64"
              class="text-primary-light/50 dark:text-primary-dark/50 mx-auto mb-2"
            />
            <p
              class="text-primary-light/70 dark:text-primary-dark/70 text-sm font-medium"
            >
              {{ group.name }}
            </p>
          </div>
        </div>

        <!-- Update Cover Image -->
        <div
          v-if="
            myRoleForGroup?.status == 'approved' &&
            myRoleForGroup?.role != 'group:member'
          "
          class="absolute bottom-2 right-4 md:right-8 transform translate-y-1/2 hover:cursor-pointer"
        >
          <div class="relative inline-block">
            <GroupsUpdateCoverImage
              ref="coverImageUploaderWrapper"
              :group="group"
              :my-role-for-group="myRoleForGroup"
            />
          </div>
        </div>

        <!-- Circular Profile Image with absolute edit icon -->
        <div
          class="absolute bottom-0 left-4 md:left-8 transform translate-y-1/2 hover:cursor-pointer"
          @click.stop="handleProfileImageClick"
        >
          <div class="relative inline-block">
            <GroupsUpdateProfileImage
              ref="profileImageUploaderWrapper"
              v-if="
                myRoleForGroup?.status == 'approved' &&
                myRoleForGroup?.role != 'group:member'
              "
              :group="group"
              :my-role-for-group="myRoleForGroup"
            />
            <BaseAvatar
              :avatar_image="group.profile_image"
              :avatar_color="group.avatar_color"
              size="110"
              custom_class="border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800 shadow-lg"
              :name="group.name"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="absolute -bottom-8 right-4 md:right-8 transform translate-y-1/2 flex gap-2"
        >
          <!-- Accept Invitation Button -->

          <BaseButton
            v-if="myRoleForGroup?.status === 'invited'"
            variant="primary-light"
            size="md"
            @click.stop="openAcceptInvitationDialog = true"
          >
            Accept Invitation
          </BaseButton>

          <!-- More Options -->
          <HeadlessPopover v-if="user" class="relative inline-block text-left">
            <HeadlessPopoverButton
              class="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-primary-light dark:hover:bg-primary-dark transition-colors border dark:border-none"
            >
              <Icon
                name="mi:options-vertical"
                size="20"
                class="text-textPrimary-light dark:text-textPrimary-dark hover:text-white"
              />
            </HeadlessPopoverButton>

            <HeadlessPopoverPanel
              class="absolute right-0 mt-2 w-40 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50"
            >
              <div
                class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark"
              >
                <!-- Edit Group -->
                <button
                  v-if="
                    myRoleForGroup?.status == 'approved' &&
                    myRoleForGroup?.role != 'group:member'
                  "
                  @click.stop="editGroup"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
                >
                  <Icon name="mdi:pencil-outline" class="w-4 h-4" />
                  Edit Group
                </button>

                <!-- Delete Group -->
                <button
                  v-if="
                    myRoleForGroup?.status == 'approved' &&
                    myRoleForGroup?.role == 'group:owner'
                  "
                  @click.stop="deleteGroup"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md"
                >
                  <Icon name="mdi:delete-outline" class="w-4 h-4" />
                  Delete Group
                </button>

                <!-- Leave Group -->
                <button
                  v-if="
                    myRoleForGroup?.status == 'approved' &&
                    myRoleForGroup?.role != 'group:owner'
                  "
                  @click.stop="leaveGroup"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md"
                >
                  <Icon name="mdi:logout" class="w-4 h-4" />
                  Leave Group
                </button>

                <!-- Delete Join Request -->
                <button
                  @click.stop="deleteJoinRequest"
                  v-if="myRoleForGroup?.status === 'pending'"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md"
                >
                  <Icon name="mdi:close-circle-outline" class="w-4 h-4" />
                  Delete Join Request
                </button>

                <!-- Decline Invitation -->
                <button
                  @click.stop="declineInvitation"
                  v-if="myRoleForGroup?.status === 'invited'"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md"
                >
                  <Icon name="mdi:close-circle-outline" class="w-4 h-4" />
                  Decline Invitation
                </button>
              </div>
            </HeadlessPopoverPanel>
          </HeadlessPopover>
        </div>
      </div>

      <!-- Group Info Section -->
      <div class="px-3 lg:px-6 pt-16">
        <!-- Group Name and Stats -->
        <div class="flex justify-between items-start mb-1.5">
          <div class="flex-1">
            <h2
              class="text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-2"
            >
              {{ group.name }}
            </h2>

            <div
              class="flex items-center gap-4 text-sm text-textSecondary-light dark:text-textSecondary-dark"
            >
              <span>{{ 20 }} Members</span>
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="
                  group.is_private
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                "
              >
                {{ group.is_private ? "Private" : "Public" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p
          class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
        >
          {{ group.description }}
        </p>

        <!-- Status Messages -->
        <div v-if="group.status !== 'approved'" class="mb-6">
          <!-- PENDING -->
          <div
            v-if="group.status === 'pending'"
            class="p-4 rounded-md mb-4 border-l-4 bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-100"
          >
            <div class="flex items-center space-x-2">
              <span class="mt-1 text-xl">⏳</span>
              <p class="text-sm font-medium">
                Your group is under review. Please wait while we complete the
                process.
              </p>
            </div>
          </div>

          <!-- REJECTED -->
          <div
            v-if="group.status === 'rejected'"
            class="p-4 rounded-md mb-4 border-l-4 bg-red-50 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-100"
          >
            <div class="flex items-center space-x-2">
              <span class="mt-1 text-xl">❌</span>
              <p class="text-sm font-medium">
                Your group has been rejected. Please contact us for more
                information.
              </p>
            </div>
          </div>

          <!-- DISABLED -->
          <div
            v-if="group.status === 'disabled'"
            class="p-4 rounded-md mb-4 border-l-4 bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-100"
          >
            <div class="flex items-center space-x-2">
              <span class="mt-1 text-xl">🚫</span>
              <p class="text-sm font-medium">
                Your group has been disabled. Please contact support for
                details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Group Detail Tabs -->
      <div v-if="group.status === 'approved'" class="px-3 lg:px-6">
        <div class="my-5" v-if="myRoleForGroup || !group.is_private">
          <BaseTab
            id="groupDetailTab"
            :tabs="tabs"
            v-model:current-tab-index="currentTabIndex"
          >
            <template #members>
              <div class="">
                <GroupsMembers
                  :group="group"
                  :my-role-for-group="myRoleForGroup"
                />
              </div>
            </template>

            <template #prayer_requests>
              <div class="">
                <GroupsRequestsList
                  :group="group"
                  :my-role-for-group="myRoleForGroup"
                />
              </div>
            </template>
            <template #devotions>
              <div class="">
                <GroupsDevotions
                  :group="group"
                  :my-role-for-group="myRoleForGroup"
                />
              </div>
            </template>
            <template #testimonials>
              <div class="">
                <GroupsTestimonies
                  :group="group"
                  :my-role-for-group="myRoleForGroup"
                />
              </div>
            </template>
          </BaseTab>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import getGroupQuery from "@/graphql/groups/get_group.gql";

const route = useRoute();
const user = useCookie("userData");
const router = useRouter();

const tabs = ref([
  {
    name: "Devotions",
    value: "devotions",
  },

  {
    name: "Prayer Requests",
    value: "prayer_requests",
  },

  {
    name: "Testimonials",
    value: "testimonials",
  },
  {
    name: "Events",
    value: "events",
  },
  {
    name: "Members",
    value: "members",
  },
]);

function getTabIndex() {
  if (route.query.tab) {
    return tabs.value.findIndex((tab) => tab.value === route.query.tab);
  }
  return 0;
}

const currentTabIndex = ref(getTabIndex());
watch(currentTabIndex, (newVal) => {
  router.push({
    query: {
      tab: tabs.value[newVal].value,
    },
  });
});

const group = ref();
const { onResult, onError, refetch, loading } = queryItem(getGroupQuery, {
  id: route.params.id,
  clientId: user.value?.id ? "auth" : "default",
  include_user: true,
});

provide("refetchGroup", refetch);
onResult(({ data }) => {
  if (data?.group) group.value = data?.group;
  else {
    showError(
      createError({
        statusCode: 404,
        statusMessage: "Group Not Found",
        message: "The requested group does not exist.",
        fatal: true,
      })
    );
  }
});

const myRoleForGroup = computed(() => {
  if (
    group.value?.group_members?.length &&
    group.value?.group_members[0].status === "approved"
  ) {
    return group.value?.group_members[0];
  } else {
    return null;
  }
});

onError(() => {
  // 500 — Internal Server Error
  showError(
    createError({
      statusCode: 500,
      statusMessage: "Failed to Fetch Prayer Group",
      message: "An unexpected error occurred while fetching the prayer group.",
      fatal: true,
    })
  );
});

/**--------------------Accept Invitation------------- */

const openAcceptInvitationDialog = ref(false);

const openLeaveGroupDialog = ref(false);
const leaveGroup = () => {
  openLeaveGroupDialog.value = true;
};

/**-------------------Decline Invitation------------- */
const openDeclineInvitationDialog = ref(false);
const declineInvitation = () => {
  openDeclineInvitationDialog.value = true;
};

/**-------------------Edit Group------------- */
const openEditGroupDialog = ref(false);
const editGroup = () => {
  openEditGroupDialog.value = true;
};

const openDeleteGroupDialog = ref(false);

/**-------------------Delete Group------------- */
const deleteGroup = () => {
  openDeleteGroupDialog.value = true;
};

/**--------------------Cover Image Uploader------------- */
const coverImageUploaderWrapper = ref(null);
const handleCoverImageClick = () => {
  if (
    myRoleForGroup.value?.role == "group:owner" ||
    myRoleForGroup.value?.role == "group:admin"
  ) {
    if (coverImageUploaderWrapper.value) {
      coverImageUploaderWrapper.value.openFilePicker();
    }
  }
};

/**--------------------Profile Image Uploader------------- */
const profileImageUploaderWrapper = ref(null);
const handleProfileImageClick = () => {
  if (
    myRoleForGroup.value?.role == "group:owner" ||
    myRoleForGroup.value?.role == "group:admin"
  ) {
    if (profileImageUploaderWrapper.value) {
      profileImageUploaderWrapper.value.openFilePicker();
    }
  }
};
</script>
