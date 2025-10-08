<template>
  <HeadlessTransitionRoot :show="open">
    <HeadlessDialog
      as="div"
      class="relative z-[9999]"
      @close="autoClose ? (open = false) : ''"
    >
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-70 transition-opacity" />

      <!-- Slider Wrapper -->
      <div
        class="fixed inset-0 flex justify-center items-center p-0 text-center"
      >
        <HeadlessDialogPanel
          class="relative w-full h-full bg-black flex flex-col items-center justify-center"
        >
          <!-- Back + Index -->
          <div
            class="absolute top-4 left-0 right-0 z-50 flex items-center justify-center"
          >
            <!-- Back Button -->
            <button
              @click="closeDialog"
              class="absolute left-4 text-white p-2 rounded-full hover:bg-white/20 focus:outline-none"
            >
              <Icon name="ion:arrow-back-outline" class="w-6 h-6" />
            </button>

            <!-- Centered Index -->
            <span class="text-white text-sm sm:text-base">
              {{ currentSlide + 1 }} / {{ images.length }}
            </span>
          </div>

          <!-- Keen Slider -->
          <div
            ref="sliderRef"
            class="keen-slider w-full h-full overflow-hidden"
          >
            <div
              v-for="(image, index) in images"
              :key="index"
              class="keen-slider__slide flex items-center justify-center w-full h-full flex-shrink-0"
            >
              <img :src="image" class="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <!-- Indicators -->
          <div
            v-if="images.length > 1"
            class="absolute bottom-4 left-0 right-0 flex justify-center gap-2"
          >
            <span
              v-for="(image, index) in images"
              :key="index"
              class="w-2 h-2 rounded-full"
              :class="currentSlide === index ? 'bg-white' : 'bg-white/40'"
            ></span>
          </div>
        </HeadlessDialogPanel>
      </div>
    </HeadlessDialog>
  </HeadlessTransitionRoot>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  images: { type: Array, default: () => [] },
  autoClose: { type: Boolean, default: true },
});

const emits = defineEmits(["update:modelValue", "close"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emits("update:modelValue", val);
    if (!val) emits("close");
  },
});

const sliderRef = ref(null);
const sliderInstance = ref(null);
const currentSlide = ref(0);

// --- Dialog Back Handling ---
const handleBackButton = (event) => {
  if (open.value) {
    event.preventDefault();
    closeDialog();
    history.pushState(null, document.title, location.href); // reset history state
  }
};

const closeDialog = () => {
  open.value = false;
};

onMounted(() => {
  nextTick(() => {
    // Initialize KeenSlider
    if (sliderRef.value && props.images.length) {
      sliderInstance.value = new KeenSlider(sliderRef.value, {
        loop: true,
        mode: "snap",
        initial: 0,
        slides: { perView: 1, spacing: 0 },
        drag: true,
        rubberband: true,
        slideChanged(s) {
          currentSlide.value = s.track.details.rel;
        },
      });
    }
  });

  // Push history state when dialog opens
  if (open.value) history.pushState({ dialogOpen: true }, "");

  // Listen for mobile back / browser back
  window.addEventListener("popstate", handleBackButton);
});

onBeforeUnmount(() => {
  sliderInstance.value?.destroy();
  window.removeEventListener("popstate", handleBackButton);
});

// Watch dialog open state to push history
watch(open, (val) => {
  if (val) {
    history.pushState({ dialogOpen: true }, "");
  }
});
</script>

<style scoped>
.keen-slider {
  width: 100%;
  height: 100%;
}
.keen-slider__slide {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
}
img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
