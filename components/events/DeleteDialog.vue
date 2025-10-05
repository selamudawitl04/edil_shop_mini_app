<script setup>
import deleteEvent from "@/graphql/events/update.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  modelValue: Boolean,
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const userRole = computed(() => {
  return (
    props.event.feed.page.page_admins[0]?.role ||
    props.event.feed.group.group_members.find(
      (member) => member.role != "group:member"
    )?.role
  );
});

// GraphQL mutation
const { mutate, onDone, loading, onError } = mutator(deleteEvent, {
  clientId: "auth",
  role: userRole.value,
});

// Mutation response handler
onDone(({ data }) => {
  const affected = data?.update_events?.affected_rows;
  if (affected > 0) {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    toast.error("Failed to delete the event.", {
      position: "top-right",
    });
  }
  open.value = false;
});

onError((error) => {
  toast.error("An error occurred while deleting.", { position: "top-right" });
  open.value = false;
});

// Delete handler
const handleDelete = (confirmed) => {
  if (!confirmed) {
    open.value = false;
    return;
  }
  const input = {
    is_deleted: true,
  };
  mutate({
    input,
    id: props.event?.id,
    delete_event_links: false,
    event_links: [],
  });
};
</script>

<template>
  <BaseConfirmation
    v-model="open"
    confirm-button="Delete"
    :description="`Are you sure you want to delete this event? This action cannot be undone.`"
    title="Delete Event"
    icon="uil:trash"
    icon-class="text-danger-light dark:text-danger-dark text-2xl"
    confirm-title="Deleted"
    confirm-msg="The event was deleted successfully."
    cancel-msg="Event deletion was canceled."
    @confirm="handleDelete"
    :loading="loading"
  />
</template>
