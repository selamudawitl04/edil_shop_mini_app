<script setup>
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const items = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const addItem = () => {
  items.value.push({
    category_id: "0",
    title: "",
  });
};

const deleteItem = (index) => {
  items.value.splice(index, 1);
};
</script>

<template>
  <div class="bg-white rounded-lg space-y-4">
    <!-- Header -->

    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">እጣዎች ({{ items.length }})</h2>

      <BaseButton @click="addItem" type="button" :full="false">
        <Icon name="mdi:plus" />
        እጣ ጨምር
      </BaseButton>
    </div>
    <div
      class="bg-background-light p-4 rounded-lg space-y-2"
      v-for="(item, index) in items"
    >
      <div class="flex justify-between items-center">
        <span
          class="text-white bg-primary-light rounded-full w-6 h-6 flex items-center justify-center"
          >{{ index + 1 }}</span
        >

        <!-- delete item -->
        <button
          type="button"
          v-if="items.length > 1"
          @click="deleteItem(index)"
        >
          <Icon name="mdi:delete" class="text-red-500" />
        </button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SelectCategory
          v-model="item.category_id"
          :show-label="true"
          label="የእጣ አይነት"
          :name="`item-category-${index}`"
          :id="`item-category-${index}`"
          rules="required"
        />

        <BaseInput
          :id="`item-title-${index}`"
          :name="`item-title-${index}`"
          v-model="item.title"
          :label="item.category_id == 'ገንዘብ' ? 'የገንዘብ መጠን' : 'የእጣ ስም'"
          :placeholder="
            item.category_id == 'ገንዘብ' ? 'የገንዘብ መጠን ያስገቡ' : 'የእጣ ስም ያስገቡ'
          "
          :type="item.category_id == 'ገንዘብ' ? 'number' : 'text'"
          rules="required"
        />
      </div>
    </div>
  </div>
</template>
