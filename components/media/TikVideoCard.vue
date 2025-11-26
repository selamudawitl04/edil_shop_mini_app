<template>
  <div
    @click="openUrl(video.link)"
    class="relative rounded-t-xl overflow-hidden cursor-pointer group w-full max-h-72"
  >
    <!-- Thumbnail -->
    <img
      :src="video.cover_image || 'video-placeholder.png'"
      alt="TikTok Video"
      class="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-75"
    />

    <!-- Title Overlay -->
    <div
      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2"
    >
      <p class="text-white text-sm font-medium line-clamp-2">
        {{ video.title }}
      </p>
    </div>

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
</template>

<script setup>
const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["deleteVideo", "editVideo"]);

const deleteOption = () => {
  emit("deleteVideo", props.video);
};

const editOption = () => {
  emit("editVideo", props.video);
};

const openUrl = (url) => {
  window.open(url, "_blank");
};
</script>
