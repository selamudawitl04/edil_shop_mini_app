<template>
  <div
    :class="[
      'relative w-full overflow-hidden rounded-full bg-primary-light/10',
      height,
    ]"
  >
    <div
      class="absolute h-full bg-primary-light dark:bg-primary-dark rounded-full animate-loader"
      :class="barClass"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  height: { type: String, default: "h-1" },
  barClass: { type: String, default: "w-1/3" }, // Width of the moving bar
});
</script>

<style scoped>
@keyframes loader {
  0% {
    left: -33%;
  }
  50% {
    left: 50%;
  }
  100% {
    left: 100%;
  }
}
.animate-loader {
  position: absolute;
  animation: loader 1.2s ease-in-out infinite;
}
</style>
