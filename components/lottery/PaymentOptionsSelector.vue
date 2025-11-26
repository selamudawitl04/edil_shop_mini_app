<script setup>
import { computed } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Object, // now stores only ONE selected payment option
    default: null,
  },
  lottery: {
    type: Object,
    required: true,
  },
});

// Create computed modelValue binding
const selectedPaymentOption = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Map payment options from the lottery object
const paymentOptions = computed(() => {
  return props.lottery.payment_options.map((option) => ({
    id: option.id,
    name: option.user_payment_option?.payment_option?.name || "—",
    account_name: option.user_payment_option?.account_name || "—",
    account_number: option.user_payment_option?.account_number || "—",
  }));
});

// Handle selection — only one at a time
const selectPaymentOption = (paymentOption) => {
  if (selectedPaymentOption.value?.id === paymentOption.id) {
    selectedPaymentOption.value = null; // unselect if clicked again
  } else {
    selectedPaymentOption.value = paymentOption;
  }
};

// Check if this option is selected
const isSelected = (paymentOption) =>
  selectedPaymentOption.value?.id === paymentOption.id;
</script>

<template>
  <div class="bg-white rounded-lg space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-bold">የመክፈያ ዘዴ ይምረጡ</h2>
    </div>

    <!-- Payment Options List -->
    <div class="space-y-3">
      <div
        v-for="paymentOption in paymentOptions"
        :key="paymentOption.id"
        class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
        @click="selectPaymentOption(paymentOption)"
      >
        <!-- Radio Button -->
        <input
          type="radio"
          name="payment-option"
          :value="paymentOption.id"
          :checked="isSelected(paymentOption)"
          class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 mr-4"
          @click.stop="selectPaymentOption(paymentOption)"
        />

        <!-- Payment Option Details -->
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 truncate">
            {{ paymentOption.name }}
          </h3>

          <div class="mt-1 space-y-1">
            <p class="text-sm text-gray-600">
              <span class="font-medium">ስም:</span>
              {{ paymentOption.account_name }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Account:</span>
              {{ paymentOption.account_number }}
            </p>
          </div>
        </div>

        <!-- Selection Indicator -->
        <Icon
          v-if="isSelected(paymentOption)"
          name="mdi:check-circle"
          class="w-6 h-6 text-green-500 ml-3"
        />
      </div>
    </div>
  </div>
</template>
