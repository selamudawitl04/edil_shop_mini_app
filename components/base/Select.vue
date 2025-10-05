<script setup>
import { ref, watch, toRefs, watchEffect } from "vue";
import { useField } from "vee-validate";
import { useDebounceFn, onClickOutside } from "@vueuse/core";

const emit = defineEmits(["update:modelValue", "returnedObject"]);
const props = defineProps({
  id: String,
  name: { type: String, required: true },
  type: { type: String, default: "text" },
  modelValue: [String, Number, Object, Boolean],
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: "Select one" },
  placeholderClass: { type: String, default: "" },
  label: String,
  labelClass: { type: String, default: "" },
  returnObject: { type: Boolean, default: false },
  rules: { type: String, default: "" },
  class: { type: String, default: "" },
  headerClass: { type: String, default: "" },
  mainClass: { type: String, default: "" },
  listContainerClass: String,
  itemClass: { type: String, default: "" },
  showBy: { type: String, default: "name" },
  value: { type: String, default: "id" },
  showLabel: { type: Boolean, default: true },
  disabled: Boolean,
});

function getInitialValue() {
  if (props.returnObject && props.modelValue) return props.modelValue.id;
  return props.modelValue;
}

const singleSelect = ref(null);
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

onClickOutside(singleSelect, () => (show.value = false));
</script>

<template>
  <div :class="mainClass" class="relative w-full" ref="singleSelect">
    <div class="mb-2" v-if="showLabel">
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

    <!-- Custom Select Header -->
    <button
      type="button"
      :disabled="disabled"
      @click="show = !show"
      tabindex="0"
      class="flex items-center justify-between px-2 py-2 rounded-md shadow-sm font-body border border-borderColor-light dark:border-borderColor-dark bg-card-light dark:bg-card-dark disabled:cursor-not-allowed disabled:opacity-60 w-full relative focus:outline-none focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark transition duration-150 ease-in-out"
      :class="[
        headerClass,
        errorMessage ? 'border-red-500 dark:border-red-400' : '',
      ]"
    >
      <div v-if="selectedItem">
        <slot name="header" :item="selectedItem">
          <div
            class="text-textPrimary-light dark:text-textPrimary-dark text-sm"
          >
            <span v-if="selectedItem.icon" class="mr-2">{{
              selectedItem.icon
            }}</span>
            <span>{{ selectedItem[showBy] }}</span>
          </div>
        </slot>
      </div>
      <div
        class="text-textSecondary-light dark:text-textSecondary-dark text-sm"
        :class="placeholderClass"
        v-else
      >
        {{ props.placeholder || "Select" }}
      </div>

      <div
        v-if="selectedItem"
        @click.stop="clear"
        class="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer"
      >
        <Icon
          name="heroicons:x-mark-20-solid"
          class="text-xl text-textSecondary-light dark:text-textSecondary-dark"
        />
      </div>
      <div v-else class="absolute inset-y-0 right-0 flex items-center pr-3">
        <Icon
          name="tabler:chevron-down"
          class="text-xl text-textSecondary-light dark:text-textSecondary-dark"
        />
      </div>
    </button>

    <!-- Dropdown Options -->
    <ul
      v-show="show"
      class="absolute z-50 w-full overflow-y-auto text-base bg-card-light dark:bg-card-dark border border-borderColor-light dark:border-borderColor-dark rounded-md shadow max-h-56 mt-1"
      :class="listContainerClass"
    >
      <li v-for="item in items" :key="item.id" @click="set(item)">
        <slot name="row" :item="item">
          <div
            :class="itemClass"
            class="relative text-sm flex items-center justify-between px-3 py-2 cursor-pointer select-none hover:bg-blue-50 dark:hover:bg-slate-700 text-textPrimary-light dark:text-textPrimary-dark"
          >
            <span class="block capitalize break-words">
              <span v-if="item.icon" class="mr-2">{{ item.icon }}</span>
              {{ item[showBy] }}
            </span>
          </div>
        </slot>
      </li>
    </ul>

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

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px white;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c3ddfd;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a5c1f4;
}
</style>
