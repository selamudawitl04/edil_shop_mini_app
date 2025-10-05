<script setup>
import listQuery from "@/graphql/categories/list.gql";
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
  addAllCategories: {
    type: Boolean,
    default: false,
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
} = useField("category", props.rules, {
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
  let query = {};

  return query;
});

const items = ref([]);
const { onResult, onError } = queryList(listQuery, {
  filter: filter,
});

onResult(({ data }) => {
  if (data.categories) {
    items.value = data.categories;
    if (props.addAllCategories) {
      items.value?.unshift({
        id: "ሁሉም",
        name: "ሁሉም",
        icon: "🌐",
      });
    }
    if (props.init) {
      if (items.value.find((item) => item.id === props.init?.id)) {
        items.value.unshift(props.init);
      }
    }
  }
});

onError((error) => {
  console.log(error);
});
</script>

<template>
  <BaseSelect
    name="category"
    :items="items"
    v-model="selectedItem"
    :label="label"
    :disabled="disabled"
    :show-label="showLabel"
    placeholder="የእጣ አይነት ይምረጡ"
    :rules="rules"
  />
</template>
