<script setup>
import updatePrayerRequestMutation from "@/graphql/prayers/update_request.gql";
import { useForm } from "vee-validate";

import { useToast } from "vue-toast-notification";

const { $mediaUtils } = useNuxtApp();

const { handleSubmit } = useForm();

const router = useRouter();
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: Boolean,
  prayerRequest: {
    type: Object,
    required: true,
  },
});

const toast = useToast();

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const refetchPrayerRequest = inject("refetchPrayerRequest");
const refetchPrayerRequests = inject("refetchPrayerRequests");




// form states
const form = ref({
  title: props.prayerRequest?.title,
  forWho: props.prayerRequest?.for_who,
  description: props.prayerRequest?.description,
  language: props.prayerRequest?.language,
  category_id: props.prayerRequest?.category_id,
  photoUrl: props.prayerRequest?.photo_url,
  audioUrl:
    props.prayerRequest?.medias?.find((prayerMedia) =>
      $mediaUtils.isAudioUrl(prayerMedia.url)
    )?.url || "",
  images: props.prayerRequest?.medias
    ?.filter((prayerMedia) => $mediaUtils.isImageUrl(prayerMedia.url))
    ?.map((prayerMedia) => prayerMedia.url),

  visibility: props.prayerRequest?.visibility || "public", // Default visibility
});

const hasChanges = computed(() => {
  const original = props.prayerRequest;
  return (
    form.value.title !== original.title ||
    form.value.forWho !== original.for_who ||
    form.value.photoUrl !== original.photo_url ||
    form.value.description !== original.description ||
    form.value.category_id !== original.category_id ||
    form.value.language !== original.language ||
    form.value.visibility !== original.visibility
  );
});

const hasMediaChange = computed(() => {
  const original = props.prayerRequest;

  const originalImages =
    original.medias
      ?.filter((media) => $mediaUtils.isImageUrl(media.url))
      ?.map((media) => media.url) || [];

  const originalAudio =
    original.medias?.find((media) => $mediaUtils.isAudioUrl(media.url))?.url ||
    "";

  const imagesChanged =
    originalImages.length !== form.value.images.length ||
    originalImages.some((url, idx) => url !== form.value.images[idx]);

  const audioChanged = form.value.audioUrl !== originalAudio;

  return imagesChanged || audioChanged;
});

const { mutate, onDone, loading } = mutator(updatePrayerRequestMutation, {
  clientId: route.query.edit_token ? "default" : "auth",
});

const onSubmit = handleSubmit(() => {
  const medias = form.value.images;

  if (form.value.audioUrl?.length) {
    medias.push(form.value.audioUrl);
  }
  const input = {
    id: props.prayerRequest?.id,
    title: form.value.title,
    for_who: form.value.forWho,
    photo_url: form.value.photoUrl,
    description: form.value.description,
    category_id: form.value.category_id,
    language: form.value.language,
    edit_token: route.query.edit_token || null,
    status: props.prayerRequest?.status || "pending",
    medias: medias,
    update_media: hasMediaChange.value,
    visibility: form.value.visibility,
    is_deleted: false,
  };
  mutate({
    input,
  });
});

onDone(({ data }) => {
  if (data.update_prayer_request) {
    if (typeof refetchPrayerRequest === "function") {
      refetchPrayerRequest();
    }
    if (typeof refetchPrayerRequests === "function") {
      refetchPrayerRequests();
    }
    // ✅ Show success toast
    toast.success("Prayer request updated successfully", {
      position: "top-right",
    });
    open.value = false;
  }
});
</script>

<template>
  <!-- ----------Check Prayer  Dialog-------- -->

  <BaseDialog v-model="open" title="Update Prayer Request">
    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Category Dropdown -->




          <SelectCategory v-model="form.category_id" label="Category" rules="required" show-label
            :init="prayerRequest.category" group-id="093864cd-e28b-4591-b8bc-70e44faa140b" />
          <!-- Language Dropdown -->
          <SelectLanguage v-model="form.language" label="Language" rules="required" />
        </div>


        <!-- Title -->
        <div>
          <BaseInput id="title" name="title" label="Title" v-model="form.title"
            placeholder="Enter a short title for your prayer request" rules="required" />
        </div>

        <!-- For Who -->
        <div>
          <BaseInput id="forWho" name="forWho" label="For Who" v-model="form.forWho"
            placeholder="Enter the name of the person or group for whom you are praying" />
        </div>

        <!-- Description -->

        <div>
          <BaseTextInput id="description" name="description" label="Description" v-model="form.description"
            placeholder="Enter a short description for your prayer request" rules="required" />
        </div>

        <!-- Visibility  for group -->
        <div v-if="prayerRequest.feed?.group?.visibility == 'private'"
          class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4">
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
              🔒 Prayer Request Visibility
            </h3>
            <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
              Choose how your prayer request will be visible and accessible to others
            </p>
          </div>

          <div class="space-y-3">
            <!-- Public Option -->
            <label
              class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': visibility === 'public' }">
              <input type="radio" value="public" v-model="visibility"
                class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🌍
                    Public</span>
                  <span
                    class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">Recommended</span>
                </div>
                <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                  Everyone can read this prayer request publicly.
                </p>
              </div>
            </label>

            <!-- Private Option -->
            <label
              class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': visibility === 'private' }">
              <input type="radio" value="group_only" v-model="visibility"
                class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🔐
                    Private</span>
                  <span
                    class="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">Controlled</span>
                </div>
                <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                  Only members of the group can view this prayer request.
                </p>
              </div>
            </label>

          </div>
        </div>


        <!-- Optional Prayer Request Photo -->
        <div
          class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark">
          <label class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
            Prayer Request Photo
            <span class="text-sm text-textSecondary-light dark:text-textSecondary-dark">(optional)</span>
          </label>
          <MediaImageUpload v-model="form.photoUrl" :folder="'uploads/prayers'" />
        </div>

        <!-- ---------------------- Optional Prayer Request Images -->
        <div
          class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark">
          <label class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
            Additional Images for Prayer Request
            <span class="text-sm text-textSecondary-light dark:text-textSecondary-dark">(optional)</span>
          </label>

          <MediaUploadManyImages v-model="form.images" :folder="'uploads/posts'" :maxFileSize="2_000_000"
            :fileLimit="5" />
        </div>

        <!-- ---------------------- Optional Prayer Request Audio -->
        <div
          class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark">
          <label for="audio-upload"
            class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
            Upload Audio
            <span class="text-sm text-textSecondary-light dark:text-textSecondary-dark">(optional)</span>
          </label>

          <MediaUploadAudio v-model="form.audioUrl" id="audio-upload" />
        </div>

        <!-- Submit Button -->
        <BaseButton :disabled="(!hasChanges && !hasMediaChange) || loading" :loading="loading">
          <span class="text-white" v-if="!loading">🙏 Submit Request</span>
          <span class="text-white" v-else>Loading...</span>
        </BaseButton>
      </form>
    </template>
  </BaseDialog>
</template>
