<template>
  <BaseConfirmation v-model="open" confirm-button="Delete"
    :description="`Are you sure you want to delete this comment? This action cannot be undone.`" title="Delete Comment"
    icon="uil:trash" icon-class="text-danger-light dark:text-danger-dark text-2xl" confirm-title="Deleted"
    confirm-msg="The comment was deleted successfully." cancel-msg="Comment deletion was canceled."
    @confirm="handleDelete" @finally="onClose" :loading="loading" />
</template>

<script setup>
import deleteComment from "@/graphql/comments/delete.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  modelValue: Boolean,
  userRole: {
    type: String,
    required: true,
  },
});


const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
const showResponse = ref(false);
const refetchComments = inject("refetchComments");
const refetchDevotion = inject("refetchDevotion");
const refetchPrayerRequest = inject("refetchPrayerRequest");

// GraphQL mutation
const { mutate, onDone, loading } = mutator(deleteComment, {
  clientId: "auth",
  role: props.userRole,
});

onDone(({ data }) => {
  if (data.delete_comments_by_pk?.id) {
    toast.success("Comment deleted.", { position: "top-right" });
    if (typeof refetchComments == "function") {
      refetchComments();
    }
    if (typeof refetchDevotion == "function") {
      refetchDevotion();
    }
    if (typeof refetchPrayerRequest == "function") {
      refetchPrayerRequest();
    }
  } else {
    toast.error("Failed to delete the comment.", { position: "top-right" });
  }
  open.value = false;
});

// Delete handler
const handleDelete = (confirmed) => {
  if (confirmed && props.comment?.id) {
    mutate({ id: props.comment.id });
  } else {
    showResponse.value = true;
  }
  open.value = false;
};

const onClose = (success) => {
  if (success) {
    refetchComments();
  }
};
</script>
