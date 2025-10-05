<script setup>
import listQuery from "@/graphql/events/event_categories.gql";
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
} = useField("event_category", props.rules, {
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
    is_active: {
      _eq: true,
    },
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
  if (data.event_categories) {
    items.value = data.event_categories;
    if (props.addAllCategories) {
      items.value?.unshift({
        id: "All Event Categories",
        name: "All Event Categories",
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
  <BaseSearchSelect
    name="event_category"
    :items="items"
    v-model="selectedItem"
    :label="label"
    :disabled="disabled"
    v-model:search="search"
    :show-label="showLabel"
    :rules="rules"
  />
</template>
