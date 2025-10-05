<script setup>
import deleteTicket from "@/graphql/lottery/delete_ticket.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue", "deleteDone"]);

const props = defineProps({
  ticket: {
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
const { mutate, onDone, loading, onError } = mutator(deleteTicket, {
  clientId: "auth",
  showError: false,
});

// Mutation response handler
onDone(({ data }) => {
  const affected = data?.delete_tickets_by_pk?.id;
  if (affected) {
    toast.success("ትኬቱ ጠፋቷል! bbbbbbb", { position: "top-right" });
    emit("deleteDone");
  } else {
    toast.error("ትኬቱን ማጥፋት አልተሳካም።", {
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
    id: props.ticket?.id,
  });
};
</script>

<template>
  <BaseConfirmation
    v-model="open"
    confirm-button="አጥፋ"
    :description="`እርግጠኛ ነህ ትኬቱን ማጥፋት ይፈልጋሉ? ይህ እርምጃ ወደ ኋላ የለም።`"
    title="ትኬት አጥፋ"
    icon="uil:trash"
    icon-class="text-danger-light dark:text-danger-dark text-2xl"
    confirm-title="ጠፋቷል"
    confirm-msg="ትኬቱ በትክክል ጠፋቷል።"
    cancel-msg="ትኬት ማጥፋት ተቋርጧል።"
    @confirm="handleDelete"
    :loading="loading"
  />
</template>
