<template>
  <div>
    <!-- <div v-for="n in 50" :key="n" class="p-4 border">Item {{ n }}</div> -->
    <div ref="observerRef" class="w-full h-1"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

const emit = defineEmits(["reach-bottom"]);
const observerRef = ref(null);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        emit("reach-bottom");
      }
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0, // <= less strict
    }
  );

  if (observerRef.value) {
    observer.observe(observerRef.value);
  }
});

onBeforeUnmount(() => {
  if (observer && observerRef.value) {
    observer.unobserve(observerRef.value);
  }
});
</script>
