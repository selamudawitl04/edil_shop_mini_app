<script setup>
import listQuery from "@/graphql/comments/report_type_list.gql";
import { useField } from "vee-validate";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  label: {
    type: String,
  },
});

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField("report_type", props.rules, {
  initialValue: props.modelValue,
});
const selectedItem = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    inputValue.value = val;
    emit("update:modelValue", val);
  },
});

const items = ref([]);
const { onResult, onError } = queryList(listQuery, {});

onResult(({ data }) => {
  if (data.report_types) {
    items.value = data.report_types;
  }
});

onError((error) => {
  console.log(error);
});
</script>

<template>
  <div>
    <label
      v-if="label"
      for="category"
      class="block mb-1 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
    >
      {{ label }}

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
    <select
      id="category"
      v-model="selectedItem"
      class="w-full px-3 py-2 pr-10 rounded-md border border-borderColor-light dark:border-borderColor-dark bg-card-light dark:bg-card-dark text-sm text-textPrimary-light dark:text-textPrimary-dark appearance-none"
    >
      <option value="" disabled>Select Report Type</option>
      <option
        class="capitalize"
        v-for="item in items"
        :key="item.id"
        :value="item.id"
      >
        {{ item.label }}
      </option>
    </select>

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
