<script setup>
import { useField } from "vee-validate";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: [String, Number],
  name: { type: String, required: true },
  id: String,
  type: { type: String, default: "text" },
  maxlength: { type: Number, default: 400 },
  placeholder: String,
  label: String,
  labelClass: { type: String, default: "" },
  trailingIcon: Function,
  rows: { type: Number, default: 6 },
  rules: { type: String, default: "" },
  placeholderStyle: { type: String, default: "" },
  showLength: { type: Boolean, default: false },
});

const { errorMessage, value: inputValue } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const set = (event) => {
  emit("update:modelValue", event.target.value);
};

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);
</script>

<template>
  <div>
    <!-- Label -->
    <div class="mb-2 flex gap-2">
      <slot name="label" />
      <label
        v-if="props.label"
        :for="props.id || ''"
        :class="[
          props.labelClass,
          'text-textPrimary-light dark:text-textPrimary-dark text-sm',
        ]"
      >
        {{ props.label }}
        <span
          v-if="
            typeof rules === 'object'
              ? Object.hasOwn(rules, 'required')
              : rules.includes('required')
          "
          class="text-red-600 dark:text-red-400"
          >*</span
        >
      </label>
    </div>

    <!-- Textarea -->
    <div class="mt-1 relative rounded-md shadow-sm">
      <textarea
        v-model="inputValue"
        @input="set($event)"
        :type="type"
        :name="name"
        :rows="rows"
        :maxlength="maxlength"
        :id="id"
        :placeholder="placeholder"
        :class="[
          errorMessage
            ? 'border-red-500 dark:border-red-400'
            : 'border border-borderColor-light dark:border-borderColor-dark focus:border-primary-light dark:focus:border-primary-dark',
          placeholderStyle ||
            'placeholder-textSecondary-light dark:placeholder-textSecondary-dark text-sm',
        ]"
        class="block w-full rounded-md bg-card-light dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark font-body text-base focus:outline-none p-3 transition-colors disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed scroll-bar"
        aria-invalid="true"
        aria-describedby="email-error"
      />

      <!-- Character Counter -->
      <p
        v-if="showLength"
        class="absolute right-0 mt-2 text-sm text-textSecondary-light dark:text-textSecondary-dark"
        id="char-count"
      >
        {{ (inputValue?.length || 0) + "/" + maxlength }} &nbsp;
      </p>
    </div>

    <!-- Error Message -->
    <p
      v-if="errorMessage"
      :class="errorMessage ? 'h-5' : 'h-0'"
      class="mt-2 text-sm text-red-600 dark:text-red-400"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
