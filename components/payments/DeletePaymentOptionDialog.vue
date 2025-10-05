<script setup>
import updateUserPaymentOption from "@/graphql/payments/update_user_payment_option.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue", "updated"]);

const props = defineProps({
  modelValue: Boolean,
  paymentOption: {
    type: Object,
    required: true,
  },
});

// Open state
const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const refetchUserPaymentOptions = inject("refetchUserPaymentOptions");

const { mutate, onDone, loading, onError } = mutator(updateUserPaymentOption, {
  clientId: "auth",
  showError: false,
});

// Submit handler
const onSubmit = () => {
  const input = {
    is_deleted: true,
  };

  mutate({
    id: props.paymentOption.id,
    input,
  });
};

onDone(({ data }) => {
  if (data?.update_user_payment_options_by_pk?.id) {
    toast.success("የክፍያ አማራጭ ተሰርዟል!", {
      position: "top-right",
    });

    if (typeof refetchUserPaymentOptions === "function") {
      refetchUserPaymentOptions();
    }

    open.value = false;
  } else {
    toast.error("የክፍያ አማራጭ ማጥፋት አልተሳካም!", {
      position: "top-right",
    });
  }
});

onError((error) => {
  toast.error(error.message, {
    position: "top-right",
  });
});
</script>

<template>
  <!-- Delete Confirmation Dialog -->
  <BaseDialog v-model="open" title="ክፍያ አማራጭ ማጥፋት" :autoClose="false">
    <template #content>
      <div class="text-center py-4">
        <Icon
          name="mdi:alert-circle"
          class="w-16 h-16 text-red-500 mx-auto mb-4"
        />
        <h3
          class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
        >
          እርግጠኛ ነዎት?
        </h3>
        <p class="text-textSecondary-light dark:text-textSecondary-dark mb-6">
          ይህን የክፍያ አማራጭ ማጥፋት ይፈልጋሉ
        </p>
        <div class="flex gap-3 justify-center">
          <BaseButton @click="open = false" variant="secondary">
            ተወው
          </BaseButton>
          <BaseButton @click="onSubmit" variant="danger" :loading="loading">
            አጥፋ
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
