<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  lottery: {
    type: Object,
    required: true,
  },
});

// Check if there are live or video links
const hasLiveLinks = computed(
  () =>
    !!(
      props.lottery.youtube_live_url ||
      props.lottery.tiktok_live_url ||
      props.lottery.telegram_live_url
    )
);

const hasVideoLinks = computed(
  () =>
    !!(
      props.lottery.youtube_video_url ||
      props.lottery.tiktok_video_url ||
      props.lottery.telegram_video_url
    )
);

// Build the title and buttons based on status
const titleText = computed(() => {
  if (
    props.lottery.status === "active" &&
    props.lottery.final_time &&
    hasLiveLinks.value
  ) {
    return "የሂደቱን ቀጥታ ይከታተሉ"; // Follow the process live
  } else if (props.lottery.status === "closed" && hasVideoLinks.value) {
    return "ቪዲዮዎቹን ይመልከቱ"; // Watch the videos
  }
  return "";
});

// Create button list dynamically
const buttons = computed(() => {
  const list = [];

  const addButton = (title, url, icon, color) => {
    list.push({ title, url, icon, color });
  };

  if (props.lottery.status === "active" && hasLiveLinks.value) {
    if (props.lottery.youtube_live_url)
      addButton(
        "YouTube Live",
        props.lottery.youtube_live_url,
        "mdi:youtube",
        "red"
      );
    if (props.lottery.tiktok_live_url)
      addButton(
        "TikTok Live",
        props.lottery.tiktok_live_url,
        "mdi:music",
        "black"
      );
    if (props.lottery.telegram_live_url)
      addButton(
        "Telegram Live",
        props.lottery.telegram_live_url,
        "mdi:telegram",
        "blue"
      );
  } else if (props.lottery.status === "closed" && hasVideoLinks.value) {
    if (props.lottery.youtube_video_url)
      addButton(
        "YouTube Video",
        props.lottery.youtube_video_url,
        "mdi:youtube",
        "red"
      );
    if (props.lottery.tiktok_video_url)
      addButton(
        "TikTok Video",
        props.lottery.tiktok_video_url,
        "mdi:music",
        "black"
      );
    if (props.lottery.telegram_video_url)
      addButton(
        "Telegram Video",
        props.lottery.telegram_video_url,
        "mdi:telegram",
        "blue"
      );
  }

  return list;
});

// Handle external link open
const openUrl = (url) => {
  window.open(url, "_blank");
};
</script>

<template>
  <div v-if="buttons.length">
    <!-- Title -->
    <h3
      class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4"
    >
      {{ titleText }}
    </h3>

    <!-- Buttons -->
    <div class="space-y-3">
      <div
        v-for="(btn, i) in buttons"
        :key="i"
        @click="openUrl(btn.url)"
        class="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        :class="`border-${btn.color}-300 bg-${btn.color}-50 hover:bg-${btn.color}-100`"
      >
        <div class="flex items-center gap-3">
          <Icon :name="btn.icon" :class="`text-${btn.color}-600 text-xl`" />
          <span :class="`text-${btn.color}-700 font-medium`">
            {{ btn.title }}
          </span>
        </div>
        <Icon name="mdi:open-in-new" :class="`text-${btn.color}-600 text-lg`" />
      </div>
    </div>
  </div>
</template>
