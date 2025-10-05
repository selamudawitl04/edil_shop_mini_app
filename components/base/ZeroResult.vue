<script setup>
const props = defineProps({
  message: {
    type: String,
    default: "ምንም ውጤት አልተገኘም", // Default: "No results found"
  },
});
</script>

<template>
  <div class="h-[300px] px-4 flex items-center justify-center">
    <div class="flex flex-col items-center text-center">
      <!-- Icon -->
      <Icon name="mdi:magnify-remove-outline" class="w-16 h-16 text-gray-400" />

      <!-- Message -->
      <p class="mt-4 text-gray-500 text-base">
        {{ message }}
      </p>
    </div>
  </div>
</template>
