<template>
  <!-- Grant Admin Role Confirmation Dialog -->
  <BaseConfirmation
    v-model="open"
    confirm-button="Grant Admin Role"
    :description="`Are you sure you want to grant this member admin access? Admins can manage members, edit group details, and moderate prayer requests.`"
    title="Grant Admin Role"
    icon="mdi:shield-account-outline"
    icon-class="text-primary-light dark:text-primary-dark text-2xl"
    confirm-title="Admin Role Granted"
    confirm-msg="The member has been granted admin privileges."
    cancel-msg="No changes were made."
    @confirm="handleGrant"
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

const handleGrant = (confirmed) => {
  if (confirmed) {
    const input = {
      role: "group:admin",
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

    toast.success("Admin role granted successfully.", {
      position: "top-right",
    });

    open.value = false;
  } else {
    toast.error("Failed to grant admin role.", {
      position: "top-right",
    });
  }
});
</script>
