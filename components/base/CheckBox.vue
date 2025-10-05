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

// Sync with parent `modelValue`
watch(
  () => props.modelValue,
  (newVal) => {
    checkbox.value = newVal || false;
  }
);

// Emit update when checkbox changes
watch(
  () => checkbox.value,
  (newVal) => {
    emit("update:modelValue", newVal);
  }
);
</script>

<template>
  <div>
    <!-- Top spacer -->
    <div class="text-md" v-if="!props.hideDetails">&nbsp;</div>

    <div class="relative flex items-center">
      <div class="flex items-center h-5">
        <input
          v-model="checkbox"
          :id="name"
          :aria-describedby="name"
          :name="name"
          :type="type"
          :class="[
            'rounded text-md focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark',
            'text-primary-light dark:text-primary-dark',
            'border-borderColor-light dark:border-borderColor-dark',
            props.class,
          ]"
        />
      </div>

      <div class="ml-3 text-md">
        <!-- Label -->
        <label
          :for="name"
          :class="[
            'cursor-pointer',
            'text-textPrimary-light dark:text-textPrimary-dark',
          ]"
          v-if="type !== 'radio'"
        >
          {{ props.label }}
        </label>
        <label
          :class="['text-textPrimary-light dark:text-textPrimary-dark']"
          v-else
        >
          {{ props.label }}
        </label>

        <!-- Description -->
        <p
          v-if="props.description"
          id="name"
          class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
        >
          {{ props.description }}
        </p>
      </div>
    </div>
  </div>
</template>
