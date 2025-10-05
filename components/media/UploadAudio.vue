<script setup>
import { ref, watch } from "vue";
import uploadAudio from "@/graphql/medias/upload.gql";
// Replace with your audio upload gql
import { useForm } from "vee-validate";

// Props & emits
const props = defineProps({
  modelValue: String, // audio URL
  reset: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const { resetForm } = useForm();

const audioUrl = ref(props.modelValue || "");
const fileName = ref("");
const fileSize = ref("");
const uploading = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    audioUrl.value = val;
  }
);
watch(audioUrl, (val) => {
  emit("update:modelValue", val);
});
watch(
  () => props.reset,
  (newVal) => {
    if (newVal) {
      resetForm();
      audioUrl.value = "";
      fileName.value = "";
      fileSize.value = "";
    }
  }
);

function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("audio/")) {
    alert("Only audio files are allowed.");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("File must be under 10MB.");
    return;
  }

  fileName.value = file.name;
  fileSize.value = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result;
    uploadFile(base64);
  };
  reader.readAsDataURL(file);
}

function uploadFile(base64) {
  const file = base64.split(",")[1]; // get base64 string without metadata prefix
  uploading.value = true;

  const input = {
    medias: [file],
  };
  uploadMutation({
    input,
  });
}

const {
  mutate: uploadMutation,
  loading: uploadingId,
  onDone: handleUploadSuccess,
  onError: handleUploadError,
} = mutator(uploadAudio, {});

handleUploadSuccess(({ data }) => {
  const urls = data?.upload_medias?.urls;
  if (urls?.length > 0) {
    audioUrl.value = urls[0];
  }
  uploading.value = false;
});

handleUploadError(() => {
  uploading.value = false;
  alert("Upload failed. Please try again.");
});
</script>

<template>
  <div class="w-full space-y-3">
    <!-- Hidden audio file input -->
    <input type="file" accept="audio/*" @change="handleFileChange" ref="fileInput" class="hidden" />

    <!-- No audio selected OR uploading -->
    <div v-if="!audioUrl || uploading"
      class="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg min-h-[136px] bg-background-light dark:bg-background-dark border-borderColor-light dark:border-borderColor-dark text-textSecondary-light dark:text-textSecondary-dark text-center text-sm">
      <template v-if="uploading">
        <div class="flex flex-col items-center gap-3">
          <div class="loader"></div>
          <p class="text-sm">Uploading...</p>
        </div>
      </template>
      <template v-else>
        <p class="mb-2">No audio selected</p>
        <p class="text-xs mb-4">MP3, WAV, OGG (max 10MB)</p>


        <button type="button" class="text-primary-light dark:text-primary-dark font-medium hover:underline transition"
          @click="$refs.fileInput.click()" :disabled="uploading || uploadingId">
          Select Audio
        </button>
      </template>
    </div>

    <!-- Audio selected and uploaded -->
    <div v-if="audioUrl && !uploading"
      class="flex flex-col gap-3 p-4 rounded-lg min-h-[112px] bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark">
      <audio :src="audioUrl" controls class="w-full rounded" />

      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
            {{ fileName }}
          </p>
          <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
            {{ fileSize }}
          </p>
        </div>

        <button type="button"
          class="px-3 py-1 text-xs font-medium border rounded text-primary-light border-primary-light dark:text-primary-dark dark:border-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition"
          @click="$refs.fileInput.click()" :disabled="uploading">
          Change Audio
        </button>
      </div>
    </div>
  </div>
</template>
