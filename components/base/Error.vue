<template>
  <div class="px-4 flex justify-center">
    <div class="flex flex-col items-center text-center max-w-md py-6">
      <!-- Icon -->
      <i class="mdi mdi-alert-circle-outline text-red-500 text-6xl"></i>

      <!-- Title -->
      <h2 class="mt-4 text-lg font-bold">ስህተት ተከስቷል</h2>

      <!-- Error message -->
      <p class="mt-2 text-gray-500">{{ errorMessage }}</p>

      <!-- Retry button -->
      <button
        v-if="showRetry"
        @click="retry"
        class="mt-4 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        እንደገና ይሞክሩ
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  errorMessage: {
    type: String,
    default: "እባክዎን ኢንተርኔቱን ያረጋግጡ እና ደግመው ይሞክሩ",
  },
  showRetry: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["retry"]);

const retry = () => {
  emit("retry");
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css");
</style>
