<template>
  <!-- Approve Join Request Confirmation Dialog -->
  <BaseConfirmation
    v-model="open"
    confirm-button="Approve Request"
    :description="`Are you sure you want to approve this member's join request? They will be added to the group as a member.`"
    title="Approve Join Request"
    icon="mdi:check-circle-outline"
    icon-class="text-success-light dark:text-success-dark text-2xl"
    confirm-title="Request Approved"
    confirm-msg="The member has been approved and added to the group."
    cancel-msg="No changes were made."
    @confirm="handleApprove"
  />
</template>

<script setup>
import updateGroupMemberMutation from "@/graphql/groups/update_member.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const user = useCookie("userData");
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

const handleApprove = (confirmed) => {
  if (confirmed) {
    const input = {
      status: "approved",
      joined_at: new Date().toISOString(),
      approved_by: user.value?.id,
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

    toast.success("Join request approved successfully.", {
      position: "top-right",
    });

    open.value = false;
  } else {
    toast.error("Failed to approve join request.", {
      position: "top-right",
    });
  }
});
</script>
