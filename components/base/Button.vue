<template>
  <button :type="type" :class="buttonClasses" :disabled="disabled || loading">
    <svg
      v-if="loading"
      class="w-4 h-4 animate-spin mr-2"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  full: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  type: { type: String, default: "submit" },
  loadingText: { type: String, default: "Loading..." },
});

const buttonClasses = computed(() => {
  let classes = [
    "inline-flex items-center justify-center font-medium transition-colors duration-200",
    props.full ? "w-full" : "",
    props.disabled || props.loading
      ? "opacity-50 cursor-not-allowed"
      : "hover:brightness-105",
  ];

  // Variant styles (all variants get rounded-xl now)
  classes.push(
    props.variant === "orange"
      ? "bg-orange-500 text-white rounded-xl px-6 py-3 hover:bg-orange-600 transition-colors shadow-lg"
      : props.variant === "secondary"
      ? "bg-neutral-light dark:bg-neutral-dark text-white rounded-xl"
      : props.variant === "danger"
      ? "bg-danger-light dark:bg-danger-dark text-white rounded-xl"
      : props.variant === "primary-light"
      ? "bg-card-light dark:bg-card-dark text-primary-light dark:text-primary-dark hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white dark:hover:text-white transition-colors border dark:border-none rounded-xl"
      : props.variant === "primary-dark"
      ? "bg-background-light dark:bg-background-dark text-primary-light dark:text-primary-dark hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white dark:hover:text-white transition-colors border dark:border-none rounded-xl"
      : "bg-primary-light dark:bg-primary-dark text-white hover:opacity-70 transition-colors shadow-lg rounded-xl"
  );

  // Size styles
  const sizeMap = {
    sm: "text-sm px-2 py-1.5",
    md: "text-base px-2 py-2",
    lg: "text-lg px-4 py-3",
  };
  classes.push(sizeMap[props.size] || sizeMap.md);

  return classes.join(" ");
});
</script>
