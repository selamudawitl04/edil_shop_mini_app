<script setup>
import { useField } from "vee-validate";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps({
  modelValue: [String, Number],
  name: { type: String, required: true },
  id: String,
  type: { type: String, default: "text" },
  placeholder: String,
  label: String,
  rules: {
    type: [String, Object],
    default: "",
    required: false,
  },
  disabled: Boolean,
  class: String,
  iconLeadingClass: String,
  placeholderStyle: String,
  trailingIcon: String,
  leadingIcon: String,
  mainDiv: String,
  inputStyle: String, // 🆕 Added inputStyle prop
  hint: String,
});

const emit = defineEmits(["update:modelValue"]);

const { errorMessage, value: inputValue } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const inputType = ref(props.type);

const updateValue = useDebounceFn((event) => {
  emit("update:modelValue", event.target.value);
});

const togglePassword = () => {
  inputType.value = inputType.value === "password" ? "text" : "password";
};

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = props.type === "number" ? Number(newVal) : newVal;
  }
);
</script>

<template>
  <div :class="mainDiv">
    <div class="mb-2">
      <slot name="label" />
      <label
        class="text-textPrimary-light dark:text-textPrimary-dark text-sm"
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
    <div class="relative group">
      <input
        v-model="inputValue"
        @input="updateValue"
        :type="inputType"
        :id="id"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-3 py-2 text-sm rounded-md shadow-sm font-body focus:outline-none bg-card-light dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark disabled:cursor-not-allowed disabled:opacity-60 border transition-all duration-200 focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark dark:border-borderColor-dark border-borderColor-light"
        :class="[
          placeholderStyle,
          errorMessage ? 'border-danger dark:border-danger' : '',
          trailingIcon || inputType === 'password' ? 'pr-10' : '',
          inputStyle, // 🆕 Inject custom style
        ]"
      />

      <!-- Password toggle -->
      <div
        v-if="type === 'password'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm cursor-pointer"
        @click="togglePassword"
      >
        <Icon
          :name="inputType === 'password' ? 'mdi:eye-off' : 'mdi:eye'"
          class="w-5 h-5 text-textSecondary-light dark:text-textSecondary-dark"
        />
      </div>

      <!-- Custom trailing icon (optional override) -->
      <div
        v-if="trailingIcon && type !== 'password'"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <Icon :name="trailingIcon" class="w-5 h-5 text-gray-400" />
      </div>
    </div>

    <p
      v-if="hint"
      class="text-xs text-textSecondary-light dark:text-textSecondary-dark font-medium mt-1"
    >
      {{ hint }}
    </p>

    <!-- Validation Error -->
    <transition name="fade">
      <p
        v-if="errorMessage"
        class="mt-1 text-xs text-danger-light dark:text-danger-dark font-medium"
        id="input-error"
      >
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

input[type="date"],
input[type="time"],
input[type="datetime-local"] {
  position: relative;
  padding-right: 2rem; /* space for custom icon */
}

/* Hide default icons */
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator,
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  cursor: pointer;
}

/* Custom icon */
input[type="date"]::after {
  content: "📅"; /* or use SVG */
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* so clicks still open picker */
  color: red; /* your color */
}

input[type="time"]::after,
input[type="datetime-local"]::after {
  content: "⏰";
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: blue;
}
</style>
