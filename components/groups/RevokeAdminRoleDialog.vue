<template>
  <!-- Revoke Admin Role Confirmation Dialog -->
  <BaseConfirmation
    v-model="open"
    confirm-button="Revoke Admin Role"
    :description="`Are you sure you want to revoke this member’s admin access? They will lose privileges to manage group members and settings.`"
    title="Revoke Admin Role"
    icon="mdi:shield-remove-outline"
    icon-class="text-warning-light dark:text-warning-dark text-2xl"
    confirm-title="Admin Role Revoked"
    confirm-msg="The member's admin privileges have been revoked."
    cancel-msg="No changes were made."
    @confirm="handleRevoke"
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

const handleRevoke = (confirmed) => {
  if (confirmed) {
    const input = {
      role: "group:member",
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

    toast.success("Admin role revoked successfully.", {
      position: "top-right",
    });

    open.value = false;
  } else {
    toast.error("Failed to revoke admin role.", {
      position: "top-right",
    });
  }
});
</script>
