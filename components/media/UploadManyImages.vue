<script setup>
import { ref } from "vue";
import upload_query from "@/graphql/medias/upload.gql";

// Props and emits
const props = defineProps({
  modelValue: { type: Array, default: () => [] }, // now [{url, isFeatured}]
  folder: { type: String, default: "lotteries" },
  maxFileSize: { type: Number, default: 10 * 1024 * 1024 },
  fileLimit: { type: Number, default: 5 },
});

const emit = defineEmits(["update:modelValue"]);

const fileInput = ref(null);
const files = ref([]);
const messages = ref([]);
const base64Files = ref([]);
const uploading = ref(false);

const { mutate, onDone, loading, onError } = mutator(upload_query, {
  clientId: "auth",
});

const open = () => fileInput.value?.click();

const onFileSelect = async (event) => {
  const selectedFiles = Array.from(event.target.files);
  messages.value = [];

  for (let file of selectedFiles) {
    if (validate(file)) {
      file.objectURL = URL.createObjectURL(file);
      files.value.push(file);
    }
  }

  if (!files.value.length) return;

  await convertToBase64();
  upload();
};

const validate = (file) => {
  const isImage = file.type.startsWith("image/");
  const isSizeValid = file.size <= props.maxFileSize;

  if (!isImage || !isSizeValid) {
    messages.value.push(
      `${file.name}: ልክ አይደለም። ከ ${formatSize(
        props.maxFileSize
      )} በታች ያሉ የምስል ፋይሎች ብቻ ይፈቀዳሉ።`
    );
    return false;
  }

  if ((props.modelValue?.length || 0) + files.value.length > props.fileLimit) {
    messages.value.push(`ከፍተኛ ፋይል ገደብ ${props.fileLimit} ነው።`);
    return false;
  }

  return true;
};

const formatSize = (bytes) => {
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  return parseFloat((bytes / Math.pow(1000, i)).toFixed(1)) + " " + sizes[i];
};

const convertToBase64 = async () => {
  base64Files.value = await Promise.all(
    files.value.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result.split(",")[1]);
          reader.readAsDataURL(file);
        })
    )
  );
};

const upload = () => {
  if (!base64Files.value.length) return;
  uploading.value = true;
  mutate({
    input: {
      medias: base64Files.value,
    },
  });
};

// Remove image
const removeImage = (url) => {
  let updated = (props.modelValue || []).filter((item) => item.url !== url);

  // If removed was featured → make first image featured
  if (!updated.some((m) => m.isFeatured) && updated.length > 0) {
    updated[0] = { ...updated[0], isFeatured: true };
  }

  emit("update:modelValue", updated);
};

// Toggle featured
const toggleFeatured = (url) => {
  const updated = props.modelValue.map((item) => ({
    ...item,
    isFeatured: item.url === url,
  }));
  emit("update:modelValue", updated);
};

// Upload success
onDone(({ data }) => {
  uploading.value = false;
  const uploadedUrls = data?.upload_medias?.urls || [];
  if (uploadedUrls.length) {
    let newItems = uploadedUrls.map((url, i) => ({
      url,
      isFeatured: props.modelValue.length === 0 && i === 0, // first ever uploaded
    }));
    const updated = [...(props.modelValue || []), ...newItems];
    emit("update:modelValue", updated);
  }
  files.value = [];
  base64Files.value = [];
});

// Upload error
onError(() => {
  uploading.value = false;
  messages.value.push("መጫን አልተሳካም። እባክዎን እንደገና ይሞክሩ።");
});
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="onFileSelect"
      :disabled="uploading"
    />

    <!-- Uploading -->
    <div v-if="uploading" class="flex items-center justify-center gap-2">
      <div class="loader"></div>
      <span class="text-sm text-gray-500">በመጫን ላይ...</span>
    </div>

    <!-- No images -->
    <div
      v-if="!props.modelValue?.length && !uploading"
      class="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg min-h-[136px] text-gray-500 text-center bg-gray-50"
    >
      <p class="mb-2">ምንም ፎቶ አልተመረጠም</p>
      <p class="text-xs text-gray-400 mb-4">JPG, PNG, WEBP (ከ 10MB በታች)</p>

      <button
        type="button"
        class="text-primary font-medium hover:underline transition text-sm"
        @click="open"
      >
        ፎቶ ይምረጡ
      </button>
    </div>

    <!-- Images Grid -->
    <div v-if="props.modelValue?.length" class="grid grid-cols-2 gap-3">
      <div
        v-for="item in props.modelValue"
        :key="item.url"
        class="relative rounded-lg border overflow-hidden"
        :class="item.isFeatured ? 'border-2 border-primary' : 'border-gray-300'"
      >
        <!-- Image -->
        <img :src="item.url" class="object-cover w-full h-32" />

        <!-- Featured Badge -->
        <div
          v-if="item.isFeatured"
          class="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary text-white text-xs font-bold"
        >
          ዋና
        </div>

        <!-- Remove -->
        <button
          @click="removeImage(item.url)"
          class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
          :disabled="uploading"
          type="button"
        >
          ×
        </button>

        <!-- Make Featured -->
        <button
          @click="toggleFeatured(item.url)"
          class="absolute bottom-2 left-2 right-2 py-1 rounded-md text-white text-xs font-bold"
          :class="item.isFeatured ? 'bg-green-500' : 'bg-primary'"
          type="button"
        >
          {{ item.isFeatured ? "ዋና ነው" : "ዋና አድርግ" }}
        </button>
      </div>
    </div>

    <!-- Select More -->
    <div v-if="props.modelValue?.length && !uploading" class="text-center">
      <button
        type="button"
        @click="open"
        class="px-4 py-2 text-sm font-medium rounded text-primary hover:opacity-90 transition"
      >
        ተጨማሪ ፎቶዎች ይምረጡ
      </button>
    </div>

    <!-- Errors -->
    <div v-if="messages.length" class="text-red-500 text-sm">
      <div v-for="(msg, i) in messages" :key="i">{{ msg }}</div>
    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: #007bff;
}
.bg-primary {
  background-color: #007bff;
}
</style>
