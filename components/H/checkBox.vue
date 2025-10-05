<script setup>
import { watch, ref } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: [Boolean, String],
    default: false,
  },
  name: String,
  label: String,
  description: String,
  hideDetails: Boolean,
  class: String,
  type: {
    type: String,
    default: "checkbox",
  },
  rules: String,
});

const checkbox = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    checkbox.value = newVal || false;
  }
);

watch(
  () => checkbox.value,
  (newVal) => {
    emit("update:modelValue", newVal);
  }
);
</script>
<template>
  <div>
    <div class="text-md" v-if="!props.hideDetails">&nbsp;</div>
    <div class="relative flex items-center">
      <div class="flex items-center h-5">
        <input
          v-model="checkbox"
          :id="name"
          :aria-describedby="name"
          :name="name"
          :type="type"
          class="focus:ring-new-tale text-new-tale border-new-tale rounded text-md"
          :class="props.class"
        />
      </div>
      <div class="ml-3 text-md">
        <label
          :for="name"
          class="text-gray-900 cursor-pointer"
          v-if="type != 'radio'"
        >
          {{ props.label }}
        </label>
        <label class="text-gray-900" v-else>
          {{ props.label }}
        </label>
        <p v-if="props.description" id="name" class="text-gray-600 text-sm">
          {{ props.description }}
        </p>
      </div>
    </div>
  </div>
</template>
