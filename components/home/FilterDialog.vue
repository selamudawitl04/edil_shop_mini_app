<template>
  <!-- ✨ Edit Devotion Dialog -->
  <BaseDialog v-model="open" title="ዕጣዎችን እንዴ ሚፈልጉት ይደርድሩ" :autoClose="true">
    <template #content>
      <div class="max-w-3xl mx-auto">
        <div class="space-y-4">
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
          <div class="grid grid-cols-2 gap-2">
            <BaseInput
              label="የትከት ዋጋ ዝቅተኛ (ብር)"
              v-model="filters.min_price"
              :minValue="0"
              placeholder="eg: 50 ብር"
            />

            <BaseInput
              label="የትከት ዋጋ ከፍተኛ (ብር)"
              v-model="filters.max_price"
              :minValue="0"
              placeholder="eg: 2000 ብር"
            />
          </div>

          <!-- ---------------Ticket Size Range ---------------------- -->
          <div class="grid grid-cols-2 gap-2">
            <BaseInput
              label="የትከት ብዛት ዝቅተኛ"
              v-model="filters.min_ticket_size"
              :minValue="0"
              placeholder="eg: 50 ትኬት"
            />

            <BaseInput
              label="የትከት ብዛት ከፍተኛ"
              v-model="filters.max_ticket_size"
              :minValue="0"
              placeholder="eg: 2000 ትኬት"
            />
          </div>

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
      sort: "",
      min_price: null,
      max_price: null,
      min_ticket_size: null,
      max_ticket_size: null,
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
