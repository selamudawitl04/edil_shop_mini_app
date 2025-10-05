<script setup>
import { ref, computed, toRefs } from "vue";
import { useField } from "vee-validate";
import { useDebounceFn, onClickOutside } from "@vueuse/core";

const emit = defineEmits(["update:modelValue", "returnedObject", "update:search"]);

const props = defineProps({
  id: String,
  name: { type: String, required: true },
  type: { type: String, default: "text" },
  modelValue: [String, Number, Object, Boolean],
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: "Select one" },
  searchPlaceholder: { type: String, default: "Search" },
  placeholderClass: { type: String, default: "" },
  clearable: { type: Boolean, default: true },

  label: String,
  labelClass: { type: String, default: "" },
  returnObject: { type: Boolean, default: false },
  rules: { type: String, default: "" },
  class: { type: String, default: "" },
  headerClass: { type: String, default: "" },
  listContainerClass: String,
  itemClass: { type: String, default: "" },
  showBy: { type: String, default: "name" },
  value: { type: String, default: "id" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  showLabel: { type: Boolean, default: true },
  mainClass: { type: String, default: "" },
  search: { type: String, default: "" },
});

const _search = computed({
  get() {
    return props.search;
  },
  set(value) {
    emit("update:search", value);
  },
});
// Debounced search emission


function getInitialValue() {
  if (props.returnObject && props.modelValue) return props.modelValue.id;
  return props.modelValue;
}

const singleSelectWithSearch = ref(null);
const { items } = toRefs(props);
const show = ref(false);

const selectedItem = computed({
  get() {
    if (props.returnObject) {
      return props.modelValue;
    } else {
      return props.items?.find((item) => item[props.value] == props.modelValue);
    }
  },
  set(val) {
    if (props.returnObject) {
      emit("update:modelValue", val);
      if (val) {
        inputValue.value = val[props.value];
      } else {
        inputValue.value = val;
      }
    } else {
      if (val) {
        emit("update:modelValue", val[props.value]);
        inputValue.value = val[props.value];
      } else {
        emit("update:modelValue", val);
        inputValue.value = val;
      }
    }
  },
});

const { errorMessage, value: inputValue } = useField(props.name, props.rules, {
  initialValue: getInitialValue(),
});

const set = (item) => {
  selectedItem.value = item;
  show.value = false;
};

const clear = () => {
  selectedItem.value = null;
  show.value = false;
};

onClickOutside(singleSelectWithSearch, () => (show.value = false));
</script>

<template>
  <div :class="mainClass" class="relative w-full" ref="singleSelectWithSearch">
    <div v-if="showLabel" class="mb-2">
      <slot name="label" />
      <label class=" text-textPrimary-light dark:text-textPrimary-dark text-sm" :class="labelClass" v-if="props.label"
        :for="props.id || ''">
        {{ props.label }}
        <span class="text-danger-light dark:text-danger-dark" v-if="
          typeof rules === 'object'
            ? Object.hasOwn(rules, 'required')
            : rules.includes('required')
        ">*</span>
      </label>
    </div>
    <!-- Select Button -->
    <div class="relative rounded-md font-body">
      <button type="button" :id="id" :disabled="disabled" @click="show = !show"
        class="flex items-center justify-between px-2 py-2 text-sm rounded-md shadow-sm border w-full bg-card-light dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark disabled:cursor-not-allowed disabled:opacity-60 transition duration-150 ease-in-out"
        :class="[
          props.class,
          errorMessage
            ? 'border-danger-light dark:border-danger-dark'
            : 'border-borderColor-light dark:border-borderColor-dark',
          placeholder && !selectedItem
            ? 'text-textSecondary-light dark:text-textSecondary-dark'
            : '',
        ]">
        {{ selectedItem?.[showBy] || placeholder || "Select" }}

        <!-- Chevron or Clear -->
        <span class="absolute inset-y-0 right-0 flex items-center pr-3">
          <Icon v-if="clearable && selectedItem" name="heroicons:x-mark-20-solid"
            class="text-xl text-textSecondary-light dark:text-textSecondary-dark cursor-pointer" @click.stop="clear" />
          <Icon v-else :name="show ? 'tabler:chevron-up' : 'tabler:chevron-down'"
            class="text-xl text-textSecondary-light dark:text-textSecondary-dark" />
        </span>
      </button>
    </div>

    <!-- Dropdown Options -->
    <ul v-show="show"
      class="absolute z-50 w-full overflow-y-auto text-sm bg-card-light dark:bg-card-dark border border-borderColor-light dark:border-borderColor-dark rounded-md shadow max-h-64 mt-1"
      :class="listContainerClass">
      <!-- 🔍 Search Box -->
      <li class="px-2 py-2 sticky top-0 bg-card-light dark:bg-card-dark z-10">
        <input type="text" v-model="_search" :placeholder="searchPlaceholder"
          class="w-full px-3 py-2 border border-borderColor-light dark:border-borderColor-dark rounded-md bg-white dark:bg-background-dark text-textPrimary-light dark:text-textPrimary-dark text-sm placeholder:text-textSecondary-light dark:placeholder:text-textSecondary-dark" />
      </li>

      <!-- Loader -->
      <li>
        <BaseProgress v-if="loading" height="h-1" class="w-full" bar-class="w-1/4" />
      </li>

      <!-- List Items -->
      <li v-for="item in items" :key="item[props.value]" @click="set(item)">
        <slot name="row" :item="item">
          <div :class="itemClass"
            class="relative flex items-center justify-between px-3 py-2 cursor-pointer select-none hover:bg-blue-50 dark:hover:bg-slate-700 text-textPrimary-light dark:text-textPrimary-dark">
            <span class="block capitalize break-words">
              {{ item[showBy] }}
            </span>

            <Icon v-if="selectedItem?.[props.value] === item[props.value]" name="ic:round-check" width="20" height="20"
              class="text-primary-light dark:text-primary-dark" />
          </div>
        </slot>
      </li>

      <!-- No results -->
      <li v-if="items.length === 0"
        class="text-center text-sm p-2 text-textSecondary-light dark:text-textSecondary-dark">
        No results found.
      </li>
    </ul>

    <!-- Error message -->
    <p v-if="!props.hideDetail && errorMessage" class="mt-1 text-sm text-danger-light dark:text-danger-dark font-body">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--tw-text-opacity, #cbd5e0) transparent;
}
</style>
