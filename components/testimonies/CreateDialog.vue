<script setup>
import createTestimony from "@/graphql/testimonies/create.gql";
import { useToast } from "vue-toast-notification";
import { useForm } from "vee-validate";
import { useTestimonyStore } from "@/stores/testimony";

const testimonyStore = useTestimonyStore();

const toast = useToast();

const { handleSubmit } = useForm();

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "success"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
const refetchTestimonies = inject("refetchTestimonies");

const title = ref("");
const content = ref("");
const visibility = ref("public");
const coverImage = ref("");

const { mutate, onDone, loading } = mutator(createTestimony, {
  clientId: "auth",
  role: testimonyStore.create.role,
});

const onSubmit = handleSubmit(() => {
  const input = {
    title: title.value,
    content: content.value,
    cover_image: coverImage.value || null,
    prayer_request_id: testimonyStore.create.prayerRequestId || null,
    feed: {
      data: {
        type: "testimony",
        visibility: visibility.value,
      },
    },
  };

  if (testimonyStore.create.communityType === "group") {
    input.feed.data.group_id = testimonyStore.create.communityId;
  } else if (testimonyStore.create.communityType === "page") {
    input.feed.data.page_id = testimonyStore.create.communityId;
  }

  mutate({ input });
});

onDone(({ data }) => {
  if (data?.insert_testimony_testimonies_one) {
    toast.success("Testimony submitted successfully!", {
      position: "top-right",
    });
    open.value = false;

    // Reset form
    title.value = "";
    content.value = "";
    visibility.value = "public";
    coverImage.value = "";

    // Emit success event for parent to refetch data
    if (typeof refetchTestimonies === "function") {
      refetchTestimonies();
    } else {
      emit("success");
    }
  } else {
    toast.error("Failed to submit testimony. Please try again.");
  }
});

const onClose = () => {
  open.value = false;
};
</script>

<template>
  <BaseDialog v-model="open" title="Share Your Testimony" @close="onClose">
    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Title -->

        <div>
          <BaseInput
            id="title"
            name="title"
            label="Title"
            v-model="title"
            placeholder="Give your testimony a meaningful title"
            rules="required"
          />
        </div>

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
            testimonyStore.create.communityType === 'group' &&
            testimonyStore.create.isPrivateGroup
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
              Choose how your devotion will be visible and accessible to others
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
            v-if="
              testimonyStore.create.communityType === 'group' &&
              testimonyStore.create.isPrivateGroup
            "
            variant="outline"
            @click="testimonyStore.closeCreate"
            :full="false"
          >
            Previous
          </BaseButton>

          <!-- Submit -->
          <BaseButton
            :loading="loading"
            :disabled="loading"
            :full="
              testimonyStore.create.communityType !== 'group' ||
              !testimonyStore.create.isPrivateGroup
            "
          >
            <span class="text-white" v-if="!loading">📖 Submit</span>
            <span class="text-white" v-else>Loading...</span>
          </BaseButton>
        </div>
      </form>
    </template>
  </BaseDialog>
</template>
