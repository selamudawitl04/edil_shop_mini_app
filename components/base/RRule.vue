<script setup>
import { useField } from "vee-validate";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps({
  modelValue: {
    type: Object,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const frequency = computed({
  get: () => {
    return props.modelValue.freq;
  },
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, freq: value });
  },
});

const interval = computed({
  get: () => {
    return props.modelValue.interval;
  },
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, interval: value });
  },
});

const byDay = computed({
  get: () => {
    return props.modelValue.byDay;
  },
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, byDay: value });
  },
});

// Frequency Type Selector
const frequencyList = ref([
  {
    name: "Daily",
    value: "daily",
    id: "daily",
  },
  {
    name: "Weekly",
    value: "weekly",
    id: "weekly",
  },
  {
    name: "Monthly",
    value: "monthly",
    id: "monthly",
  },
  {
    name: "Yearly",
    value: "yearly",
    id: "yearly",
  },
]);

const byDayList = ref([
  {
    name: "Monday",
    value: "MO",
    id: "monday",
  },
  {
    name: "Tuesday",
    value: "TU",
    id: "tuesday",
  },
  {
    name: "Wednesday",
    value: "WE",
    id: "wednesday",
  },
  {
    name: "Thursday",
    value: "TH",
    id: "thursday",
  },
  {
    name: "Friday",
    value: "FR",
    id: "friday",
  },
  {
    name: "Saturday",
    value: "SA",
    id: "saturday",
  },
  {
    name: "Sunday",
    value: "SU",
    id: "sunday",
  },
]);
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <!-- -----------Frequency Type Selector -->
      <BaseSelect
        v-model="frequency"
        :items="frequencyList"
        label="Frequency"
        name="frequency"
        id="frequency"
        rules="required"
      />

      <!-- -----------Interval Input -->
      <BaseInput
        v-model="interval"
        label="Interval"
        name="interval"
        id="interval"
        placeholder="How often the event will occur"
        rules="required|min:1"
      />
    </div>

    <!-- -------Make Checkbox for By Day -->
    <div v-if="frequency === 'weekly'" class="flex items-center gap-2">
      <BaseListCheckBox
        id="byDay"
        name="Days"
        v-model="byDay"
        :items="byDayList"
        label="Select Days"
        rules="required|min:1"
      />
    </div>
  </div>
</template>
