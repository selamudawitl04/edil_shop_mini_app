<script setup>
import updateQuery from "@/graphql/pages/update_page.gql"; // updated path
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const router = useRouter();
const props = defineProps({
  modelValue: Boolean,
  page: {
    type: Object,
    required: true,
  },
  myRoleForPage: {
    type: Object,
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const refetchPage = inject("refetchPage");
const refetchPages = inject("refetchPages");

// GraphQL: Soft Delete Page
const { mutate, onDone, loading } = mutator(updateQuery, {
  clientId: "auth",
  role: props.myRoleForPage?.role || "page:owner",
});

const handleDelete = () => {
  const input = {
    deleted_at: new Date().toISOString(),
  };
  mutate({ id: props.page.id, input });
};

onDone(({ data }) => {
  const deleted = data?.update_pages_by_pk;
  if (deleted) {
    toast.success("Page deleted successfully.", { position: "top-right" });

    if (typeof refetchPage === "function") refetchPage();
    if (typeof refetchPages === "function") refetchPages();

    router.push("/user/communities");

    open.value = false;
  } else {
    toast.error("Failed to delete the page.", { position: "top-right" });
  }
});
</script>

<template>
  <BaseConfirmation
    v-model="open"
    confirm-button="Delete Page"
    cancel-button="Cancel"
    title="Delete Page"
    :description="`Are you sure you want to delete the page '${props.page.name}'? This action cannot be undone.`"
    icon="mdi:alert-circle-outline"
    icon-class="text-red-500 text-2xl"
    confirm-title="Page Deleted"
    confirm-msg="The page has been marked as deleted."
    cancel-msg="Page deletion was cancelled."
    :loading="loading"
    @confirm="handleDelete"
  />
</template>
