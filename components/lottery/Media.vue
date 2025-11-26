<script setup>
import { computed } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const money = computed(() => {
  const title = props.item.title;

  // Find the first number inside the title
  const match = title.match(/\d+/);

  if (!match) return title; // no number found

  const num = Number(match[0]);
  const formatted = num.toLocaleString(); // → 15000 → 15,000

  // Replace the original number with the formatted one
  return title.replace(match[0], formatted);
});

const isMoneyCategory = computed(() => props.item.category?.id === "ገንዘብ");
</script>

<template>
  <!-- Money Category -->
  <div
    v-if="isMoneyCategory"
    class="h-full rounded-t-2xl shadow-md relative flex items-center justify-center bg-[url(/money-placeholder.jpg)] bg-cover bg-center bg-no-repeat"
  >
    <div class="flex flex-col items-center text-center">
      <!-- Circle badge -->
      <!-- <div
        class="rounded-full shadow-lg bg-gradient-to-br from-white to-amber-400 flex items-center justify-center px-6 py-5"
      >
        <span class="text-green-900 font-extrabold text-lg">ብር</span>
      </div> -->

      <div class="mt-5 bg-white/80 p-4 rounded-lg">
        <p class="text-4xl font-bold text-primary-light leading-none">
          {{ money }} ብር
        </p>
      </div>
    </div>
  </div>

  <!-- Normal Category -->
  <div v-else class="h-full rounded-t-2xl overflow-hidden">
    <img
      v-if="item.cover_image"
      :src="item.cover_image"
      class="w-full h-full object-cover"
      @error="$event.target.src = ''"
    />
    <div
      v-else
      class="w-full h-full bg-gray-300 flex items-center justify-center"
    >
      <Icon name="mdi:broken-image" class="w-10 h-10 text-gray-500" />
    </div>
  </div>
</template>
