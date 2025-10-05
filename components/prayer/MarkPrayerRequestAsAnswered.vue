<template>
  <!-- ----------------Ask Convert to Testimony Confirmation Dialog---------------- -->

  <!-- Mark Prayer as Closed Confirmation -->
  <BaseConfirmation
    v-model="openAskConvertToTestimonyDialog"
    confirm-button="Convert to Testimony"
    :description="`Are you sure you want to convert this prayer to a testimony? You can do it later if needed.`"
    title="Convert to Testimony"
    icon="uil:times-circle"
    icon-class="text-warning-light dark:text-warning-dark text-2xl"
    confirm-title="Prayer Converted to Testimony"
    confirm-msg="The prayer request has been converted to a testimony."
    cancel-msg="Prayer request was not converted to a testimony."
    @confirm="handleClose"
    :loading="loading"
  />

  <!-- ----------------Convert to Testimony Dialog---------------- -->

  <!-- ----------Mark as Answered Dialog-------- -->
  <BaseDialog
    v-model="open"
    title="Mark Prayer as Answered"
    :auto-close="false"
  >
    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Answer Content Input -->
        <BaseTextInput
          v-model="addPrayerUpdateForn.content"
          label="Update Message"
          placeholder="Write a brief message about how this prayer was answered..."
          name="answered_update"
          id="answered_update"
          rules="required"
        />

        <!-- Submit Button -->
        <BaseButton
          :loading="loading"
          :disabled="loading || !addPrayerUpdateForn.content.trim().length"
        >
          <template v-if="!loading"> 🙏 Mark as Answered </template>
          <template v-else>
            <span class="text-white">Submitting...</span>
          </template>
        </BaseButton>
      </form>
    </template>
  </BaseDialog>
</template>

<script setup>
import addPrayerRequestUpdateMutation from "@/graphql/prayers/add_prayer_request _update.gql";
import { useTestimonyStore } from "@/stores/testimony";

const testimonyStore = useTestimonyStore();

import { useToast } from "vue-toast-notification";
import { useForm } from "vee-validate";

const toast = useToast();
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);

const { handleSubmit } = useForm();
const user = useCookie("userData");

const props = defineProps({
  modelValue: Boolean,
  prayerRequest: {
    type: Object,
    required: true,
  },
});

// Dialog open state
const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Form state
const addPrayerUpdateForn = ref({
  content: "",
});

// GraphQL mutation setup
const {
  mutate: addMutate,
  onDone: addDone,
  loading,
} = mutator(addPrayerRequestUpdateMutation, {
  clientId: "auth",
});

const onSubmit = handleSubmit(() => {
  const input = {
    prayer_request_id: props.prayerRequest?.id,
    content: addPrayerUpdateForn.value.content,
    is_answer: true,
    edit_token: route.query.edit_token || null,
  };

  addMutate({ input });
});

// Handle mutation result
addDone(({ data }) => {
  if (data.add_prayer_request_update) {
    props.prayerRequest.status = "answered";
    toast.success("Prayer marked as answered!", { position: "top-right" });
    if (!props.prayerRequest.testimony) {
      openAskConvertToTestimonyDialog.value = true;
    } else {
      open.value = false;
    }
  }
});

/***----------------------Convert request to testimony -------------------------- */

// community id, community type, role

const ownerInfo = computed(() => {
  const feed = props.prayerRequest?.feed;
  const userId = user.value?.id || null;

  // Community details
  const communityId = feed.page?.id || feed.group?.id || null;
  const communityType = feed.page ? "page" : feed.group ? "group" : null;

  // Role resolution
  let role = null;

  if (feed.page?.page_admins?.[0]?.role) {
    role = feed.page.page_admins[0].role;
  } else if (feed.group?.group_members?.[0]?.role) {
    role = feed.group.group_members[0].role;
  } else if (feed.created_by === userId) {
    role = "user";
  }

  return {
    communityId,
    communityType,
    role,
    isPrivateGroup: feed.group?.is_private || false,
  };
});

const openAskConvertToTestimonyDialog = ref(false);
const handleClose = (confirmed) => {
  if (confirmed) {
    testimonyStore.openCreate({
      prayerRequestId: props.prayerRequest.id,
      communityId: ownerInfo.value.communityId,
      communityType: ownerInfo.value.communityType,
      role: ownerInfo.value.role,
      isPrivateGroup: ownerInfo.value.isPrivateGroup,
    });
  }
  open.value = false;
};
</script>
