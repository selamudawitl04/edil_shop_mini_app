<script setup>
import listQuery from "@/graphql/payments/payment_options.gql";
import { useField } from "vee-validate";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: [String, Object],
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  label: {
    type: String,
  },

  showLabel: {
    type: Boolean,
    default: false,
  },
  disabled: Boolean,
  groupId: {
    type: String,
    required: false,
  },

  init: {
    type: Object,
    required: false,
  },
});

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField("payment_option_id", props.rules, {
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

const search = ref("");

const filter = computed(() => {
  let query = {
    name: {
      _ilike: `%${search.value}%`,
    },
  };

  return query;
});
const items = ref([]);
const { onResult, onError } = queryList(listQuery, {
  filter: filter,
});

onResult(({ data }) => {
  if (data.payment_options) {
    items.value = data.payment_options;
  }
});

onError((error) => {
  console.log(error);
});
</script>

<template>
  <BaseSearchSelect
    v-model:search="search"
    name="payment_option_id"
    :items="items"
    v-model="selectedItem"
    :label="label"
    :disabled="disabled"
    :show-label="showLabel"
    placeholder="የክፍያ መንገዶች ይምረጡ"
    :rules="rules"
  />
</template>
