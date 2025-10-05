<template>
  <!-- Leave Page Confirmation Dialog -->
  <BaseConfirmation
    v-model="open"
    confirm-button="Leave Page"
    :description="`Are you sure you want to leave this page? You will lose admin access and management permissions.`"
    title="Leave Page"
    icon="mdi:logout-variant"
    icon-class="text-warning-light dark:text-warning-dark text-2xl"
    confirm-title="You Left the Page"
    confirm-msg="You have successfully left the page."
    cancel-msg="You are still an admin of the page."
    @confirm="handleLeave"
  />
</template>

<script setup>
import deletePageAdminMutation from "@/graphql/pages/delete_admin.gql"; // new mutation
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: Boolean,

  myRoleForPage: {
    type: Object,
    required: true,
  },
});

const refetchPages = inject("refetchPages");
const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { mutate, onDone, loading } = mutator(deletePageAdminMutation, {
  clientId: "auth",
  role: props.myRoleForPage.role || "page:admin",
});

const handleLeave = (confirmed) => {
  if (confirmed) {
    mutate({ id: props.myRoleForPage.id });
  } else {
    open.value = false;
  }
};

onDone(({ data }) => {
  if (data?.delete_page_admins_by_pk) {
    // router.push("/user/communities");
    toast.success("You have left the page.", {
      position: "top-right",
    });
    if (typeof refetchPages === "function") refetchPages();
    open.value = false;
  } else {
    toast.error("Failed to leave the page.", {
      position: "top-right",
    });
  }
});
</script>
