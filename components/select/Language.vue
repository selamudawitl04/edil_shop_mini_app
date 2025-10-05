<script setup>
import listQuery from "@/graphql/languages/list.gql";
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
  addAllLanguages: {
    type: Boolean,
    default: false,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  disabled: Boolean,
});

// VeeValidate field binding
const { errorMessage, value: inputValue } = useField("language", props.rules, {
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
  if (data.languages) {
    items.value = data.languages;

    if (props.addAllLanguages) {
      items.value?.unshift({
        name: "All Languages",
        code: "All Languages",
      });
    }
  }
});

onError((error) => {
  console.error(error);
});
</script>

<template>
  <BaseSelect
    name="language"
    :items="items"
    v-model="selectedItem"
    value="code"
    :show-label="true"
    :label="label"
    :disabled="disabled"
  >
  </BaseSelect>
</template>
