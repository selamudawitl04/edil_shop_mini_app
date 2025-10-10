<template>
  <div v-if="medias.length" class="flex flex-col gap-2">
    <!-- Media Container -->
    <div
      class="relative w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm"
      :style="{ height: height + 'px' }"
    >
      <!-- Cover Image -->
      <img
        v-if="medias[0]"
        :src="medias[0]"
        @click="openGalleryDialog = true"
        class="w-full h-full object-cover cursor-pointer"
        @error="imgError = true"
        v-show="!imgError"
      />

      <div
        v-if="imgError"
        class="absolute inset-0 flex flex-col items-center justify-center bg-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-3-3v6m9 6H3a2 2 0 01-2-2V4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2z"
          />
        </svg>
        <span class="text-gray-500 text-xs mt-1">ፎቶ አልተገኘም</span>
      </div>

      <!-- Gradient Overlay -->
      <div
        v-if="showSeeAllButton"
        class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"
      ></div>

      <!-- See All Button -->
      <button
        v-if="showSeeAllButton && medias.length > 1"
        @click="openGalleryDialog = true"
        class="absolute bottom-2 right-2 bg-white/90 text-black text-xs font-semibold flex items-center gap-1 px-3 py-1 rounded-full border border-white shadow"
      >
        <Icon name="mdi:photo-library" class="w-4 h-4" />
        ሁሉንም ይመልከቱ
      </button>

      <!-- Play Icon -->
      <div
        v-if="medias.length > 1"
        class="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1"
      >
        <i class="mdi mdi-play text-white text-sm"></i>
      </div>
    </div>
  </div>

  <!-- Image Slider Modal -->
  <LotteryDetailGallerySlider
    v-if="openGalleryDialog"
    v-model="openGalleryDialog"
    :images="medias"
    :initial-index="sliderIndex"
    @close="openGalleryDialog = false"
  />
</template>

<script setup>
import { ref, computed } from "vue";
// import ImageSlider from './ImageSlider.vue'

const props = defineProps({
  lottery: { type: Object, required: true },
  height: { type: Number, default: 200 },
  showSeeAllButton: { type: Boolean, default: true },
});

const imgError = ref(false);
const sliderIndex = ref(0);
const medias = computed(() => {
  const _medias = [];

  // 1️⃣ Add the first item's cover image first (if exists)
  if (props.lottery.items.length) {
    const firstCover = props.lottery.items[0].cover_image;
    if (firstCover && !_medias.includes(firstCover)) {
      _medias.push(firstCover);
    }
  }

  // 2️⃣ Add all lottery.medias URLs
  for (const media of props.lottery.medias) {
    if (media.url && !_medias.includes(media.url)) {
      _medias.push(media.url);
    }
  }

  // 3️⃣ Add remaining item cover images
  for (const item of props.lottery.items.slice(1)) {
    if (item.cover_image && !_medias.includes(item.cover_image)) {
      _medias.push(item.cover_image);
    }
  }

  return _medias;
});

const openGalleryDialog = ref(false);
</script>

<style scoped>
/* Include Material Design Icons if needed */
@import url("https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css");
</style>
