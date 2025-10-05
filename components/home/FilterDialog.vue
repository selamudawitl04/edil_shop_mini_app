<template>
  <!-- ✨ Edit Devotion Dialog -->
  <BaseDialog v-model="open" title="ዕጣዎችን እንዴ ሚፈልጉት ይደርድሩ" :autoClose="true">
    <template #content>
      <div class="max-w-3xl mx-auto">
        <div class="space-y-4">
          <!-- -----------------Category ---------------------- -->
          <SelectCategory
            v-model="filters.category_id"
            :show-label="true"
            label="የእጣ አይነት"
            :name="`item-category`"
            :id="`item-category`"
            :addAllCategories="true"
          />

          <!-- ----------------Order By ---------------------- -->
          <BaseSelect
            name="sort"
            :items="sortItems"
            v-model="filters.sort"
            label="ቅደም ተከተል"
            :show-label="true"
            placeholder="ቅደም ተከተል ይምረጡ"
          />

          <!-- ----------------Price Range ---------------------- -->

          <SelectRange
            label="የትከት ዋጋ ዝቅተኛ እና ከፍተኛ"
            v-model="filters.price_range"
            :minValue="0"
            :maxValue="5000"
          />

          <!-- ---------------Ticket Size Range ---------------------- -->

          <SelectRange
            label="የትከት መጠን ዝቅተኛ እና ከፍተኛ"
            v-model="filters.ticket_size_range"
            :minValue="0"
            :maxValue="2000"
          />

          <!-- ----------------------Reset and Apply ---------------------- -->

          <div class="flex justify-end gap-2">
            <BaseButton variant="orange" @click="emit('resetFilters')">
              <span class="text-white">ውዴ መጀመርያ መልስ</span>
            </BaseButton>
            <BaseButton variant="primary" @click="emit('applyFilters')">
              <span class="text-white"> ይደርድሩ</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
const emit = defineEmits([
  "update:modelValue",
  "update:queryVariables",
  "resetFilters",
  "applyFilters",
]);

const props = defineProps({
  modelValue: Boolean,
  queryVariables: {
    type: Object,
    default: () => ({
      category_id: "",
      sort: "",
      price_range: [0, 5000],
      ticket_size_range: [0, 2000],
    }),
  },
});

// Open state
const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const filters = computed({
  get() {
    return props.queryVariables;
  },
  set(val) {
    emit("update:queryVariables", val);
  },
});

const sortItems = [
  { id: "High price", name: "ከፍተኛ ዋጋ" },
  { id: "Low price", name: "ዝቂተኝ ዋጋ" },
  { id: "Popular", name: "ታዋቂ" },
  { id: "High Sold", name: "ብዙ የተሸጡ" },
];
</script>
