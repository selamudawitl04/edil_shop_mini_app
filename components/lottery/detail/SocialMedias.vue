<script setup>
import { computed } from "vue";

const props = defineProps({
  lottery: {
    type: Object,
    required: true,
  },
});

// Open external link
const openUrl = (url) => {
  if (url) window.open(url, "_blank");
};
</script>

<template>
  <div class="space-y-10">
    <!-- ============ TikTok Live ============ -->
    <div v-if="lottery.status === 'active' && lottery.tiktok_live_url">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        የሂደቱን ቀጥታ ይከታተሉ
      </h3>

      <div
        @click="openUrl(lottery.tiktok_live_url)"
        class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:scale-[1.02]"
      >
        <div class="flex items-center gap-3">
          <Icon name="mdi:tiktok" class="text-blue-600 text-xl" />
          <span class="text-blue-700 font-semibold">TikTok Live</span>
        </div>

        <Icon name="mdi:open-in-new" class="text-blue-600 text-lg" />
      </div>
    </div>

    <!-- ============ TikTok Videos ============ -->
    <div v-if="lottery.tiktok_video_url && lottery.status == 'closed'">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        ቪዲዮ ይመልከቱ
      </h3>

      <div
        v-if="lottery.tiktok_video_url"
        @click="openUrl(lottery.tiktok_video_url)"
        class="relative rounded-xl overflow-hidden cursor-pointer group"
      >
        <!-- Thumbnail -->
        <img
          :src="lottery.tiktok_cover_image || 'video-placeholder.png'"
          alt="TikTok Video"
          class="w-full h-56 sm:h-64 object-cover transition-all duration-300 group-hover:brightness-75"
        />

        <!-- Play Icon -->
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Icon
            name="mdi:play"
            class="text-white text-5xl opacity-90 group-hover:scale-110 transition-transform duration-200"
          />
        </div>
      </div>
    </div>
  </div>
</template>
