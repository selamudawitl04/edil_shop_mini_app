<template>
  <BaseCategorySelection
    v-model="selectedCategories"
    header="Page Categories"
    description="Choose the areas that best reflect your page's spiritual focus and prayer intentions. You can select up to 5 categories per group."
    :max-per-group="5"
  />
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const selectedCategories = ref(props.modelValue || []);

// Watch for changes and emit
watch(selectedCategories, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  selectedCategories.value = newValue || [];
}, { immediate: true });
</script> 