<template>
  <NuxtLayout name="app">
    <section
      class="container p-3 lg:py-8 lg:px-4 min-h-screen max-w-6xl space-y-6"
    >
      <!-- Header -->
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1
            class="text-3xl font-bold text-textPrimary-light dark:text-textPrimary-dark"
          >
            የክፍያ አማራጮች
          </h1>
          <p class="text-textSecondary-light dark:text-textSecondary-dark mt-1">
            የክፍያ መለያዎችዎን ያስተዳድሩ
          </p>
        </div>

        <BaseButton
          @click="openAddDialog"
          size="lg"
          :full="false"
          class="bg-primary hover:bg-primary-dark text-white"
        >
          <Icon name="mdi:plus" class="w-5 h-5 mr-2" />
          አዲስ ክፍያ አማራጭ ጨምር
        </BaseButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-96">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        ></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <Icon
          name="mdi:alert-circle"
          class="w-16 h-16 text-red-500 mx-auto mb-4"
        />
        <h2
          class="text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-4"
        >
          ስህተት ተከስቷል
        </h2>
        <p class="text-textSecondary-light dark:text-textSecondary-dark mb-4">
          {{ error }}
        </p>
        <BaseButton @click="refetch" variant="primary"> እንደገና ሞክር </BaseButton>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!paymentOptions || paymentOptions.length === 0"
        class="text-center py-12"
      >
        <Icon
          name="mdi:wallet-outline"
          class="w-16 h-16 text-textSecondary-light dark:text-textSecondary-dark mx-auto mb-4"
        />
        <h2
          class="text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-4"
        >
          የክፍያ አማራጮች የሉም
        </h2>
        <p class="text-textSecondary-light dark:text-textSecondary-dark mb-6">
          የክፍያ መለያዎችዎን ለመጨመር ከዚህ ጀምሩ
        </p>
        <BaseButton
          @click="openAddDialog"
          size="lg"
          class="bg-primary hover:bg-primary-dark text-white"
        >
          <Icon name="mdi:plus" class="w-5 h-5 mr-2" />
          የመጀመሪያ ክፍያ አማራጭ ጨምር
        </BaseButton>
      </div>

      <!-- Payment Options Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PaymentsOptionCard
          v-for="option in paymentOptions"
          :key="option.id"
          :payment-option="option"
          @edit="editOption"
          @delete="deleteOption"
        />
      </div>
    </section>

    <!-- Add/Edit Payment Option Dialog -->
    <PaymentsAddPaymentOptionDialog
      v-if="showAddDialog"
      v-model="showAddDialog"
      @updated="handlePaymentOptionSaved"
    />
    <!-- Delete Payment Option Dialog -->
    <PaymentsDeletePaymentOptionDialog
      v-if="showDeleteDialog"
      v-model="showDeleteDialog"
      :payment-option="deletingOption"
    />

    <!-- Update Payment Option Dialog -->
    <PaymentsUpdatePaymentOptionDialog
      v-if="showUpdateDialog"
      v-model="showUpdateDialog"
      :payment-option="editingOption"
    />
  </NuxtLayout>
</template>

<script setup>
import getUserPaymentOptionsQuery from "@/graphql/payments/user_payment_options.gql";

// State
const paymentOptions = ref([]);
const error = ref(null);
const showAddDialog = ref(false);
const showDeleteDialog = ref(false);
const showUpdateDialog = ref(false);
const editingOption = ref(null);
const deletingOption = ref(null);

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

onResult(({ data }) => {
  if (data?.user_payment_options) {
    paymentOptions.value = data.user_payment_options;
  }
});

onError((err) => {
  error.value = err.message || "የክፍያ አማራጮች ማግኘት አልተሳካም";
});

provide("refetchUserPaymentOptions", refetch);

const openAddDialog = () => {
  editingOption.value = null;
  showAddDialog.value = true;
};

const editOption = (option) => {
  editingOption.value = option;
  showUpdateDialog.value = true;
};

const deleteOption = (option) => {
  deletingOption.value = option;
  showDeleteDialog.value = true;
};

const handlePaymentOptionSaved = (savedOption) => {
  paymentOptions.value.unshift(savedOption);
};
</script>
