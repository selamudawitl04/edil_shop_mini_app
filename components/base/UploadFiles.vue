<template>
  <div class="p-4 bg-white rounded-xl shadow-md">
    <!-- Header -->
    <div class="flex items-center">
      <span class="material-icons text-primary">photo_library</span>
      <span class="ml-2 text-lg font-bold text-black">የሎተሪ ፎቶዎች</span>
      <div class="ml-auto text-gray-600 text-sm font-medium">
        {{ medias.length }}/{{ maxImages }}
      </div>
    </div>

    <!-- Upload Button -->
    <div v-if="medias.length < maxImages" class="mt-4">
      <label
        class="flex flex-col justify-center items-center h-32 w-full rounded-lg border border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100"
      >
        <span class="material-icons text-gray-400 text-4xl"
          >add_photo_alternate</span
        >
        <span class="mt-2 text-gray-600 font-medium">ፎቶ ያክሉ</span>
        <span class="text-xs text-gray-500">እ {{ maxImages }} ፎቶዎች</span>
        <input
          type="file"
          class="hidden"
          multiple
          accept="image/*"
          @change="pickImages"
        />
      </label>
    </div>

    <!-- Images Grid -->
    <div v-if="medias.length" class="mt-4 grid grid-cols-2 gap-3">
      <div
        v-for="(media, index) in medias"
        :key="media.id"
        class="relative rounded-lg border"
        :class="
          media.isFeatured ? 'border-2 border-primary' : 'border-gray-300'
        "
      >
        <!-- Image -->
        <img
          v-if="media.url.startsWith('http')"
          :src="media.url"
          class="w-full h-32 object-cover rounded-lg"
          @error="media.url = ''"
        />
        <img
          v-else
          :src="media.url"
          class="w-full h-32 object-cover rounded-lg"
          @error="media.url = ''"
        />

        <!-- Featured Badge -->
        <div
          v-if="media.isFeatured"
          class="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary text-white text-xs font-bold"
        >
          ዋና
        </div>

        <!-- Remove Button -->
        <button
          class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
          @click="removeImage(index)"
        >
          ✕
        </button>

        <!-- Make Featured -->
        <button
          class="absolute bottom-2 left-2 right-2 py-1 rounded-md text-white text-xs font-bold"
          :class="media.isFeatured ? 'bg-green-500' : 'bg-primary'"
          @click="toggleFeatured(index)"
        >
          {{ media.isFeatured ? "ዋና ነው" : "ዋና አድርግ" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  medias: { type: Array, required: true },
  onMediasUpdated: { type: Function, required: true },
});

const maxImages = 5;
function pickImages(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  const remainingSlots = maxImages - props.medias.length;
  const imagesToAdd = files.slice(0, remainingSlots);

  const newMedias = imagesToAdd.map((file, i) => {
    return {
      id: Date.now().toString() + i,
      url: URL.createObjectURL(file),
      type: "image",
      lotteryId: "",
      isFeatured: props.medias.length === 0 && i === 0,
    };
  });

  props.onMediasUpdated([...props.medias, ...newMedias]);

  if (files.length > remainingSlots) {
    alert(
      `ከ ${remainingSlots} ፎቶዎች ብቻ ተጨመሩ። ከ ${maxImages} የሚበልጡ ፎቶዎች አይፈቀዱም።`
    );
  }

  event.target.value = ""; // reset input
}

function removeImage(index) {
  const removed = props.medias[index];
  let updated = [...props.medias];
  updated.splice(index, 1);

  // If removed was featured → make first image featured
  if (removed.isFeatured && updated.length > 0) {
    updated[0] = { ...updated[0], isFeatured: true };
  }

  props.onMediasUpdated(updated);
}

function toggleFeatured(index) {
  const updated = props.medias.map((m, i) => ({
    ...m,
    isFeatured: i === index,
  }));

  props.onMediasUpdated(updated);
}
</script>

<style scoped>
.text-primary {
  color: #007bff;
}
.bg-primary {
  background-color: #007bff;
}
</style>
