<script setup>
import { ref, reactive, watch, defineExpose } from "vue";
import { Cropper, CircleStencil, RectangleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import upload from "@/graphql/medias/upload.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["upload"]);
const props = defineProps({
  aspectRatio: { type: Number, default: 1 }, // aspect ratio to use
  stencilComponent: { type: String, default: "rectangle" },
  cropperClass: { type: String, default: "" },
  title: { type: String, default: "Crop Image" },
});

const fileInput = ref(null);
const files = ref([]);
const type = ref("");
const base64String = ref("");
const openModal = ref(false);
const uploading = ref(false);

// Original image natural dimensions
const originalImageWidth = ref(0);
const originalImageHeight = ref(0);

// Coordinates reactive object for crop box
const coordinates = reactive({ left: 0, top: 0, width: 0, height: 0 });

function openFilePicker() {
  fileInput.value?.click();
}

function onFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("File size must be less than 5MB");
    return;
  }

  file.objectURL = URL.createObjectURL(file);
  type.value = file.type;
  files.value = [file];

  const img = new Image();
  img.onload = () => {
    originalImageWidth.value = img.width;
    originalImageHeight.value = img.height;

    setMaxCropBox();
  };
  img.src = file.objectURL;

  openModal.value = true;
}

function setMaxCropBox() {
  const imgWidth = originalImageWidth.value;
  const imgHeight = originalImageHeight.value;
  const ratio = props.aspectRatio;

  let width = imgWidth;
  let height = width / ratio;

  if (height > imgHeight) {
    height = imgHeight;
    width = height * ratio;
  }

  coordinates.left = (imgWidth - width) / 2;
  coordinates.top = (imgHeight - height) / 2;
  coordinates.width = width;
  coordinates.height = height;
}

function change({ canvas }) {
  if (!canvas) return;

  canvas.toBlob(
    (blob) => {
      if (!blob) return;

      const reader = new FileReader();
      reader.onload = () => {
        base64String.value = reader.result;
      };
      reader.readAsDataURL(blob);
    },
    type.value,
    0.9
  );
}

function crop() {
  if (!base64String.value) {
    alert("Please crop the image first");
    return;
  }

  uploading.value = true;
  uploadFile(base64String.value);
}

function cancel() {
  openModal.value = false;
  resetState();
}

function resetState() {
  files.value = [];
  base64String.value = "";
  type.value = "";
  originalImageWidth.value = 0;
  originalImageHeight.value = 0;

  coordinates.left = 0;
  coordinates.top = 0;
  coordinates.width = 0;
  coordinates.height = 0;

  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

watch(openModal, (newVal) => {
  if (!newVal) {
    resetState();
  }
});

defineExpose({ openFilePicker });

// GraphQL uploader setup
const {
  mutate: uploadMutation,
  onDone: handleUploadSuccess,
  onError: handleUploadError,
} = mutator(upload, {});

handleUploadSuccess(({ data }) => {
  const urls = data?.upload_medias?.urls;
  if (urls?.length) {
    // Update v-model with the uploaded URL
    emit("upload", urls[0]);
  }
  uploading.value = false;
  openModal.value = false;
  resetState();
});

handleUploadError((error) => {
  console.error("Upload error:", error);
  toast.error("Failed to upload image. Please try again.", {
    position: "top-right",
  });
  uploading.value = false;
});

// Upload base64 file
function uploadFile(base64) {
  const file = base64.split(",")[1];
  uploading.value = true;
  uploadMutation({ input: { medias: [file] } });
}
</script>

<template>
  <input
    ref="fileInput"
    type="file"
    accept="image/*"
    class="hidden"
    @change="onFileSelect"
  />

  <BaseDialog v-model="openModal" :title="title" wrapperClass="max-w-4xl">
    <template #content>
      <div class="space-y-6 max-h-[80vh] overflow-y-auto">
        <div class="relative">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div v-if="files[0]?.objectURL" class="w-full min-h-[100px]">
              <cropper
                :class="[
                  'w-full max-h-[60vh] bg-gray-100 dark:bg-gray-900',
                  cropperClass,
                ]"
                :src="files[0]?.objectURL"
                :coordinates="coordinates"
                :stencil-component="
                  stencilComponent === 'rectangle'
                    ? RectangleStencil
                    : CircleStencil
                "
                :stencil-props="{ aspectRatio }"
                @change="change"
              />
            </div>

            <div
              v-else
              class="h-[400px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900"
            >
              <div class="text-center">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light dark:border-primary-dark mx-auto mb-2"
                ></div>
                <p class="text-gray-500 dark:text-gray-400">Loading image...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Fixed Action Buttons -->
        <div
          class="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 border-t border-gray-200 dark:border-gray-700 z-10"
        >
          <div class="flex justify-between gap-3">
            <button
              @click="cancel"
              class="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              :disabled="uploading"
            >
              Cancel
            </button>
            <button
              @click="crop"
              class="flex items-center gap-2 px-6 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-light transition-colors shadow-md hover:shadow-lg"
              :disabled="uploading || !base64String"
            >
              <div
                v-if="uploading"
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
              ></div>
              <Icon v-else name="mdi:check" size="16" />
              <span>{{ uploading ? "Uploading..." : "Crop & Upload" }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>
/* Custom cropper styles */
:deep(.vue-advanced-cropper) {
  border-radius: 0.5rem;
}

:deep(.vue-advanced-cropper__background) {
  background-color: #f3f4f6;
}

:deep(.vue-advanced-cropper__stencil-grid) {
  color: rgba(59, 130, 246, 0.5);
}

:deep(.vue-advanced-cropper__stencil-handler) {
  background-color: #3b82f6;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.vue-advanced-cropper__stencil-line) {
  background-color: #3b82f6;
}

/* Dark mode support */
.dark :deep(.vue-advanced-cropper__background) {
  background-color: #1f2937;
}

.dark :deep(.vue-advanced-cropper__stencil-grid) {
  color: rgba(147, 197, 253, 0.5);
}

.dark :deep(.vue-advanced-cropper__stencil-handler) {
  background-color: #93c5fd;
  border: 2px solid #374151;
}

.dark :deep(.vue-advanced-cropper__stencil-line) {
  background-color: #93c5fd;
}
</style>
