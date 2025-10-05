<script setup>
import addQuery from "@/graphql/prayers/add_request.gql";
import { useToast } from "vue-toast-notification";

const router = useRouter();
const { handleSubmit } = useForm();
const toast = useToast();

const userData = useCookie("userData");

const title = ref("");
const description = ref("");
const language = ref("");
const category = ref("");
const prayerRequestId = ref("");
const photoUrl = ref("");
const images = ref([]);

const audioUrl = ref("");
const forWho = ref("");

const postToProfile = ref(false);
const useProfileImage = ref(false);
watch(useProfileImage, (newVal) => {
  if (newVal) {
    photoUrl.value = userData.value?.profile_image;
  } else {
    photoUrl.value = "";
  }
});

// Generate a unique token (for anonymous users)
function generateEditToken(length = 24) {
  const array = new Uint8Array(length / 2); // 2 hex chars per byte
  window.crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

const editToken = ref("");
const showCopyTokenDialog = ref(false);
const showCopyResponse = ref(false);

const copyDescription = computed(() => {
  return editToken.value
    ? `Please copy and save this token (${editToken.value}) in a safe place. You’ll need it if you want to edit or delete your prayer request in the future.`
    : "You will receive a unique token after submitting your prayer. Save it to manage your prayer later.";
});

// Copy token to clipboard
const copyToClipboard = async (confirmed) => {
  if (confirmed && editToken.value) {
    try {
      await navigator.clipboard.writeText(editToken.value);
      showCopyResponse.value = true;
      toast.success("Edit token copied to clipboard.", {
        position: "top-right",
      });
    } catch (err) {
      console.error("Clipboard error:", err);
      toast.error("Failed to copy token to clipboard.", {
        position: "top-right",
      });
    }
  } else {
    toast.info("Token copy canceled.", { position: "top-right" });
  }

  showCopyTokenDialog.value = false;
};

const onClose = () => {
  router.push(`/prayer-requests/${prayerRequestId.value}`);
};

// GraphQL: Add Prayer Request
const { mutate, onDone, loading } = mutator(addQuery, { clientId: "auth" });

const onSubmit = handleSubmit(() => {
  // Process medias

  const medias = [...images.value];

  if (audioUrl.value?.length) {
    medias.push(audioUrl.value);
  }

  const input = {
    title: title.value,
    description: description.value,
    prayer_category: category.value,
    language: language.value,
    for_who: forWho.value,
    photo_url: photoUrl.value,
    prayer_request_medias: {
      data: medias.map((media) => {
        return {
          url: media,
        };
      }),
    },
    post_to_my_profile: postToProfile.value,
  };

  if (!userData.value) {
    const token = generateEditToken();
    input.edit_token = token;
    editToken.value = token;
  }

  mutate({ input });
});

onDone(({ data }) => {
  const newRequest = data?.insert_prayer_requests_one;
  if (newRequest) {
    prayerRequestId.value = newRequest.id;

    if (!userData.value) {
      showCopyTokenDialog.value = true;
    } else {
      toast.success("Prayer request submitted successfully!", {
        position: "top-right",
      });
      router.push(`/prayer-requests/${newRequest.id}`);
    }
  } else {
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });
  }
});
</script>

<template>
  <BaseConfirmation
    v-model="showCopyTokenDialog"
    confirm-button="Copy"
    :description="copyDescription"
    title="Copy edit token"
    icon="uil:copy"
    icon-class="text-primary text-2xl"
    :show-response="showCopyResponse"
    confirm-msg="Your prayer request has been added. The edit token has been copied to your clipboard."
    confirm-title="Copied"
    cancel-msg="Copy to clipboard is canceled"
    @confirm="copyToClipboard"
    @finally="onClose"
  />

  <NuxtLayout>
    <section
      class="bg-card-light dark:bg-card-dark pb-16 pt-32 px-4 sm:px-8 md:px-16 lg:px-32"
    >
      <div class="max-w-3xl mx-auto">
        <h2
          class="text-2xl font-bold mb-8 text-textPrimary-light dark:text-textPrimary-dark text-center"
        >
          ✍️ Submit a Prayer Request
        </h2>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Category Dropdown -->
            <SelectCategory
              v-model="category"
              label="Category"
              rules="required"
              :show-label="true"
            />
            <!-- Language Dropdown -->
            <SelectLanguage
              v-model="language"
              label="Language"
              rules="required"
              show-label
            />
          </div>

          <!-- Title -->

          <div>
            <BaseInput
              id="title"
              name="title"
              label="Title"
              v-model="title"
              placeholder="Enter a short title for your prayer request"
              rules="required"
            />
          </div>
          <!-- Name -->

          <div>
            <BaseInput
              id="name"
              name="name"
              label="Name (optional)"
              v-model="forWho"
              placeholder="Optional – Who or what is this prayer request for?"
              rules=""
            />
          </div>

          <!-- Description -->

          <div>
            <BaseTextInput
              id="description"
              name="description"
              label="Description"
              v-model="description"
              placeholder="Enter a short description for your prayer request"
              rules="required"
            />
          </div>

          <!-- Post to profile checkbox -->

          <div
            v-if="userData"
            class="mt-4 rounded-lg border border-borderColor-light bg-background-light p-4 dark:border-borderColor-dark dark:bg-background-dark"
          >
            <div class="flex items-start space-x-3">
              <input
                type="checkbox"
                id="postToProfile"
                v-model="postToProfile"
                class="mt-1.5 h-5 w-5 text-primary-light border-borderColor-light rounded focus:ring-primary-light dark:text-primary-dark dark:border-borderColor-dark dark:focus:ring-primary-dark"
              />
              <label
                for="postToProfile"
                class="cursor-pointer text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark font-sans"
              >
                Post this prayer request to my profile
              </label>
            </div>

            <div
              class="mt-2 ml-8 flex items-start text-sm text-textSecondary-light dark:text-textSecondary-dark font-sans"
            >
              <Icon
                name="mdi:alert-circle-outline"
                class="h-4 w-4 text-accent-light dark:text-accent-dark mt-[2px] mr-1.5 shrink-0"
              />
              <p class="text-sm">
                This prayer request will appear on your profile and people will
                know you posted it.
              </p>
            </div>
          </div>

          <!-- ---------------------- Main Image Upload with label -->
          <div
            class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark"
          >
            <label
              for="mainPrayerImage"
              class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark font-sans"
            >
              Main Image for Your Prayer Request
              <span
                class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >(optional)</span
              >
            </label>

            <!-- Your image upload component -->
            <MediaImageUpload id="mainPrayerImage" v-model="photoUrl" />

            <!-- Checkbox to use profile image -->
            <div
              v-if="userData?.profile_image"
              class="mt-4 flex items-center space-x-3"
            >
              <input
                type="checkbox"
                id="useProfileImage"
                v-model="useProfileImage"
                class="mt-1.5 h-5 w-5 text-primary-light border-borderColor-light rounded focus:ring-primary-light dark:text-primary-dark dark:border-borderColor-dark dark:focus:ring-primary-dark cursor-pointer"
              />
              <label
                for="useProfileImage"
                class="cursor-pointer text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark font-sans select-none"
              >
                Use my profile image as the main image
              </label>
            </div>
          </div>

          <!-- ---------------------- Optional Prayer Request Images -->
          <div
            class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark"
          >
            <label
              class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
            >
              Additional Images for Your Prayer Request
              <span
                class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >(optional)</span
              >
            </label>

            <MediaUploadManyImages
              v-model="images"
              :folder="'uploads/posts'"
              :maxFileSize="2_000_000"
              :fileLimit="5"
            />
          </div>

          <!-- ---------------------- Optional Prayer Request Audio -->
          <div
            class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark"
          >
            <label
              for="audio-upload"
              class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
            >
              Upload Audio
              <span
                class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >(optional)</span
              >
            </label>

            <MediaUploadAudio v-model="audioUrl" id="audio-upload" />
          </div>

          <!-- Submit Button -->

          <BaseButton :loading="loading" :disabled="loading">
            <span class="text-white" v-if="!loading">🙏 Submit Request</span>
            <span class="text-white" v-else>Loading...</span>
          </BaseButton>
        </form>
      </div>
    </section>
  </NuxtLayout>
</template>
