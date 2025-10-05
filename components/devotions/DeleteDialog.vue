<script setup>
import deleteDevotion from "@/graphql/devotions/update.gql";
import { useToast } from "vue-toast-notification";


const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,

  devotion: {
    type: Object,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// GraphQL mutation
const { mutate, onDone, loading, onError } = mutator(deleteDevotion, {
  clientId: "auth",
  role: props.role,
});

// Mutation response handler
onDone(({ data }) => {
  if (data?.update_devotion_devotions_by_pk) {
    window.location.reload();
  } else {
    toast.error("Failed to delete the devotion.", {
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
    id: props.devotion?.id,
  });
};
</script>

<template>
  <BaseConfirmation v-model="open" confirm-button="Delete"
    :description="`Are you sure you want to delete this devotion? This action cannot be undone.`"
    title="Delete Devotion" icon="uil:trash" icon-class="text-danger-light dark:text-danger-dark text-2xl"
    confirm-title="Deleted" confirm-msg="The devotion was deleted successfully."
    cancel-msg="Devotion deletion was canceled." @confirm="handleDelete" :loading="loading" />
</template>
