<script setup>
import addUserPaymentOption from "@/graphql/payments/add_user_payment_option.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue", "updated"]);

const props = defineProps({
  modelValue: Boolean,
});

const form = reactive({
  account_name: "",
  account_number: "",
  payment_option_id: "",
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

const { mutate, onDone, loading, onError } = mutator(addUserPaymentOption, {
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
    input,
  });
});

onDone(({ data }) => {
  if (data?.insert_user_payment_options_one?.id) {
    toast.success("የክፍያ መንገድ ተመዝግቧል!", {
      position: "top-right",
    });

    emit("updated", data.insert_user_payment_options_one);

    open.value = false;
  } else {
    toast.error("የክፍያ መንገድ መመዝገብ አልተሳካም!", {
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
    title="የክፍያ መንገድ መመዝገቢያ"
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
            ✅ የክፍያ መንገድ መዝገብ
          </BaseButton>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>
