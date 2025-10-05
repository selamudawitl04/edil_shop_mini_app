<template>
  <div class="overflow-hidden whitespace-nowrap w-full">
    <div
      class="inline-block animate-marquee text-sm"
      :style="{ animationDuration: duration + 's' }"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 10, // seconds for one loop
  },
});
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  display: inline-block;
  white-space: nowrap;
  animation-name: marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
