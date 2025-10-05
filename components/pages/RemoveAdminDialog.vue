<template>
  <!-- ❌ Remove Admin Confirmation Dialog -->
  <BaseConfirmation
    v-model="open"
    confirm-button="Remove Admin"
    :description="`Are you sure you want to remove this admin? They will no longer be able to manage the page.`"
    title="Remove Admin"
    icon="mdi:account-remove-outline"
    icon-class="text-danger-light dark:text-danger-dark text-2xl"
    confirm-title="Admin Removed"
    confirm-msg="The admin has been successfully removed."
    cancel-msg="The user is still an admin."
    @confirm="handleRemove"
    :loading="loading"
  />
</template>

<script setup>
import deletePageAdminMutation from "@/graphql/pages/delete_admin.gql";
import { useToast } from "vue-toast-notification";

const router = useRouter();
const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  admin: {
    type: Object,
    required: true,
  },
});

const refetchPage = inject("refetchPage");

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { mutate, onDone, loading } = mutator(deletePageAdminMutation, {
  clientId: "auth",
  role: "page:owner",
});

const handleRemove = (confirmed) => {
  if (confirmed) {
    mutate({ id: props.admin.id });
  } else {
    open.value = false;
  }
};

onDone(({ data }) => {
  if (data?.delete_page_admins_by_pk) {
    toast.success("✅ Admin removed successfully.", {
      position: "top-right",
    });

    if (typeof refetchPage === "function") refetchPage();

    open.value = false;
  } else {
    toast.error("❌ Failed to remove the admin.", {
      position: "top-right",
    });
  }
});
</script>
