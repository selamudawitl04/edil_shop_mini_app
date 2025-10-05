<template>
  <!-- Mark Prayer as Closed Confirmation -->
  <BaseConfirmation v-model="open" confirm-button="Close Prayer"
    :description="`Are you sure you want to mark this prayer as closed? You can reopen it later if needed.`"
    title="Close Prayer Request" icon="uil:times-circle" icon-class="text-warning-light dark:text-warning-dark text-2xl"
    confirm-title="Prayer Closed" confirm-msg="The prayer request has been marked as closed."
    cancel-msg="Prayer request was not closed." @confirm="handleClose" :loading="loading" />
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

const handleClose = (confirmed) => {
  if (confirmed) {
    const input = {
      id: props.prayerRequest?.id,
      title: props.prayerRequest.title,
      for_who: props.prayerRequest.for_who,
      photo_url: props.prayerRequest.photo_url,
      description: props.prayerRequest.description,
      category_id: props.prayerRequest.category_id,
      language: props.prayerRequest.language,
      status: "closed", // set to closed
      edit_token: route.query.edit_token || null,
      update_media: false,
      medias: [],
      is_deleted: false,
      visibility: props.prayerRequest.visibility || "public", // Default visibility
    };


    mutate({ input });
  } else {
    open.value = false;
  }
};

onDone(({ data }) => {
  if (data?.update_prayer_request) {


    props.prayerRequest.status = "closed";
    toast.success("Prayer request closed successfully.", {
      position: "top-right",
    });
  } else {
    toast.error("Failed to close the prayer request.", {
      position: "top-right",
    });
  }
});


</script>
