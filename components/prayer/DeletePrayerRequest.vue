<script setup>
import deletePrayerRequest from "@/graphql/prayers/edit_request.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  prayerRequest: {
    type: Object,
    required: true,
  },
  modelValue: Boolean,
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// GraphQL mutation
const { mutate, onDone, loading, onError } = mutator(deletePrayerRequest, {
  clientId: "auth",
});

// Mutation response handler
onDone(({ data }) => {
  const affected = data?.update_prayer_requests?.affected_rows;
  if (affected > 0) {
    window.location.reload();
  } else {
    toast.error("Failed to delete the prayer request.", {
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

  const filter = {
    id: {
      _eq: props.prayerRequest?.id,
    },
  };

  mutate({
    input,
    filter,
  });
};
</script>

<template>
  <BaseConfirmation v-model="open" confirm-button="Delete"
    :description="`Are you sure you want to delete this prayer request? This action cannot be undone.`"
    title="Delete Prayer Request" icon="uil:trash" icon-class="text-danger-light dark:text-danger-dark text-2xl"
    confirm-title="Deleted" confirm-msg="The prayer request was deleted successfully."
    cancel-msg="Prayer request deletion was canceled." @confirm="handleDelete" :loading="loading" />
</template>
