<template>
  <!-- ----------Invite Member----- -->
  <GroupsInviteMemberDialog v-model="openInviteMemberDialog" :group="group" :my-role-for-group="myRoleForGroup"
    v-if="openInviteMemberDialog" />

  <!-- ----------Ban Member-------- -->
  <GroupsBanMemberDialog v-if="openBanUserDialog" v-model="openBanUserDialog" :group-member="selectedMember"
    :my-role-for-group="myRoleForGroup" />

  <!-- ----------Grant Admin Role-------- -->
  <GroupsGrantAdminRoleDialog v-if="openGrantAdminRoleDialog" v-model="openGrantAdminRoleDialog"
    :group-member="selectedMember" :my-role-for-group="myRoleForGroup" />

  <!-- ----------Revoke Admin Role-------- -->
  <GroupsRevokeAdminRoleDialog v-if="openRevokeAdminRoleDialog" v-model="openRevokeAdminRoleDialog"
    :group-member="selectedMember" :my-role-for-group="myRoleForGroup" />

  <!-- ----------Approve Join Request-------- -->
  <GroupsApproveJoinRequestDialog v-if="openApproveJoinRequestDialog" v-model="openApproveJoinRequestDialog"
    :group-member="selectedMember" :my-role-for-group="myRoleForGroup" />

  <!-- ----------Remove from Ban Dialog-------- -->
  <GroupsRemoveBanDialog v-if="openRemoveBanDialog" v-model="openRemoveBanDialog" :group-member="selectedMember"
    :my-role-for-group="myRoleForGroup" />

  <GroupsRemoveInvitationDialog v-if="openRemoveInvitationDialog" v-model="openRemoveInvitationDialog"
    :group-member="selectedMember" :my-role-for-group="myRoleForGroup" />

  <div class="space-y-3 my-4 lg:my-6 w-full">
    <!-- -----------------Group size and Invite section ---------------->
    <div class="flex justify-between items-center mb-4 gap-2 px-0">
      <!-- <BaseInput name="search" placeholder="Search member..." /> -->

      <div>
        <input type="text" placeholder="Search members..." v-model="search"
          class="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark" />
      </div>

      <!-- Add New Button (only for owner) -->
      <template v-if="
        myRoleForGroup.role != 'group:member' ||
        group.allow_members_to_invite_other
      ">
        <button @click="openInviteMemberDialog = true"
          class="inline-flex items-center justify-center px-2 samsg:px-4 py-2 text-sm font-semibold rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition whitespace-nowrap">
          <Icon name="uil:plus" size="20" class="mr-2 hidden" />
          Invite Member
        </button>
      </template>
    </div>

    <!-- ---------------Group list------- -->

    <GroupsMemberStatusFiter v-if="
      myRoleForGroup.role != 'group:member' ||
      group.allow_members_to_invite_other
    " v-model="activeIndex" :statuses="statuses" />

    <!-- 👥 Members List -->
    <ul v-if="group_members.length" class="space-y-2">
      <li v-for="member in group_members" :key="member.id" class="hover:cursor-pointer">
        <div
          class="flex items-center justify-between p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition">
          <!-- 👤 User Info Section -->
          <div class="flex items-start gap-3">
            <!-- 🖼️ Avatar -->

            <BaseAvatar :avatar_image="member.user.profile_image" :name="member.user.full_name"
              :avatar_color="member.user.avatar_color" class="w-10 h-10 rounded-full" />

            <!-- 📝 Name & Username -->
            <div>
              <div class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                {{ member.user.full_name }}
              </div>
              <div class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                @{{ member.user.user_name }}
              </div>
            </div>
          </div>

          <!-- 📋 Role & Options -->
          <div class="flex items-center gap-3">
            <span class="text-xs font-medium px-2 py-1 rounded-full" :class="{
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200':
                member.role === 'group:owner',
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                member.role === 'group:admin',
              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300':
                member.role !== 'group:admin' &&
                member.role !== 'group:owner',
            }">
              {{
                member.role === "group:owner"
                  ? "Owner"
                  : member.role === "group:admin"
                    ? "Admin"
                    : "Member"
              }}
            </span>
            <HeadlessPopover v-if="
              (myRoleForGroup.role === 'group:admin' &&
                member.role === 'group:member') ||
              (myRoleForGroup.role === 'group:owner' &&
                member.role !== 'group:owner')
            " class="relative inline-block text-left">
              <HeadlessPopoverButton
                class="p-2 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition">
                <Icon name="mi:options-vertical" size="22" class="text-textPrimary-light dark:text-textPrimary-dark" />
              </HeadlessPopoverButton>

              <HeadlessPopoverPanel
                class="absolute right-0 mt-2 w-60 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50">
                <div class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark">
                  <!-- ❌ Ban Member -->
                  <button @click="selectGroupMemberForBan(member)" v-if="
                    member.status == 'approved' &&
                    (myRoleForGroup.role === 'group:owner' ||
                      (myRoleForGroup.role === 'group:admin' &&
                        member.role === 'group:member'))
                  "
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark transition rounded-md">
                    <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                    Ban Member
                  </button>

                  <!-- 🛡️ Grant Admin Role -->
                  <button @click="selectGroupMemberToGrantAdminRole(member)" v-if="
                    member.role === 'group:member' &&
                    myRoleForGroup.role === 'group:owner' &&
                    member.status === 'approved'
                  " class="w-full text-left flex items-center gap-2 px-4 py-2 transition rounded-md">
                    <Icon name="mdi:shield-account-outline" class="w-4 h-4" />
                    Grant Admin Role
                  </button>

                  <!-- 🚫 Revoke Admin Role -->
                  <button @click="selectGroupMemberToRevokeAdminRole(member)" v-if="
                    member.status == 'approved' &&
                    member.role == 'group:admin' &&
                    myRoleForGroup.role == 'group:owner'
                  "
                    class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md">
                    <Icon name="mdi:shield-remove-outline" class="w-4 h-4" />
                    Revoke Admin Role
                  </button>

                  <!-- ✅ Approve Join Request -->
                  <button @click="selectGroupMemberToApproveJoinRequest(member)" v-if="
                    activeIndex === 1 &&
                    (myRoleForGroup.role === 'group:owner' ||
                      myRoleForGroup.role === 'group:admin')
                  " class="w-full text-left flex items-center gap-2 px-4 py-2 transition rounded-md">
                    <Icon name="mdi:check-circle-outline" class="w-4 h-4 text-green-600 dark:text-green-400" />
                    Approve Join Request
                  </button>

                  <!-- ✅ Remove Invitation -->
                  <button @click="selectGroupMemberToRemoveInvitation(member)" v-if="
                    activeIndex === 2 &&
                    (myRoleForGroup.role === 'group:owner' ||
                      (myRoleForGroup.role === 'group:admin' &&
                        member.role === 'group:member'))
                  " class="w-full text-left flex items-center gap-2 px-4 py-2 transition rounded-md">
                    <Icon name="mdi:close-circle-outline" class="w-4 h-4 text-red-500 dark:text-red-400" />
                    Remove Invitation
                  </button>

                  <!-- ✅ Remove from Ban -->
                  <button @click="selectGroupMemberToRemoveBan(member)" v-if="
                    member.status === 'banned' &&
                    (myRoleForGroup.role === 'group:owner' ||
                      (myRoleForGroup.role === 'group:admin' &&
                        member.role === 'group:member'))
                  "
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-success-light dark:text-success-dark transition rounded-md">
                    <Icon name="mdi:account-check-outline" class="w-4 h-4" />
                    Remove from Ban
                  </button>
                </div>
              </HeadlessPopoverPanel>
            </HeadlessPopover>
          </div>
        </div>
      </li>
    </ul>

    <!-- No members found -->
    <div v-else class="text-sm text-center text-textSecondary-light dark:text-textSecondary-dark mt-6">
      No members found.
    </div>
  </div>
</template>

<script setup>
import getMembersQuery from "@/graphql/groups/get_members.gql";

const props = defineProps({
  group: {
    type: Object,
    require: true,
  },
  myRoleForGroup: {
    type: Object,
    required: true,
  },
});

/**------------------Fetch group members--------- */

const statuses = computed(() => {
  const keys = ["approved", "pending", "invited", "banned"];

  return keys.map((status) => ({
    name: status,
    count: props.group.status_counts?.[status] ?? 0,
  }));
});

const search = ref("");
const limit = ref(50);
const offset = ref(0);
const group_members = ref([]);
const sort = ref([{}]);
const activeIndex = ref(0);
const filter = computed(() => {
  const query = {};
  query._and = {};
  query._and._or = [
    {
      user: {
        full_name: {
          _ilike: `%${search.value}%`,
        },
      },
    },

    {
      user: {
        user_name: {
          _ilike: `%${search.value}%`,
        },
      },
    },
  ];
  query._and.status = {
    _eq: statuses.value[activeIndex.value].name,
  };
  query._and.group_id = {
    _eq: props.group.id,
  };
  return query;
});
const { onResult, loading, refetch } = queryList(getMembersQuery, {
  role: "user",
  clientId: "auth",
  filter: filter,
  order: sort,
  limit: limit,
});
onResult(({ data }) => {
  if (data.group_members) {
    group_members.value = [...data.group_members];
  }
});

provide("refetchMembers", refetch);

const selectedMember = ref();

const openInviteMemberDialog = ref(false);

/**--------------------Ban user------------- */
const openBanUserDialog = ref(false);

const selectGroupMemberForBan = (groupMember) => {
  selectedMember.value = groupMember;
  openBanUserDialog.value = true;
};

/**--------------------Grant Admin Role------------- */
const openGrantAdminRoleDialog = ref(false);

const selectGroupMemberToGrantAdminRole = (groupMember) => {
  selectedMember.value = groupMember;
  openGrantAdminRoleDialog.value = true;
};

/**--------------------Remove Admin Role------------- */
const openRevokeAdminRoleDialog = ref(false);

const selectGroupMemberToRevokeAdminRole = (groupMember) => {
  selectedMember.value = groupMember;
  openRevokeAdminRoleDialog.value = true;
};

/**--------------------Approve Join Request------------- */
const openApproveJoinRequestDialog = ref(false);

const selectGroupMemberToApproveJoinRequest = (groupMember) => {
  selectedMember.value = groupMember;
  openApproveJoinRequestDialog.value = true;
};

/**--------------------Remove from Ban------------- */
const openRemoveBanDialog = ref(false);

const selectGroupMemberToRemoveBan = (groupMember) => {
  selectedMember.value = groupMember;
  openRemoveBanDialog.value = true;
};

/**--------------------Remove Invitation------------- */

const openRemoveInvitationDialog = ref(false);

const selectGroupMemberToRemoveInvitation = (groupMember) => {
  selectedMember.value = groupMember;
  openRemoveInvitationDialog.value = true;
};

/**--------------------Accept Invitation------------- */

const openAcceptInvitationDialog = ref(false);
</script>
