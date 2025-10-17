<script setup>
import { ref, watch } from "vue";
import upload from "@/graphql/medias/upload.gql";
import { useForm } from "vee-validate";

// Props & Emits
const props = defineProps({
  modelValue: String,
  label: String,
  width: [String, Number],
  height: [String, Number],
  reset: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const { resetForm } = useForm();

// State
const imageUrl = ref(props.modelValue || "");
const fileName = ref("");
const fileSize = ref("");
const hasPickOrUploadError = ref(false);
const errorMessage = ref("");
const errorType = ref("upload");
const selectedBase64 = ref(null);
const selectedFile = ref(null);

// Watchers
watch(
  () => props.modelValue,
  (val) => (imageUrl.value = val)
);
watch(imageUrl, (val) => emit("update:modelValue", val));

watch(
  () => props.reset,
  (newVal) => {
    if (newVal) {
      resetForm();
      imageUrl.value = "";
      fileName.value = "";
      fileSize.value = "";
      hasPickOrUploadError.value = false;
      errorMessage.value = "";
      selectedBase64.value = null;
      selectedFile.value = null;
    }
  }
);

// File input handler
function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showError("እባክዎን የፎቶ ፋይል ይምረጡ።", "pickImage");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showError("ፋይሉ 10MB በታች መሆን አለበት።", "pickImage");
    return;
  }

  selectedFile.value = file;
  fileName.value = file.name;
  fileSize.value = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  hasPickOrUploadError.value = false;

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result;
    selectedBase64.value = base64;
    uploadFile(base64);
  };
  reader.readAsDataURL(file);
}

function showError(message, type = "upload") {
  hasPickOrUploadError.value = true;
  errorMessage.value = message;
  errorType.value = type;
}

// Upload base64 to server
function uploadFile(base64) {
  const file = base64.split(",")[1];
  const input = { medias: [file] };
  uploadMutation({ input });
}

// GraphQL uploader
const {
  mutate: uploadMutation,
  onDone: handleUploadSuccess,
  onError: handleUploadError,
  loading: uploading,
} = mutator(upload, { showError: false });

handleUploadSuccess(({ data }) => {
  const urls = data?.upload_medias?.urls;
  if (urls?.length > 0) {
    imageUrl.value = urls[0];
  } else {
    showError("ፎቶ መላክ አልተሳካም።");
  }
});

handleUploadError(() => {
  errorType.value = "upload";
  showError("ፎቶ መላክ አልተሳካም።", "upload");
});

function retryAction() {
  hasPickOrUploadError.value = false;
  if (errorType.value === "upload" && selectedBase64.value) {
    uploadFile(selectedBase64.value);
  }
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
        v-else-if="uploading"
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
