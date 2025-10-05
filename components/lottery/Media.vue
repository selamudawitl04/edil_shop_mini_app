<script setup>
import { computed } from "vue";

const props = defineProps({
  lottery: {
    type: Object,
    required: true,
  },
});

// Check category
const hasItems = computed(() => props.lottery.items?.length > 0);
const isMoneyCategory = computed(
  () => hasItems.value && props.lottery.items[0].category?.id === "ገንዘብ"
);

// Pick featured media
const media = computed(() => {
  if (props.lottery.medias?.length > 0) {
    return (
      props.lottery.medias.find((m) => m.is_featured) || props.lottery.medias[0]
    );
  }
  return null;
});

const imageUrl = computed(() => media.value?.url || null);
</script>

<template>
  <!-- Money Category -->
  <div
    v-if="isMoneyCategory"
    class="h-full rounded-t-2xl shadow-md relative flex items-center justify-center bg-gradient-to-br from-green-900 to-emerald-600"
  >
    <div class="flex flex-col items-center text-center">
      <!-- Circle badge -->
      <div
        class="rounded-full shadow-lg bg-gradient-to-br from-white to-amber-400 flex items-center justify-center px-6 py-5"
      >
        <span class="text-green-900 font-extrabold text-lg">ብር</span>
      </div>

      <div class="mt-5 text-white">
        <p class="text-xl font-bold text-white">
          {{ hasItems ? lottery.items[0].title + " ብር" : "ገንዘብ" }}
        </p>
        <p class="text-sm text-white font-semibold mt-2">የገንዘብ እጣ</p>
      </div>
    </div>
  </div>

  <!-- Normal Category -->
  <div v-else class="h-full rounded-t-2xl overflow-hidden">
    <img
      v-if="imageUrl"
      :src="imageUrl"
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
