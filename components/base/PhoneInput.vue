<script setup>
import { onClickOutside } from "@vueuse/core";
import { nextTick, computed, ref } from "vue";
import { countries } from "@/utils/countries-phone";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  isRequired: {
    type: Boolean,
    default: true,
  },
});

const selectedCountry = ref(countries.find((c) => c.code === "ET"));

if (props.modelValue?.length) {
  selectedCountry.value =
    countries.find((c) => c.dial_code === props.modelValue.split(",")[0]) ||
    countries[0];
}

const search = ref("");
const dropdownOpen = ref(false);
const wrapperRef = ref(null);
const inputRef = ref(null);

const filteredCountries = computed(() =>
  countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.value.toLowerCase()) ||
      c.dial_code.includes(search.value)
  )
);

const selectCountry = (country) => {
  if (props.disabled) return;
  selectedCountry.value = country;
  dropdownOpen.value = false;
  nextTick(() => inputRef.value?.focus());
};

const phoneValue = computed({
  get() {
    return props.modelValue?.split(",")[1] || "";
  },
  set(val) {
    const splitted = val.split(",");
    if (splitted.length > 1) {
      selectedCountry.value =
        countries.find((c) => c.dial_code === splitted[0]) || countries[0];
    }

    let newVal = val;
    if (val.split(",").length > 1) {
      newVal = val.split(",")[1];
    }

    emit("update:modelValue", `${selectedCountry.value.dial_code},${newVal}`);
  },
});

onClickOutside(wrapperRef, () => {
  dropdownOpen.value = false;
});

const firstTime = ref(true);

const phoneError = computed(() => {
  const number = phoneValue.value;
  if (!number || number.trim() === "") {
    if (props.isRequired) {
      return "Phone number is required.";
    } else {
      return "";
    }
  }
  const isValid = /^[1-9]\d{5,11}$/.test(number);
  return isValid ? null : "Invalid phone number format.";
});
</script>

<template>
  <div ref="wrapperRef" class="relative w-full">
    <div
      class="mb-1 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
    >
      Phone Number
    </div>
    <div
      class="flex items-center w-full rounded-md dark:border-borderColor-dark shadow-sm transition-all duration-200 focus-within:ring-1 focus-within:ring-primary-light dark:focus-within:ring-primary-dark focus-within:border-primary-light dark:focus-within:border-primary-dark bg-white dark:bg-background-dark"
    >
      <!-- Country Select Display -->
      <div
        @click="!props.disabled && (dropdownOpen = !dropdownOpen)"
        class="cursor-pointer px-3 py-2.5 text-sm bg-gray-100 dark:bg-slate-700 text-textPrimary-light dark:text-textPrimary-dark border-r border-borderColor-light dark:border-borderColor-dark rounded-l-md"
        :class="{ 'opacity-60 cursor-not-allowed': props.disabled }"
      >
        {{ selectedCountry.emoji }} {{ selectedCountry.dial_code }}
      </div>

      <!-- Phone Input -->
      <input
        @input="() => (firstTime = false)"
        ref="inputRef"
        type="tel"
        v-model="phoneValue"
        :disabled="props.disabled"
        placeholder="9/7..."
        class="flex-1 px-4 py-2 text-sm font-body bg-card-light dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none disabled:opacity-60 rounded-r-md border-borderColor-light dark:border-borderColor-dark"
      />
    </div>

    <!-- Country Dropdown -->
    <div
      v-if="dropdownOpen && !props.disabled"
      class="absolute left-0 z-50 w-full mt-1 max-h-60 overflow-auto rounded-md shadow-lg bg-white dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark text-sm"
    >
      <input
        v-model="search"
        type="text"
        placeholder="Search country"
        class="w-full px-3 py-2 border-b border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-background-dark text-sm focus:outline-none"
      />
      <ul>
        <li
          v-for="country in filteredCountries"
          :key="country.code"
          @click="selectCountry(country)"
          class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex justify-between items-center"
        >
          <span class="flex items-center gap-2">
            <span>{{ country.emoji }}</span>
            <span>{{ country.name }}</span>
          </span>
          <span class="text-xs text-gray-400">{{ country.code }}</span>
        </li>
        <li
          v-if="!filteredCountries.length"
          class="text-center py-2 text-textSecondary-light dark:text-textSecondary-dark"
        >
          No countries found
        </li>
      </ul>
    </div>

    <!-- Validation Error -->
    <transition name="fade">
      <p
        v-if="phoneError && !firstTime"
        class="mt-1 text-xs text-danger-light dark:text-danger-dark font-medium"
        id="input-error"
      >
        {{ phoneError }}
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
