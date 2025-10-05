<script setup>
import getUserPaymentOptionsQuery from "@/graphql/payments/user_payment_options.gql";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const selectedPaymentOptions = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const filter = ref({
  is_deleted: {
    _eq: false,
  },
});

// GraphQL query
const { onResult, onError, refetch, loading } = queryList(
  getUserPaymentOptionsQuery,
  {
    filter: filter,
    order_by: [{ created_at: "desc" }],
    limit: 100,
    offset: 0,
    clientId: "auth",
  }
);

const paymentOptions = ref([]);
const error = ref(null);

onResult(({ data }) => {
  if (data?.user_payment_options) {
    paymentOptions.value = data.user_payment_options;
  }
});

onError((err) => {
  error.value = err.message || "የክፍያ አማራጮች ማግኘት አልተሳካም";
});

const togglePaymentOption = (paymentOption) => {
  const index = selectedPaymentOptions.value.findIndex(
    (option) => option.id === paymentOption.id
  );
  
  if (index > -1) {
    // Remove if already selected
    selectedPaymentOptions.value.splice(index, 1);
  } else {
    // Add if not selected
    selectedPaymentOptions.value.push(paymentOption);
  }
};

const isSelected = (paymentOption) => {
  return selectedPaymentOptions.value.some(
    (option) => option.id === paymentOption.id
  );
};
</script>

<template>
  <div class="bg-white rounded-lg space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">የክፍያ አማራጮች ({{ selectedPaymentOptions.length }} የተመረጡ)</h2>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <Icon name="mdi:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-600 mb-4">{{ error }}</p>
      <BaseButton @click="refetch" variant="primary" size="sm">እንደገና ሞክር</BaseButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="!paymentOptions || paymentOptions.length === 0" class="text-center py-8">
      <Icon name="mdi:wallet-outline" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 mb-4">የክፍያ አማራጮች የሉም</p>
      <NuxtLink to="/payment-options" class="text-primary hover:underline">
        የክፍያ አማራጮች ጨምር
      </NuxtLink>
    </div>

    <!-- Payment Options List -->
    <div v-else class="space-y-3">
      <div
        v-for="paymentOption in paymentOptions"
        :key="paymentOption.id"
        class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        @click="togglePaymentOption(paymentOption)"
      >
        <!-- Checkbox -->
        <div class="flex-shrink-0 mr-4">
          <input
            type="checkbox"
            :checked="isSelected(paymentOption)"
            class="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            @click.stop="togglePaymentOption(paymentOption)"
          />
        </div>

        <!-- Payment Option Details -->
        <div class="flex-1 min-w-0">
          <!-- Title: Payment Option Name -->
          <h3 class="text-lg font-semibold text-gray-900 truncate">
            {{ paymentOption.payment_option.name }}
          </h3>
          
          <!-- Subtitle: Account Name and Number -->
          <div class="mt-1 space-y-1">
            <p class="text-sm text-gray-600">
              <span class="font-medium">የመለያ ስም:</span> {{ paymentOption.account_name }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">የመለያ ቁጥር:</span> {{ paymentOption.account_number }}
            </p>
          </div>
        </div>

        <!-- Selection Indicator -->
        <div class="flex-shrink-0 ml-4">
          <Icon
            v-if="isSelected(paymentOption)"
            name="mdi:check-circle"
            class="w-6 h-6 text-green-500"
          />
          <Icon
            v-else
            name="mdi:circle-outline"
            class="w-6 h-6 text-gray-300"
          />
        </div>
      </div>
    </div>

    <!-- Selected Options Summary -->
    <div v-if="selectedPaymentOptions.length > 0" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h4 class="text-sm font-medium text-green-800 mb-2">የተመረጡ የክፍያ አማራጮች:</h4>
      <div class="space-y-1">
        <div
          v-for="option in selectedPaymentOptions"
          :key="option.id"
          class="text-sm text-green-700"
        >
          • {{ option.payment_option.name }} - {{ option.account_name }}
        </div>
      </div>
    </div>
  </div>
</template>
