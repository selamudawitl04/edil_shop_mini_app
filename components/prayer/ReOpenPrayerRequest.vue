<template>
  <!-- Reopen Prayer Confirmation -->
  <BaseConfirmation v-model="open" confirm-button="Reopen Prayer"
    :description="`Do you want to reopen this prayer request? It will be marked as active again.`"
    title="Reopen Prayer Request" icon="uil:refresh" icon-class="text-primary-light dark:text-primary-dark text-2xl"
    confirm-title="Prayer Reopened" confirm-msg="The prayer request has been marked as active again."
    cancel-msg="Prayer reopening was canceled." @confirm="handleReopen" @finally="onClose" />
</template>

<script setup>
import updatePrayerRequestMutation from "@/graphql/prayers/update_request.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  prayerRequest: {
    type: Object,
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const userData = useCookie("userData");
let clientId = "default"; // Assuming you have a client ID for authentication
if (userData.value) {
  clientId = "auth";
}
const { mutate, onDone, loading } = mutator(updatePrayerRequestMutation, {
  clientId,
});
const handleReopen = (confirmed) => {
  if (confirmed) {
    const input = {
      id: props.prayerRequest?.id,
      title: props.prayerRequest.title,
      for_who: props.prayerRequest.for_who,
      photo_url: props.prayerRequest.photo_url,
      description: props.prayerRequest.description,
      category_id: props.prayerRequest.category_id,
      language: props.prayerRequest.language,
      status: "pending", // reopening the prayer
      edit_token: route.query.edit_token || null,
      is_deleted: false,
      update_media: false,
      medias: [],
      visibility: props.prayerRequest.visibility || "public", // Default visibility
    };
    const filter = {
      id: { _eq: props.prayerRequest?.id },
    };

    mutate({ input, filter });
  } else {
    open.value = false;
  }
};

const onClose = () => {
  // Optional: clean up or reset state if needed
};

onDone(({ data }) => {
  if (data?.update_prayer_request) {
    props.prayerRequest.status = "pending";
    toast.success("Prayer request is now active again.", {
      position: "top-right",
    });
  } else {
    toast.error("Failed to reopen the prayer request.", {
      position: "top-right",
    });
  }
});
</script>
