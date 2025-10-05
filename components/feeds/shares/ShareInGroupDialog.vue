<template>
  <!-- 🚪Share In Group Dialog -->
  <BaseDialog v-model="open" title="Share In Group" :autoClose="false" body-class="max-w-xl">
    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- 👤 Selected Group Card or Placeholder -->
        <div @click="openSelectGroupDialog = true" class="cursor-pointer">
          <div v-if="selectedGroup"
            class="flex items-start gap-3 p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition">
            <!-- 🖼️ Group Avatar -->
            <BaseAvatar :avatar_image="selectedGroup.group.cover_image" :name="selectedGroup.group.name"
              :avatar_color="selectedGroup.group.avatar_color" class="w-10 h-10 rounded-full" />

            <!-- 📝 Group Info -->
            <div class="flex-1">
              <div class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                {{ selectedGroup.group.name }}
              </div>
              <div class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                {{ selectedGroup.group.is_private ? "Private" : "Public" }}
              </div>
            </div>
          </div>

          <!-- 🔍 Placeholder if no group selected -->
          <div v-else
            class="p-4 text-sm text-textSecondary-light dark:text-textSecondary-dark rounded-lg border border-dashed border-borderColor-light dark:border-borderColor-dark bg-background-light dark:bg-background-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition">
            Click to select a group to share the {{ props.item?.feed?.type?.replace("_", " ") }}.
          </div>
        </div>

        <!-- ---------------Short message about feed----------------- -->
        <BaseTextInput id="share-message" v-model="message" name="message" label="Short message"
          :placeholder="'Add a short message about the ' + props.item?.feed?.type?.replace('_', ' ')" class="w-full" />

        <!-- 🙏 Submit Button -->
        <div class="pt-2">
          <BaseButton :loading="loading" :disabled="loading || !selectedGroup" class="w-full">
            <span class="text-white" v-if="!loading">
              Share {{ props.item?.feed?.type?.replace("_", " ") }}
            </span>
            <span class="text-white" v-else>Sending...</span>
          </BaseButton>
        </div>
      </form>
    </template>
  </BaseDialog>

  <!-- 🔍 Group Selection Dialog -->
  <SelectGroupDialog v-if="openSelectGroupDialog" v-model="openSelectGroupDialog" @selected="selectGroup" />
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
const openSelectGroupDialog = ref(false);

const message = ref("");
const selectedGroup = ref(null);

// Set selected group
const selectGroup = (group) => {
  if (group) {
    selectedGroup.value = group;

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
    role: selectedGroup.value?.role,
    showError: false
  })

  mutate({
    input: {
      shared_feed_id: props.item?.feed?.id,
      message: message.value,
      new_feed: {
        data: {
          type: "share",
          group_id: selectedGroup.value?.group_id,
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
      toast.error("You have already shared this feed in this group", {
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
