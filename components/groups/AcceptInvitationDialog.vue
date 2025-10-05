<template>
  <!-- Accept Invitation Confirmation Dialog -->
  <BaseConfirmation v-model="open" confirm-button="Accept Invitation" :description="description"
    title="Accept Invitation" icon="mdi:check-circle-outline"
    icon-class="text-success-light dark:text-success-dark text-2xl" confirm-title="Invitation Accepted"
    confirm-msg="You have successfully joined the group." cancel-msg="You did not accept the invitation."
    @confirm="handleAccept" />
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
});

const description = computed(() => {
  return `Are you sure you want
  you want to accept this invitation? You will be
  added to the group as a ${props.groupMember.role?.split(":")[1]} role.`;
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const refetchGroup = inject("refetchGroup");

const { mutate, onDone, loading } = mutator(updateGroupMemberMutation, {
  clientId: "auth",
  role: "user", // Assuming user will join as a regular member
});

const handleAccept = (confirmed) => {
  if (confirmed) {
    const input = {
      status: "approved",
      joined_at: new Date().toISOString(),
    };
    mutate({ input, id: props.groupMember.id });
  } else {
    open.value = false;
  }
};

onDone(({ data }) => {
  if (data?.update_group_members_by_pk) {
    if (typeof refetchGroup === "function") refetchGroup();

    toast.success("You have joined the group.", {
      position: "top-right",
    });


    open.value = false;
  } else {
    toast.error("Failed to accept the invitation.", {
      position: "top-right",
    });
  }
});
</script>
