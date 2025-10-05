<script setup>
const emit = defineEmits(["update:modelValue"]);
import { useField } from "vee-validate";

const props = defineProps({
  id: String,
  name: String,
  items: {
    type: Array,
    required: true,
  },
  label: String,
  labelClass: String,

  modelValue: {
    type: Array,
    required: true,
  },
  rules: {
    type: [String, Array],
    default: "",
  },
});

const { errorMessage, value: inputValue } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const selectedItems = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val);
    inputValue.value = val;
  },
});
</script>

<template>
  <div>
    <!-- Label -->

    <div class="mb-2">
      <slot name="label" />
      <label
        class="text-textPrimary-light dark:text-textPrimary-dark text-sm"
        :class="labelClass"
        v-if="props.label"
        :for="props.id || ''"
      >
        {{ props.label }}
        <span
          class="text-red-600 dark:text-red-400"
          v-if="
            typeof rules === 'object'
              ? Object.hasOwn(rules, 'required')
              : rules.includes('required')
          "
          >*</span
        >
      </label>
    </div>

    <div class="flex flex-wrap gap-2">
      <label
        v-for="item in items"
        :key="item.value"
        class="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border transition bg-card-light dark:bg-card-dark border-borderColor-light dark:border-borderColor-dark hover:border-primary-light dark:hover:border-primary-dark"
      >
        <!-- Hidden checkbox input -->
        <input
          type="checkbox"
          :value="item.value"
          v-model="selectedItems"
          class="peer hidden"
        />

        <!-- Custom styled checkbox box -->
        <span
          class="w-5 h-5 rounded-md border-2 flex items-center justify-center border-borderColor-light dark:border-borderColor-dark peer-checked:bg-primary-light dark:peer-checked:bg-primary-dark peer-checked:border-primary-light dark:peer-checked:border-primary-dark transition-colors"
        >
          <!-- Check icon -->
          <svg
            class="w-3 h-3 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
            v-if="selectedItems.includes(item.value)"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>

        <!-- Label text -->
        <span class="text-sm text-textPrimary-light dark:text-textPrimary-dark">
          {{ item.name }}
        </span>
      </label>
    </div>

    <!-- Validation Error -->
    <p
      v-if="errorMessage"
      class="mt-1 text-sm font-body text-red-600 dark:text-red-400"
      id="email-error"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
