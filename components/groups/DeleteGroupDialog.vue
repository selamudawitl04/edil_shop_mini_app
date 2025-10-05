<script setup>
import updateQuery from "@/graphql/groups/update_group.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();

const emit = defineEmits(["update:modelValue"]);

const router = useRouter();
const props = defineProps({
  modelValue: Boolean,
  group: {
    type: Object,
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const refetchGroup = inject("refetchGroup");
const refetchGroups = inject("refetchGroups");

// GraphQL: Soft Delete Group
const { mutate, onDone, loading } = mutator(updateQuery, {
  clientId: "auth",
  role: "group:owner",
});

const handleDelete = () => {
  const input = {
    is_deleted: true,
  };
  mutate({ id: props.group.id, input });
};

onDone(({ data }) => {
  const deleted = data?.update_prayer_groups_by_pk;
  if (deleted) {
    toast.success("Group deleted successfully.", { position: "top-right" });

    if (typeof refetchGroup === "function") refetchGroup();
    if (typeof refetchGroups === "function") refetchGroups();

    router.push("/user/groups");

    open.value = false;
  } else {
    toast.error("Failed to delete the group.", { position: "top-right" });
  }
});
</script>

<template>
  <BaseConfirmation
    v-model="open"
    confirm-button="Delete Group"
    cancel-button="Cancel"
    title="Delete Group"
    :description="`Are you sure you want to delete the group '${props.group.name}'? This action cannot be undone.`"
    icon="mdi:alert-circle-outline"
    icon-class="text-red-500 text-2xl"
    confirm-title="Group Deleted"
    confirm-msg="The group has been marked as deleted."
    cancel-msg="Group deletion was cancelled."
    :loading="loading"
    @confirm="handleDelete"
  />
</template>
