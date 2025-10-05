<template>
  <!-- ----------Revoke Admin Role-------- -->
  <GroupsAcceptInvitationDialog v-if="openAcceptInvitationDialog" v-model="openAcceptInvitationDialog"
    :group-member="myRoleForGroup" />

  <GroupsLeaveGroupDialog v-if="openLeaveGroupDialog" v-model="openLeaveGroupDialog" :group-member="myRoleForGroup"
    :my-role-for-group="myRoleForGroup" />

  <GroupsDeclineInvitationDialog v-if="openDeclineInvitationDialog" v-model="openDeclineInvitationDialog"
    :group-member="myRoleForGroup" />

  <EditGroupDialog v-if="openEditGroupDialog && group" v-model="openEditGroupDialog" :group="group"
    :my-role-for-group="myRoleForGroup" />

  <GroupsDeleteGroupDialog v-if="openDeleteGroupDialog && group" v-model="openDeleteGroupDialog" :group="group" />
  <div class="flex flex-col gap-3">
    <!-- ✅ Back Button on Mobile -->


    <div v-if="group && !loading" class=" text-textPrimary-light dark:text-textPrimary-dark">

      <div class="">
        <div class="flex justify-between gap-3 items-start">
          <!-- ✅ Top section: image + title/stats -->
          <div class="flex items-start gap-4 mb-2">
            <!-- Group Image or Fallback Icon -->
            <div
              class="w-20 h-20 flex items-center justify-center rounded-md overflow-hidden bg-slate-200 dark:bg-slate-700">
              <img v-if="group.cover_image?.length" :src="group.cover_image" alt="Group"
                class="w-full h-full object-cover" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-slate-400 dark:text-slate-300"
                viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>

            <!-- Title + Stats -->
            <div class="flex-1">
              <div class="flex justify-between gap-3 items-start">
                <h2 class="text-2xl font-bold text-primary-light dark:text-primary-dark">
                  {{ group.name }}
                </h2>
              </div>

              <div class="mt-1 text-sm text-textSecondary-light dark:text-textSecondary-dark space-x-4">
                <span>{{ 20 }} Members ,
                  {{ group.is_private ? "Private" : "Public" }}
                </span>

                <!-------Accept Invitation-------- -->
                <button v-if="myRoleForGroup?.status === 'invited'" @click="openAcceptInvitationDialog = true"
                  class="px-4 py-1.5 bg-primary-light dark:bg-primary-dark text-white rounded hover:bg-primary-dark dark:hover:bg-primary-light ">
                  Accept Invitation
                </button>
              </div>
            </div>
          </div>

          <!-- ---More options icon------------ -->
          <HeadlessPopover v-if="user" class="relative inline-block text-left">
            <HeadlessPopoverButton
              class="p-2 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition">
              <Icon name="mi:options-vertical" size="22" class="text-textPrimary-light dark:text-textPrimary-dark" />
            </HeadlessPopoverButton>

            <HeadlessPopoverPanel
              class="absolute right-0 mt-2 w-40 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50">
              <div class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark">
                <!-- ------------------Edit Group------- -->
                <button v-if="
                  myRoleForGroup?.status == 'approved' &&
                  myRoleForGroup?.role != 'group:member'
                " @click="editGroup" class="w-full text-left flex items-center gap-2 px-4 py-2 transition rounded-md">
                  <Icon name="mdi:pencil-outline" class="w-4 h-4" />
                  Edit Group
                </button>

                <!-- -------------Delete group  -->
                <button v-if="
                  myRoleForGroup?.status == 'approved' &&
                  myRoleForGroup?.role == 'group:owner'
                " @click="deleteGroup"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark transition rounded-md">
                  <Icon name="mdi:delete-outline" class="w-4 h-4" />
                  Delete Group
                </button>

                <!-- -------------Leave group  -->
                <button v-if="
                  myRoleForGroup?.status == 'approved' &&
                  myRoleForGroup?.role != 'group:owner'
                " @click="leaveGroup"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark transition rounded-md">
                  <Icon name="mdi:logout" class="w-4 h-4" />
                  Leave Group
                </button>

                <!-------------Delete Join Request---------- -->
                <button @click="deleteJoinRequest" v-if="myRoleForGroup?.status === 'pending'"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark transition rounded-md">
                  <Icon name="mdi:close-circle-outline" class="w-4 h-4" />
                  Delete Join Request
                </button>

                <!-- ------------Decline Invitation----- -->

                <button @click="declineInvitation" v-if="myRoleForGroup?.status === 'invited'"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark transition rounded-md">
                  <Icon name="mdi:close-circle-outline" class="w-4 h-4" />
                  Decline Invitation
                </button>
              </div>
            </HeadlessPopoverPanel>
          </HeadlessPopover>
        </div>

        <!-- ✅ Description below -->
        <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark mt-2">
          {{ group.description }}
        </p>

        <div v-if="group.status !== 'approved'" class="mt-4">
          <!-- PENDING -->
          <div v-if="group.status === 'pending'"
            class="p-4 rounded-md mb-4 border-l-4 bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-100">
            <div class="flex items-center space-x-2">
              <span class="mt-1 text-xl">⏳</span>
              <p class="text-sm font-medium">
                Your group is under review. Please wait while we complete the
                process.
              </p>
            </div>
          </div>

          <!-- REJECTED -->
          <div v-if="group.status === 'rejected'"
            class="p-4 rounded-md mb-4 border-l-4 bg-red-50 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-100">
            <div class="flex items-center space-x-2">
              <span class="mt-1 text-xl">❌</span>
              <p class="text-sm font-medium">
                Your group has been rejected. Please contact us for more
                information.
              </p>
            </div>
          </div>

          <!-- DISABLED -->
          <div v-if="group.status === 'disabled'"
            class="p-4 rounded-md mb-4 border-l-4 bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-100">
            <div class="flex items-center space-x-2">
              <span class="mt-1 text-xl">🚫</span>
              <p class="text-sm font-medium">
                Your group has been disabled. Please contact support for details.
              </p>
            </div>
          </div>
        </div>
      </div>


      <!-- ---------Group Detail------- -->
      <div v-if="group.status === 'approved'">
        <div class="my-5" v-if="myRoleForGroup || !group.is_private">
          <BaseTab id="groupDetailTab" :tabs="tabs" v-model:current-tab-index="currentTabIndex">
            <template #members>
              <div class="">
                <GroupsMembers :group="group" :my-role-for-group="myRoleForGroup" />
              </div>
            </template>

            <template #prayer_requests>
              <div class="">
                <GroupsRequestsList :group="group" :my-role-for-group="myRoleForGroup" />
              </div>
            </template>
            <template #devotions>
              <div class="">
                <GroupsDevotions :group="group" :my-role-for-group="myRoleForGroup" />
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
import EditGroupDialog from "~/components/groups/EditGroupDialog.vue";

const route = useRoute();
const router = useRouter();
const user = useCookie("userData");
const isDesktop = ref(false);
function handleResize() {
  isDesktop.value = window.innerWidth >= 1024;
}

const tabs = ref([
  {
    name: "Prayer Requests",
    value: "prayer_requests",
  },
  {
    name: "Devotions",
    value: "devotions",
  },

  {
    name: "Testimonials",
    value: "testimonials",
  }, {
    name: "Events",
    value: "events",
  },
  {
    name: "Members",
    value: "members",
  },

]);

const currentTabIndex = ref(0);
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
  if (group.value?.group_members?.length && group.value?.group_members[0].status === "approved") {
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

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

function goBack() {
  router.push("/user/groups");
}

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
</script>
