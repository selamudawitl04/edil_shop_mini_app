<script setup>
import { useField } from "vee-validate";

const props = defineProps({
  modelValue: [String, Number, Boolean],
  name: { type: String, required: true },
  id: String,
  type: { type: String, default: "text" },
  placeholder: String,
  label: String,
  rules: [String, Object],
  disabled: Boolean,
  class: String,
  iconLeadingClass: String,
  placeholderStyle: String,
  trailingIcon: String,
  leadingIcon: String,
  mainDiv: String,
});

const emit = defineEmits(["update:modelValue"]);

const { errorMessage, value: inputValue } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const inputType = ref(props.type);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};

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
    <div
      v-if="label"
      class="mb-1 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
    >
      {{ label }}
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
        class="w-full px-4 py-2 text-sm rounded-md shadow-sm font-body focus:outline-none bg-white dark:bg-background-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-gray-400 disabled:cursor-not-allowed disabled:opacity-60 border transition-all duration-200 focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark dark:border-borderColor-dark border-borderColor-light"
        :class="[
          placeholderStyle,
          errorMessage ? 'border-danger dark:border-danger' : '',
          trailingIcon || inputType === 'password' ? 'pr-10' : '',
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

    <!-- Validation Error -->
    <transition name="fade">
      <p
        v-if="errorMessage"
        class="mt-1 text-xs text-danger font-medium"
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
</style>
