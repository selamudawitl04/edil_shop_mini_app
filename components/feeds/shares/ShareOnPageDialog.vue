<template>
  <!-- 🚪Share In Page Dialog -->
  <BaseDialog v-model="open" title="Share In Page" :autoClose="false" body-class="max-w-xl">
    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- 👤 Selected Page Card or Placeholder -->
        <div @click="openSelectPageDialog = true" class="cursor-pointer">
          <div v-if="selectedPage"
            class="flex items-start gap-3 p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition">
            <!-- 🖼️ Group Avatar -->
            <BaseAvatar :avatar_image="selectedPage.page.cover_image" :name="selectedPage.page.name"
              :avatar_color="selectedPage.page.avatar_color" class="w-10 h-10 rounded-full" />

            <!-- 📝 Group Info -->
            <div class="flex-1">
              <div class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                {{ selectedPage.page.name }}
              </div>
              <div class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                {{ selectedPage.page.is_private ? "Private" : "Public" }}
              </div>
            </div>
          </div>

          <!-- 🔍 Placeholder if no group selected -->
          <div v-else
            class="p-4 text-sm text-textSecondary-light dark:text-textSecondary-dark rounded-lg border border-dashed border-borderColor-light dark:border-borderColor-dark bg-background-light dark:bg-background-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition">
            Click to select a page to share the {{ props.item?.feed?.type?.replace("_", " ") }}.
          </div>
        </div>

        <!-- ---------------Short message about feed----------------- -->
        <BaseTextInput id="share-message" v-model="message" name="message" label="Short message"
          :placeholder="'Add a short message about the ' + props.item?.feed?.type?.replace('_', ' ')" class="w-full" />

        <!-- 🙏 Submit Button -->
        <div class="pt-2">
          <BaseButton :loading="loading" :disabled="loading || !selectedPage" class="w-full">
            <span class="text-white" v-if="!loading">
              Share {{ props.item?.feed?.type?.replace("_", " ") }}
            </span>
            <span class="text-white" v-else>Sending...</span>
          </BaseButton>
        </div>
      </form>
    </template>
  </BaseDialog>

  <!-- 🔍 Page Selection Dialog -->
  <SelectPageDialog v-if="openSelectPageDialog" v-model="openSelectPageDialog" @selected="selectPage" />
</template>

<script setup>
import { useForm } from "vee-validate";
import shareFeedMutation from "@/graphql/feeds/share_feed.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();

// Setup form and helpers
const { handleSubmit } = useForm();

const emit = defineEmits(["update:modelValue", "feedShared"]);

const props = defineProps({
  modelValue: Boolean,
  item: {
    type: Object,
    required: true,
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

// const refetchGroup = inject("refetchGroup");

// Select group modal
const openSelectPageDialog = ref(false);

const message = ref("");
const selectedPage = ref(null);

// Set selected group
const selectPage = (page) => {
  if (page) {
    selectedPage.value = page;

    const messageInput = document.getElementById("share-message");

    if (messageInput) {
      messageInput.focus();
    }
  }
};

// Submit form
const onSubmit = handleSubmit(() => {

  const { mutate, onDone, loading, onError } = mutator(shareFeedMutation, {
    clientId: "auth",
    role: selectedPage.value?.role,
    showError: false
  })

  mutate({
    input: {
      shared_feed_id: props.item?.feed?.id,
      message: message.value,
      new_feed: {
        data: {
          type: "share",
          page_id: selectedPage.value?.page_id,
          visibility: props.item?.feed?.visibility
        }
      }
    }
  })


  onDone(({ data }) => {
    if (data.insert_feed_shares_one) {
      toast.success(props.item?.feed?.type?.replace("_", " ") + " shared successfully", {
        position: "top-right",
      });
      emit("feedShared");
      props.item.feed.share_count++;
      open.value = false;
    }
  })
  onError((error) => {
    if (error.message.includes("database query error")) {
      toast.error("You have already shared this feed on this page", {
        position: "top-right",
      });
      open.value = false;
    } else {
      toast.error("Failed to share " + props.item?.feed?.type?.replace("_", " "), {
        position: "top-right",
      });
    }
  })

});

</script>
