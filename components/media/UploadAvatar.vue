<script setup>
import { ref, watch } from "vue";
import upload from "@/graphql/medias/upload.gql";
import updateUserMutation from "@/graphql/auth/update_user.gql";
import { useToast } from "vue-toast-notification";

const props = defineProps({
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);
const toast = useToast();

const user = useCookie("userData");
const imageUrl = ref(props.modelValue || "");
const uploading = ref(false);

// የ ውጭ  v-model ለውጦችን መከታተል
watch(
  () => props.modelValue,
  (val) => {
    imageUrl.value = val;
  }
);
watch(imageUrl, (val) => {
  emit("update:modelValue", val);
});

// ፋይል ሲመረጥ የሚጠራ
function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("የምስል ፋይሎች ብቻ ይፈቀዳሉ።");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("ፋይሉ ከ 10MB በታች መሆን አለበት።");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result;
    uploadFile(base64);
  };
  reader.readAsDataURL(file);
}

// GraphQL የመስመር ላይ መጫኛ
const {
  mutate: uploadMutation,
  onDone: handleUploadSuccess,
  onError: handleUploadError,
} = mutator(upload, {
  clientId: "auth",
});

handleUploadSuccess(({ data }) => {
  const urls = data?.upload_medias?.urls;
  if (urls?.length) {
    imageUrl.value = urls[0];
  }

  updateProfile();
});

handleUploadError(() => {
  uploading.value = false;
});

// የ base64 ፋይል መጫኛ
function uploadFile(base64) {
  const file = base64.split(",")[1];
  uploading.value = true;
  uploadMutation({ input: { medias: [file] } });
}

// ምስል ከተጫነ በኋላ የተጠቃሚ profile_image ማዘመን
const {
  mutate: updateUserMutate,
  onDone: updateUserDone,
  loading: updateUserLoading,
} = mutator(updateUserMutation, {
  clientId: "auth",
});

updateUserDone(({ data }) => {
  if (data?.update_users_by_pk) {
    let newUser = { ...user.value };
    newUser.profile_image = imageUrl.value;
    user.value = newUser;
    toast.success("የመገለጫ ምስል በትክክል ተሻሽሏል።", {
      position: "top-right",
    });
  }
  uploading.value = false;
});

// ---- አዘምን አስኪያጅ ----
const updateProfile = () => {
  updateUserMutate({
    input: { profile_image: imageUrl.value },
    id: user.value.id,
  });
};
</script>
<template>
  <section class="flex flex-col items-center gap-3 mb-8">
    <!-- Avatar Wrapper -->
    <div class="relative group">
      <!-- File Input -->
      <input
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
        ref="fileInput"
      />

      <!-- Avatar or Placeholder -->
      <div
        class="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg bg-slate-100 dark:bg-slate-800"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt="Avatar"
          class="w-full h-full object-cover"
        />
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-full h-full text-gray-400 dark:text-gray-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      </div>

      <!-- Overlay update button (appears on hover) -->
      <button
        @click="$refs.fileInput.click()"
        class="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary-light text-white flex items-center justify-center shadow-lg border border-white dark:border-slate-700 transition group-hover:scale-110"
        :disabled="uploading"
        title="መገለጫ ምስል ቀይር"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
          />
        </svg>
      </button>

      <!-- Loading overlay -->
      <div
        v-if="uploading"
        class="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full z-10"
      >
        <svg
          class="animate-spin h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    </div>

    <!-- Caption -->
    <p
      class="text-sm text-textSecondary-light dark:text-textSecondary-dark text-center"
    >
      መገለጫ ምስል ቀይር
    </p>
  </section>
</template>
