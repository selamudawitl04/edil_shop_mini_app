<script setup>
import deleteLottery from "@/graphql/lottery/delete.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue", "deleteDone"]);

const props = defineProps({
  lottery: {
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
const { mutate, onDone, loading, onError } = mutator(deleteLottery, {
  clientId: "auth",
  showError: false,
});

// Mutation response handler
onDone(({ data }) => {
  const affected = data?.delete_lotteries_by_pk?.id;
  if (affected) {
    toast.success("ሎተሪው ጠፋቱዋል", { position: "top-right" });
    emit("deleteDone");
  } else {
    toast.error("ሎተሪውን ማጥፋት አልተሳካም።", {
      position: "top-right",
    });
  }
  open.value = false;
});

onError(() => {
  toast.error("ስህተት ተከስቷል። እባክዎን ደግመው ይሞክሩ።", { position: "top-right" });
  open.value = false;
});

// Delete handler
const handleDelete = (confirmed) => {
  if (!confirmed) {
    open.value = false;
    return;
  }
  mutate({
    id: props.lottery?.id,
  });
};
</script>

<template>
  <BaseConfirmation
    v-model="open"
    confirm-button="አጥፋ"
    :description="`እርግጠኛ ነህ ሎተሪውን ማጥፋት ይፈልጋሉ? ይህ እርምጃ ወደ ኋላ የለም።`"
    title="ሎተሪ አጥፋ"
    icon="uil:trash"
    icon-class="text-danger-light dark:text-danger-dark text-2xl"
    confirm-title="ጠፋቱዋል"
    confirm-msg="ሎተሪው በትክክል ጠፋቱዋል።"
    cancel-msg="ሎተሪ ማጥፋት ጠፋቱዋል።"
    @confirm="handleDelete"
    :loading="loading"
  />
</template>
