<template>
  <!-- ✨ Create New Devotion Dialog -->
  <BaseDialog v-model="open" title="📖 Create New Devotion" :autoClose="false">
    <template #content>
      <div class="max-w-3xl mx-auto">
        <form @submit.prevent="onSubmit" class="space-y-6">

          <!-- Devotion Type Selection -->
          <div v-if="!devotionType" class="space-y-4">
            <DevotionTypeDialog v-model="showDevotionTypeDialog" @devotion-type-selected="onDevotionTypeSelected" />
          </div>

          <!-- Devotion Form -->
          <div v-else class="space-y-6">


            <!-- Title -->
            <BaseInput id="title" name="title" label="Title" v-model="title"
              placeholder="Enter a title for the devotion" rules="required" />

            <!-- Series Selection (if devotion type is series) -->
            <div v-if="devotionType === 'series'" class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                  📚 Devotion Series
                </h3>
                <button type="button" @click="showSeriesDialog = true"
                  class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-borderColor-light dark:border-borderColor-dark text-textPrimary-light dark:text-textPrimary-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <Icon name="mdi:book-multiple" size="16" class="mr-2" />
                  {{ selectedSeries ? selectedSeries.title : 'Select Series' }}
                </button>
              </div>
            </div>




            <!-- Content -->
            <BaseTextEditor id="content" name="content" label="Devotion Content" v-model="content"
              placeholder="Write the main body of the devotion here" rules="required" :min-height="'300px'"
              :max-height="'600px'" />

            <!-- Visibility -->
            <div v-if="props.communityType === 'group'"
              class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4">
              <div class="mb-4">
                <h3 class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                  🔒 Devotion Visibility
                </h3>
                <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                  Choose how your devotion will be visible and accessible to others
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
                      Everyone can read this devotion publicly.
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
                      Only members of the group can view this devotion.
                    </p>
                  </div>
                </label>

              </div>
            </div>





            <!-- Optional Cover Image -->
            <div
              class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark">
              <label class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                Cover Image
                <span class="text-sm text-textSecondary-light dark:text-textSecondary-dark">(optional)</span>
              </label>
              <MediaImageUpload v-model="coverImage" :folder="'uploads/devotions'" />
            </div>

            <!-- Submit -->
            <BaseButton :loading="loading" :disabled="loading">
              <span class="text-white" v-if="!loading">📖 Submit Devotion</span>
              <span class="text-white" v-else>Loading...</span>
            </BaseButton>
          </div>
        </form>

        <!-- Devotion Series Selection Dialog -->
        <DevotionSeries v-if="showSeriesDialog" v-model="showSeriesDialog" :selected-series-value="selectedSeries"
          :community-id="props.communityId" :community-type="props.communityType" :role="props.role"
          @series-selected="onSeriesSelected" />
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import addDevotion from "@/graphql/devotions/create.gql";
import { useToast } from "vue-toast-notification";
import DevotionTypeDialog from "~/components/select/DevotionTypeDialog.vue";
import DevotionSeries from "~/components/select/DevotionSeries.vue";

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

});


const refetchDevotions = inject("refetchDevotions");
const refetchSerieses = inject("refetchSerieses");

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
const selectedSeries = ref(null);
const showDevotionTypeDialog = ref(false);
const showSeriesDialog = ref(false);

const { mutate, onDone, loading } = mutator(addDevotion, {
  clientId: "auth",
  role: props.role,
});

const onDevotionTypeSelected = (type) => {
  devotionType.value = type;
  showDevotionTypeDialog.value = false;
};

const onSeriesSelected = (series) => {
  selectedSeries.value = series;
  showSeriesDialog.value = false;
};

const onSubmit = handleSubmit(() => {
  const input = {
    title: title.value,
    content: content.value,
    visibility: visibility.value,
    cover_image: coverImage.value || null,
  };

  // Add series_id if it's a series devotion
  if (selectedSeries.value) {
    input.series_id = selectedSeries.value.id;

  }

  // Note: page_id and group_id are now handled through the feeds table
  // The backend will create the appropriate feed entry

  mutate({ input });
});

onDone(({ data }) => {
  if (data?.insert_devotion_devotions_one) {
    toast.success("Devotion submitted successfully!", { position: "top-right" });
    open.value = false;
    if (typeof refetchDevotions === "function") {
      refetchDevotions();
    }
    if (typeof refetchSerieses === "function") {
      refetchSerieses();
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
