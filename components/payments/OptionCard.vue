<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <!-- Bank Icon -->
        <span class="text-2xl">🏦</span>
        <h3
          class="text-lg font-bold text-textPrimary-light dark:text-textPrimary-dark"
        >
          {{ paymentOption.payment_option.name }}
        </h3>
      </div>
    </div>

    <!-- Account Details -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span
          class="text-sm flex items-center gap-1 text-textSecondary-light dark:text-textSecondary-dark"
        >
          💳 የመለያ ቁጥር
        </span>
        <span
          class="font-mono text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark"
        >
          {{ paymentOption.account_number }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <span
          class="text-sm flex items-center gap-1 text-textSecondary-light dark:text-textSecondary-dark"
        >
          👤 የመለያ ስም
        </span>
        <span
          class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark"
        >
          {{ paymentOption.account_name }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div
      class="flex gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-600"
    >
      <button
        @click.stop="editOption"
        class="flex-1 px-3 py-2 text-sm font-medium border rounded-lg text-primary-light border-primary-light hover:bg-primary-light hover:text-white transition-colors flex items-center justify-center gap-1"
      >
        <Icon name="mdi:pencil" class="w-4 h-4" />
        አሻሽል
      </button>
      <button
        @click.stop="deleteOption"
        class="flex-1 px-3 py-2 text-sm font-medium border rounded-lg text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-1"
      >
        <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
        ሰርዝ
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  paymentOption: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete", "edit"]);

const deleteOption = () => {
  emit("delete", props.paymentOption);
};

const editOption = () => {
  emit("edit", props.paymentOption);
};
</script>
