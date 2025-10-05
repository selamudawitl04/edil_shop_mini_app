<template>
  <!-- Ban Member Confirmation Dialog -->
  <BaseConfirmation
    v-model="open"
    confirm-button="Ban Member"
    :description="`Are you sure you want to ban this member? They will be removed from the group and lose access.`"
    title="Ban Member"
    icon="uil:ban"
    icon-class="text-danger-light dark:text-danger-dark text-2xl"
    confirm-title="Member Banned"
    confirm-msg="The member has been successfully banned from the group."
    cancel-msg="No changes were made."
    @confirm="handleBan"
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

// Injected function to refetch group data
const refetchGroup = inject("refetchGroup");
const refetchMembers = inject("refetchMembers");

const { mutate, onDone, loading } = mutator(updateGroupMemberMutation, {
  clientId: "auth",
  role: props.myRoleForGroup.role,
});

const handleBan = (confirmed) => {
  if (confirmed) {
    const input = {
      status: "banned",
    };
    mutate({ input, id: props.groupMember.id });
  } else {
    open.value = false;
  }
};

onDone(({ data }) => {
  if (data?.update_group_members_by_pk) {
    if (typeof refetchGroup === "function") {
      refetchGroup();
    }
    if (typeof refetchMembers === "function") {
      refetchMembers();
    }

    toast.success("Member has been banned successfully.", {
      position: "top-right",
    });

    open.value = false;
  } else {
    toast.error("Failed to ban the member.", {
      position: "top-right",
    });
  }
});
</script>
