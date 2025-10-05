<script setup>
import updateUserPaymentOption from "@/graphql/payments/update_user_payment_option.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue", "updated"]);

const props = defineProps({
  modelValue: Boolean,
  paymentOption: {
    type: Object,
    required: true,
  },
});

const form = reactive({
  account_name: props.paymentOption.account_name,
  account_number: props.paymentOption.account_number,
  payment_option_id: props.paymentOption.payment_option_id,
});
// Open state
const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
    if (!val) {
      form.account_name = "";
      form.account_number = "";
      form.payment_option_id = "";
    }
  },
});

const { mutate, onDone, loading, onError } = mutator(updateUserPaymentOption, {
  clientId: "auth",
  showError: false,
});

// Submit handler
const onSubmit = handleSubmit(() => {
  const input = {
    account_name: form.account_name,
    account_number: form.account_number,
    payment_option_id: form.payment_option_id,
  };

  mutate({
    id: props.paymentOption.id,
    input,
  });
});

onDone(({ data }) => {
  if (data?.update_user_payment_options_by_pk?.id) {
    toast.success("የክፍያ መንገድ ማስተካከያ ተመዝግቧል!", {
      position: "top-right",
    });
    props.paymentOption.account_name = form.account_name;
    props.paymentOption.account_number = form.account_number;

    open.value = false;
  } else {
    toast.error("የክፍያ መንገድ ማስተካከያ አልተሳካም!", {
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
  <BaseDialog
    v-model="open"
    title="የክፍያ መንገድ ማስተካከያ"
    :autoClose="false"
    bodyClass="max-w-lg"
  >
    <template #content>
      <div class="max-w-lg mx-auto">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <SelectPaymentOption
            v-model="form.payment_option_id"
            label="የክፍያ መንገድ"
            rules="required"
            showLabel
            :disabled="true"
          />

          <BaseInput
            v-model="form.account_name"
            label="👤 የAccount ስም"
            :placeholder="`ስም ያስገቡ`"
            id="account_name"
            name="account_name"
            type="text"
            rules="required"
          />

          <BaseInput
            v-model="form.account_number"
            label="🔢 የAccount ቁጥር"
            :placeholder="`ቁጥር ያስገቡ`"
            id="account_number"
            name="account_number"
            type="text"
            rules="required"
          />

          <!-- Submit -->
          <BaseButton
            type="submit"
            :full="true"
            size="lg"
            :loading="loading"
            :disabled="loading"
            class="bg-green-600 hover:bg-green-700 text-white"
          >
            ✅ የክፍያ መንገድ አስተካኪል
          </BaseButton>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>
