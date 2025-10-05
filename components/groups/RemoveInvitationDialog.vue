<template>
  <!-- Remove Invitation Confirmation Dialog -->
  <BaseConfirmation
    v-model="open"
    confirm-button="Remove Invitation"
    :description="`Are you sure you want to remove this member's invitation? They will no longer be able to join the group unless reinvited.`"
    title="Remove Invitation"
    icon="mdi:close-circle-outline"
    icon-class="text-danger-light dark:text-danger-dark text-2xl"
    confirm-title="Invitation Removed"
    confirm-msg="The invitation has been successfully removed."
    cancel-msg="No changes were made."
    @confirm="handleRemove"
  />
</template>

<script setup>
import deleteGroupMemberMutation from "@/graphql/groups/delete_member.gql";
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

const { mutate, onDone, loading } = mutator(deleteGroupMemberMutation, {
  clientId: "auth",
  role: props.myRoleForGroup.role,
});

const handleRemove = (confirmed) => {
  if (confirmed) {
    mutate({ id: props.groupMember.id });
  } else {
    open.value = false;
  }
};

onDone(({ data }) => {
  if (data?.delete_group_members_by_pk) {
    if (typeof refetchGroup === "function") refetchGroup();
    if (typeof refetchMembers === "function") refetchMembers();

    toast.success("Invitation removed successfully.", {
      position: "top-right",
    });

    open.value = false;
  } else {
    toast.error("Failed to remove invitation.", {
      position: "top-right",
    });
  }
});
</script>
