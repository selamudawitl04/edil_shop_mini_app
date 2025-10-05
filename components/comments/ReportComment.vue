<template>
  <!-- Report Comment Dialog -->
  <BaseDialog v-model="open" :auto-close="false">
    <template #heading>
      <h3 class="flex items-center gap-2">Report Comment</h3>
    </template>

    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <SelectReportType
          v-model="form.reportType"
          label="Reason for reporting"
          rules="required"
        />

        <BaseInput
          v-model="form.additionalText"
          label="Additional details (optional)"
          placeholder="Provide more context (if any)"
          name="additional"
          id="additional"
        />

        <BaseButton
          :loading="loading"
          :disabled="loading"
          type="submit"
          class="mt-2"
        >
          Submit Report
        </BaseButton>
      </form>
    </template>
  </BaseDialog>

  <!-- Result Dialog -->
  <BaseResult
    v-if="openResultDialog"
    v-model="openResultDialog"
    :result-type="resultType"
    confirm-title="Report Submitted"
    confirm-msg="Thank you for your report. Our team will review this comment."
    cancel-title="Already Reported"
    cancel-msg="You have already reported this comment."
    @ok="closeResult"
  />
</template>

<script setup>
import reportCommentMutation from "@/graphql/comments/report_comment.gql";
import { useForm } from "vee-validate";

const { handleSubmit } = useForm();

const props = defineProps({
  modelValue: Boolean,
  comment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

// Form state
const form = ref({
  reportType: "",
  additionalText: "",
});

const { mutate, onDone, loading, onError } = mutator(reportCommentMutation, {
  clientId: "auth",
  showError: false,
});

const openResultDialog = ref(false);
const resultType = ref("success");

const onSubmit = handleSubmit(() => {
  const input = {
    comment_id: props.comment?.id,
    report_type_id: form.value.reportType,
    additional_details: form.value.additionalText,
  };

  mutate({ input });
});

onDone(({ data }) => {
  if (data?.insert_comment_reports_one) {
    resultType.value = "success";
    openResultDialog.value = true;
  }
});

onError((error) => {
  if (error.message?.includes("Uniqueness violation")) {
    resultType.value = "error";
    openResultDialog.value = true;
  }
});

const closeResult = () => {
  open.value = false;
  openResultDialog.value = false;
};
</script>
