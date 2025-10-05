<template>
  <!-- Decline Invitation Confirmation Dialog -->
  <BaseConfirmation v-model="open" confirm-button="Decline Invitation" :description="description"
    title="Decline Invitation" icon="mdi:close-circle-outline"
    icon-class="text-danger-light dark:text-danger-dark text-2xl" confirm-title="Invitation Declined"
    confirm-msg="You have declined the invitation to join the group." cancel-msg="You did not decline the invitation."
    @confirm="handleDecline" />
</template>

<script setup>
import deleteGroupMemberMutation from "@/graphql/groups/delete_member.gql";
import { useToast } from "vue-toast-notification";

const router = useRouter();
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
  return `Are you sure you want to decline this invitation? You will not be added to the group as a ${props.groupMember.role?.split(":")[1]
    } role.`;
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { mutate, onDone, loading } = mutator(deleteGroupMemberMutation, {
  clientId: "auth",
  role: "user",
});

const handleDecline = (confirmed) => {
  if (confirmed) {
    mutate({ id: props.groupMember.id });
  } else {
    open.value = false;
  }
};

onDone(({ data }) => {
  if (data?.delete_group_members_by_pk) {

    router.push("/user/communities");
    toast.success("You have declined the invitation.", {
      position: "top-right",
    });
    open.value = false;
  } else {
    toast.error("Failed to decline the invitation.", {
      position: "top-right",
    });
  }
});
</script>
