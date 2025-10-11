<script setup>
import listQuery from "@/graphql/categories/list.gql";
import { ref, computed } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: [String, Object],
  label: String,
  addAllCategories: {
    type: Boolean,
    default: false,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  disabled: Boolean,
  groupId: String,
  init: Object,
});

const selectedItem = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit("update:modelValue", val);
  },
});

const order = computed(() => {
  return [{ order: "asc_nulls_last" }];
});

const items = ref([]);
const { onResult, onError } = queryList(listQuery, {
  filter: computed(() => ({})),
  order,
});

onResult(({ data }) => {
  if (data.categories) {
    let categories = [...data.categories];

    if (props.addAllCategories) {
      categories.unshift({
        id: "ሁሉም",
        name: "ሁሉም",
        icon: "🌐",
      });
    }

    if (props.init && !categories.find((i) => i.id === props.init.id)) {
      categories.unshift(props.init);
    }

    items.value = categories;
  }
});

onError((error) => console.log(error));
</script>

<template>
  <div class="category-tabs">
    <div v-if="showLabel" class="category-label mb-2 font-semibold">
      {{ label }}
    </div>

    <div class="tabs-container flex gap-2 overflow-x-auto">
      <div
        v-for="item in items"
        :key="item.id"
        @click="selectedItem = item.id"
        class="tab flex-shrink-0 cursor-pointer rounded-lg py-1 px-2 text-center transition-all duration-200"
        :class="
          selectedItem === item.id
            ? 'bg-primary-light text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        "
      >
        <span v-if="item.icon" class="mr-1">{{ item.icon }}</span>
        <span class="font-semibold text-sm">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs-container {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
}
.tabs-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}
</style>
