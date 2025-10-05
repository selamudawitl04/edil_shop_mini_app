<template>
  <!-- ✨ Create New Devotion Dialog -->
  <BaseDialog
    v-model="open"
    title="📖 Create New Devotion"
    :autoClose="false"
    body-class="max-w-3xl"
  >
    <template #content>
      <!-- ----------------Select Type ---------------- -->

      <div v-if="activeSection === 'type'">
        <DevotionsCreateType
          v-model="devotionType"
          @devotion-type-selected="onDevotionTypeSelected"
        />
      </div>

      <!-- ----------------Select Series ---------------- -->

      <div v-else-if="activeSection === 'series'" class="w-full">
        <DevotionsCreateSelectSeries
          v-model="selectedSeries"
          @series-selected="onSeriesSelected"
          :community-id="props.communityId"
          :community-type="props.communityType"
          :role="props.role"
          @previous="activeSection = 'type'"
          :is-private-group="isPrivateGroup"
        />
      </div>

      <div v-else class="">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Devotion Form -->
          <div class="space-y-6">
            <!-- Title -->
            <BaseInput
              id="title"
              name="title"
              label="Title"
              v-model="title"
              placeholder="Enter a title for the devotion"
              rules="required"
            />

            <!-- Content -->
            <BaseTextEditor
              id="content"
              name="content"
              label="Devotion Content"
              v-model="content"
              placeholder="Write the main body of the devotion here"
              rules="required"
              :min-height="'300px'"
              :max-height="'600px'"
            />

            <!-- Visibility -->
            <div
              v-if="
                props.communityType === 'group' &&
                !selectedSeries &&
                isPrivateGroup
              "
              class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4"
            >
              <div class="mb-4">
                <h3
                  class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
                >
                  🔒 Devotion Visibility
                </h3>
                <p
                  class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
                >
                  Choose how your devotion will be visible and accessible to
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
                      Everyone can read this devotion publicly.
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
                      Only members of the group can view this devotion.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Optional Cover Image -->
            <div
              class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark"
            >
              <label
                class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
              >
                Cover Image
                <span
                  class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                  >(optional)</span
                >
              </label>
              <MediaImageUpload
                v-model="coverImage"
                :folder="'uploads/devotions'"
              />
            </div>

            <div class="flex justify-between items-center w-full">
              <BaseButton
                v-if="allowSeriesSelect"
                variant="outline"
                @click="backToPreviousFromForm"
                :full="false"
              >
                Previous
              </BaseButton>

              <!-- Submit -->
              <BaseButton
                :loading="loading"
                :disabled="loading"
                :full="!allowSeriesSelect"
              >
                <span class="text-white" v-if="!loading">📖 Submit</span>
                <span class="text-white" v-else>Loading...</span>
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import addDevotion from "@/graphql/devotions/create.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  communityId: {
    type: String,
    required: false,
  },
  communityType: {
    type: String,
    default: "group",
  },

  role: {
    type: String,
    default: "group:admin",
  },
  allowTypeSelect: {
    type: Boolean,
    default: true,
  },
  allowSeriesSelect: {
    type: Boolean,
    default: true,
  },

  preselectedSeries: {
    type: Object,
    default: null,
  },
  isPrivateGroup: {
    type: Boolean,
    default: false,
  },
});

const activeSection = ref("type");
if (!props.allowTypeSelect && props.allowSeriesSelect) {
  activeSection.value = "series";
} else if (!props.allowTypeSelect && !props.allowSeriesSelect) {
  activeSection.value = "content";
}

const backToPreviousFromForm = () => {
  if (devotionType.value === "series") {
    activeSection.value = "series";
  } else {
    activeSection.value = "type";
  }
};

const refetchDevotions = inject("refetchDevotions");
const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

// Watch for dialog opening and show devotion type dialog immediately
watch(open, (newVal) => {
  if (newVal && !devotionType.value) {
    showDevotionTypeDialog.value = true;
  }
});

const title = ref("");
const content = ref("");
const visibility = ref("public");
const coverImage = ref("");
const devotionType = ref(null);
const selectedSeries = ref(props.preselectedSeries || null);

if (props.preselectedSeries) {
  devotionType.value = "series";
  activeSection.value = "content";
  visibility.value = props.preselectedSeries?.feed?.visibility;
}

const { mutate, onDone, loading } = mutator(addDevotion, {
  clientId: "auth",
  role: props.role,
});

/*--------------------------Select devotion type ---------------- */
const onDevotionTypeSelected = (type) => {
  if (type == "series") {
    activeSection.value = "series";
  } else {
    activeSection.value = "content";
  }
  devotionType.value = type;
};

/*--------------------------Select series ---------------- */
const onSeriesSelected = (series) => {
  selectedSeries.value = series;
  activeSection.value = "content";
  visibility.value = selectedSeries.value?.visibility;
};

const onSubmit = handleSubmit(() => {
  const input = {
    title: title.value,
    content: content.value,
    cover_image: coverImage.value || null,
    feed: {
      data: {
        type: "devotion",
        visibility: visibility.value,
      },
    },
  };

  // Add series_id if it's a series devotion
  if (devotionType.value === "series" && selectedSeries.value) {
    input.series_id = selectedSeries.value.id;
  }
  if (props.communityType == "group") {
    input.feed.data.group_id = props.communityId;
  } else if (props.communityType == "page") {
    input.feed.data.page_id = props.communityId;
  }

  mutate({ input });
});

onDone(({ data }) => {
  if (data?.insert_devotion_devotions_one) {
    toast.success("Devotion submitted successfully!", {
      position: "top-right",
    });
    open.value = false;
    if (typeof refetchDevotions === "function") {
      refetchDevotions();
    }
    // Reset form
    title.value = "";
    content.value = "";
    visibility.value = "public";
    coverImage.value = "";
  } else {
    toast.error("Failed to submit devotion. Please try again.");
  }
});
</script>
