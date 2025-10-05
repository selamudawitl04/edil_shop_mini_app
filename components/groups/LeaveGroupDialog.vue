<template>
  <!-- Leave Group Confirmation Dialog -->
  <BaseConfirmation v-model="open" confirm-button="Leave Group"
    :description="`Are you sure you want to leave this group? You will lose access to all group content and features.`"
    title="Leave Group" icon="mdi:logout-variant" icon-class="text-warning-light dark:text-warning-dark text-2xl"
    confirm-title="You Left the Group" confirm-msg="You have successfully left the group."
    cancel-msg="You are still a member of the group." @confirm="handleLeave" />
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

const refetchGroups = inject("refetchGroups");
const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { mutate, onDone, loading } = mutator(deleteGroupMemberMutation, {
  clientId: "auth",
});

const handleLeave = (confirmed) => {
  if (confirmed) {
    mutate({ id: props.groupMember.id });
  } else {
    open.value = false;
  }
};

onDone(({ data }) => {
  if (data?.delete_group_members_by_pk) {

    router.push("/user/communities");
    toast.success("You have left the group.", {
      position: "top-right",
    });

    if (typeof refetchGroups === "function") refetchGroups();

    open.value = false;
  } else {
    toast.error("Failed to leave the group.", {
      position: "top-right",
    });
  }
});
</script>
