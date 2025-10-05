<template>
  <!-- 🚪 Create New Request Dialog -->
  <BaseDialog v-model="open" title="✍️ Create New Request" :autoClose="false">
    <template #content>
      <div class="max-w-3xl mx-auto">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Category Dropdown -->
            <SelectCategory
              v-model="category"
              label="Category"
              rules="required"
              show-label
              group-id="093864cd-e28b-4591-b8bc-70e44faa140b"
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

          <!-- For Who -->
          <div>
            <BaseInput
              id="forWho"
              name="forWho"
              label="For Who"
              v-model="forWho"
              placeholder="Enter the name of the person or group for whom you are praying"
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
          <!-- Visibility for group -->
          <div
            v-if="props.communityVisibility == 'private'"
            class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4"
          >
            <div class="mb-4">
              <h3
                class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
              >
                🔒 Prayer Request Visibility
              </h3>
              <p
                class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
              >
                Choose how your prayer request will be visible and accessible to
                others
              </p>
            </div>

            <div class="space-y-3">
              <!-- Public Option -->
              <label
                class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{
                  'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5':
                    visibility === 'public',
                }"
              >
                <input
                  type="radio"
                  value="public"
                  v-model="visibility"
                  class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                />
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <span
                      class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
                      >🌍 Public</span
                    >
                    <span
                      class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                      >Recommended</span
                    >
                  </div>
                  <p
                    class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
                  >
                    Everyone can read this prayer request publicly.
                  </p>
                </div>
              </label>

              <!-- Private Option -->
              <label
                class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{
                  'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5':
                    visibility === 'private',
                }"
              >
                <input
                  type="radio"
                  value="group_only"
                  v-model="visibility"
                  class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                />
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <span
                      class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
                      >🔐 Private</span
                    >
                    <span
                      class="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full"
                      >Controlled</span
                    >
                  </div>
                  <p
                    class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
                  >
                    Only members of the group can view this prayer request.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Optional Prayer Request Photo -->
          <div
            class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark"
          >
            <label
              class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
            >
              Prayer Request Photo
              <span
                class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >(optional)</span
              >
            </label>
            <MediaImageUpload v-model="photoUrl" :folder="'uploads/prayers'" />
          </div>

          <!-- ---------------------- Optional Prayer Request Images -->
          <div
            class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark"
          >
            <label
              class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
            >
              Additional Images for Prayer Request
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
    </template>
  </BaseDialog>
</template>

<script setup>
import addQuery from "@/graphql/prayers/add_request.gql";
import { useToast } from "vue-toast-notification";

const router = useRouter();
const { handleSubmit } = useForm();
const toast = useToast();

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  communityId: {
    type: String,
    required: false,
  },
  communityName: {
    type: String,
    required: false,
  },
  communityType: {
    type: String,
    default: "group",
  },
  communityVisibility: {
    type: String,
    default: "public",
  },
  role: {
    type: String,
    default: "group:admin",
  },
  language: {
    type: String,
    default: "en",
  },
});

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const refetchPrayerRequests = inject("refetchPrayerRequests");
const refetchPrayerRequest = inject("refetchPrayerRequest");

const title = ref("");
const description = ref("");
const language = ref(props.language);
const category = ref("");
const images = ref([]);
const audioUrl = ref("");
const visibility = ref(props.communityVisibility); // Default visibility\
const photoUrl = ref("");
const forWho = ref(props.communityName);

// GraphQL: Add Prayer Request
const { mutate, onDone, loading } = mutator(addQuery, {
  clientId: "auth",
  role: props.role,
});

const onSubmit = handleSubmit(() => {
  // Process medias
  const medias = [...images.value];
  if (audioUrl.value?.length) {
    medias.push(audioUrl.value);
  }

  const input = {
    title: title.value,
    description: description.value,
    category_id: category.value,
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
    feed: {
      data: {
        type: "prayer_request",
        visibility: visibility.value,
      },
    },
  };

  if (props.communityType == "group") {
    input.feed.data.group_id = props.communityId;
  } else if (props.communityType == "page") {
    input.feed.data.page_id = props.communityId;
  }
  mutate({ input });
});

onDone(({ data }) => {
  const newRequest = data?.insert_prayer_requests_one;
  if (newRequest) {
    toast.success("Prayer request submitted successfully!", {
      position: "top-right",
    });

    if (typeof refetchPrayerRequests == "function") {
      refetchPrayerRequests();
    }
    if (typeof refetchPrayerRequest == "function") {
      refetchPrayerRequest();
    }
    open.value = false;
  } else {
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });
  }
});
</script>
