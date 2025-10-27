<script setup>
import { ref, watch } from "vue";
import uploadUrls from "@/graphql/medias/upload_urls.gql";
import axios from "axios";
import imageCompression from "browser-image-compression";

// Props
const props = defineProps({
  modelValue: String,
  label: String,
  width: [String, Number],
  height: [String, Number],
  folder: { type: String, default: "my-folder" },
  fileLimit: { type: Number, default: 1 },
  maxSizeMB: { type: Number, default: 0.1 },
  maxWidthOrHeight: { type: Number, default: 600 },
});
const emit = defineEmits(["update:modelValue"]);

// State
const imageUrl = ref(props.modelValue || "");
const fileName = ref("");
const fileSize = ref("");
const hasPickOrUploadError = ref(false);
const errorMessage = ref("");
const errorType = ref("upload");
const selectedFile = ref(null);
const isUploading = ref(false);

watch(
  () => props.modelValue,
  (val) => (imageUrl.value = val)
);
watch(imageUrl, (val) => emit("update:modelValue", val));

// GraphQL uploader setup
const {
  mutate: uploadMutation,
  onDone: handleUploadSuccess,
  onError: handleUploadError,
  loading: uploading,
} = mutator(uploadUrls, { showError: false, clientId: "auth" });

async function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    return showError("እባክዎን የፎቶ ፋይል ይምረጡ።", "pickImage");
  }

  try {
    // Compress the image
    const options = {
      maxSizeMB: props.maxSizeMB,
      maxWidthOrHeight: props.maxWidthOrHeight,
      useWebWorker: true,
      fileType: "image/webp",
    };
    const compressedFile = await imageCompression(file, options);

    fileName.value = compressedFile.name;
    fileSize.value = `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`;
    selectedFile.value = compressedFile;

    // Get upload URL
    const input = {
      folder: props.folder,
      content_type: compressedFile.type,
      file_names: [compressedFile.name],
    };
    uploadMutation({ input });
  } catch (err) {
    console.error(err);
    showError("ፎቶ መጫን አልተሳካም።", "upload");
  }
}

// Handle presigned URL response
handleUploadSuccess(async ({ data }) => {
  const urls = data?.upload_urls?.urls;
  if (!urls?.length) return showError("ፎቶ መጫን አልተሳካም።");

  const { upload_url, file_name } = urls[0];
  try {
    isUploading.value = true;
    // Upload directly to S3 via presigned URL
    await axios.put(upload_url, selectedFile.value, {
      headers: { "Content-Type": selectedFile.value.type },
    });

    // ✅ Construct final public URL
    const bucketBaseUrl = "https://edil-shop-prod.s3.eu-west-2.amazonaws.com";
    imageUrl.value = `${bucketBaseUrl}/${props.folder}/${file_name}`;
  } catch (err) {
    console.error("S3 upload error:", err);
    showError("ፎቶ መስቀል አልተሳካም።");
  } finally {
    isUploading.value = false;
  }
});

handleUploadError(() => showError("ፎቶ መስቀል አልተሳካም።"));

function showError(message, type = "upload") {
  hasPickOrUploadError.value = true;
  errorMessage.value = message;
  errorType.value = type;
}

const fileInput = ref(null);
</script>

<template>
  <div class="flex flex-col space-y-3 w-full">
    <!-- Label -->
    <div v-if="label" class="text-base font-bold text-black">
      {{ label }}
    </div>

    <!-- Upload Box -->
    <div
      :style="{
        width: width ? width + 'px' : '100%',
        height: height ? height + 'px' : 'auto',
      }"
      class="rounded-lg border"
      :class="hasPickOrUploadError ? 'border-red-300' : 'border-gray-300'"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />

      <!-- Empty or uploading -->
      <div
        v-if="!imageUrl && !selectedBase64"
        class="flex flex-col items-center justify-center text-center p-6 min-h-[136px] bg-gray-50 rounded-lg cursor-pointer"
        @click="fileInput.click()"
      >
        <Icon name="mdi:image-plus" class="w-10 h-10 text-blue-500 mb-2" />
        <p class="text-sm text-gray-700">ፎቶ ይምረጡ / ያስገቡ</p>
        <p class="text-xs text-gray-500">JPG, PNG, WEBP (እስከ 10MB)</p>
      </div>

      <!-- Uploading Spinner -->
      <div
        v-else-if="isUploading"
        class="flex flex-col items-center justify-center text-center p-6 min-h-[136px] bg-gray-50 rounded-lg"
      >
        <div class="loader"></div>
        <p class="text-sm text-gray-700">ፎቶ በመጫን ላይ...</p>
      </div>

      <!-- Image Preview (Uploaded or Selected) -->
      <div
        v-else
        class="relative flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
      >
        <img
          :src="imageUrl || selectedBase64"
          alt="Selected Image"
          class="w-24 h-24 object-cover rounded border border-gray-300"
        />
        <div class="flex flex-col justify-between">
          <div>
            <p class="text-sm font-medium text-gray-800 truncate">
              {{ fileName }}
            </p>
            <p class="text-xs text-gray-500">{{ fileSize }}</p>
          </div>
          <button
            type="button"
            class="text-xs text-blue-600 font-medium hover:underline mt-2"
            @click="fileInput.click()"
          >
            ፎቶ ይቀይሩ
          </button>
        </div>

        <!-- Retry Overlay -->
        <div
          v-if="hasPickOrUploadError"
          class="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-lg"
        >
          <p class="text-red-700 text-sm mb-2">
            {{ errorMessage || "ፎቶ ማላክ አልተሳካም።" }}
          </p>
          <button
            type="button"
            @click="retryAction"
            class="bg-red-600 text-white text-xs font-semibold rounded px-3 py-1 hover:bg-red-700"
          >
            እንደገና ይሞክሩ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
