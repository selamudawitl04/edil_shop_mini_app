<script setup>
import { ref, watch } from "vue";
import Slider from "@vueform/slider";
import "@vueform/slider/themes/default.css";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: { type: Array, default: () => [0, 1000], required: true },
  minValue: { type: Number, default: 0 }, // always fixed
  maxValue: { type: Number, default: 1000 },
  containerClass: { type: String, default: "" },
  label: { type: String, default: "Price Range" },
  measure: { type: String, default: "" },
});

const selectedRange = ref([...props.modelValue]);
const sliderMin = ref(props.minValue); // min always from parent
const sliderMax = ref(props.maxValue);

// Factor for dynamic window (as % of selected high value)
const maxWindowFactor = 0.4;

const roundDynamic = (value) => {
  if (value <= 1000) return Math.ceil(value / 100) * 100;
  return Math.ceil(value / 1000) * 1000;
};

watch(selectedRange, (newVal) => {
  emit("update:modelValue", newVal);

  const high = newVal[1];

  // min stays fixed
  sliderMin.value = props.minValue;

  // max dynamically calculated & rounded to nearest 100
  sliderMax.value = Math.min(
    props.maxValue,
    roundDynamic(high + high * maxWindowFactor)
  );
});

// watch for parent changes to minValue/maxValue
watch([() => props.minValue, () => props.maxValue], ([newMin, newMax]) => {
  sliderMin.value = newMin; // always fixed
  sliderMax.value = Math.max(
    newMax,
    roundDynamic(
      selectedRange.value[1] + selectedRange.value[1] * maxWindowFactor
    )
  );
});
</script>
<template>
  <div :class="['w-full', containerClass]">
    <!-- Label stays flush -->
    <label>{{ label }}</label>

    <!-- Slider wrapper with padding -->
    <div class="px-4 w-full">
      <Slider
        v-model="selectedRange"
        :min="sliderMin"
        :max="sliderMax"
        tooltip="always"
        class="slider-primary w-full"
      />
    </div>

    <div class="flex justify-between mt-2">
      <p>{{ sliderMin }} {{ measure }}</p>
      <p>{{ sliderMax }} {{ measure }}</p>
    </div>
  </div>
</template>

<style scoped>
.slider-primary {
  --slider-connect-bg: #1e40afff; /* selected range */
  --slider-handle-bg: #fff;
  --slider-handle-border: 3px solid #1e40afff;
  --slider-handle-width: 18px;
  --slider-handle-height: 18px;

  --slider-tooltip-bg: #1e40afff;
  --slider-tooltip-color: #ffffff;
}

/* Ensure the slider respects padding */
.w-full {
  box-sizing: border-box;
}
</style>
