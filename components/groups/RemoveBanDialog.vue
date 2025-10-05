<template>
  <!-- Remove from Ban Confirmation Dialog -->
  <BaseConfirmation
    v-model="open"
    confirm-button="Remove Ban"
    :description="`Are you sure you want to remove the ban for this member? They will regain access to the group.`"
    title="Remove Ban"
    icon="mdi:account-check-outline"
    icon-class="text-success-light dark:text-success-dark text-2xl"
    confirm-title="Member Unbanned"
    confirm-msg="The member has been successfully unbanned and re-approved."
    cancel-msg="No changes were made."
    @confirm="handleUnban"
  />
</template>

<script setup>
import updateGroupMemberMutation from "@/graphql/groups/update_member.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  groupMember: {
    type: Object,
    required: true,
  },
  myRoleForGroup: {
    type: Object,
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const refetchGroup = inject("refetchGroup");
const refetchMembers = inject("refetchMembers");

const { mutate, onDone, loading } = mutator(updateGroupMemberMutation, {
  clientId: "auth",
  role: props.myRoleForGroup.role,
});

const handleUnban = (confirmed) => {
  if (confirmed) {
    const input = {
      status: "approved",
    };
    mutate({ input, id: props.groupMember.id });
  } else {
    open.value = false;
  }
};

onDone(({ data }) => {
  if (data?.update_group_members_by_pk) {
    if (typeof refetchGroup === "function") refetchGroup();
    if (typeof refetchMembers === "function") refetchMembers();

    toast.success("Member has been unbanned successfully.", {
      position: "top-right",
    });

    open.value = false;
  } else {
    toast.error("Failed to unban the member.", {
      position: "top-right",
    });
  }
});
</script>
