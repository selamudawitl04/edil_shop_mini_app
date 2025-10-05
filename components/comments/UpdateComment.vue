<template>
  <!-- Edit Comment Dialog -->
  <BaseDialog v-model="open">
    <template #heading>
      <h3 class="flex items-center gap-2">Update Your Comment</h3>
    </template>

    <template #content>
      <form @submit.prevent="submitComment" class="space-y-4">
        <!-- Textarea & Emoji Button -->
        <div class="relative" ref="container">
          <textarea ref="textarea" v-model="comment" rows="3" placeholder="Write your updated comment..."
            class="w-full pr-10 form-textarea resize-none rounded-md bg-transparent text-sm text-textPrimary-light dark:text-textPrimary-dark focus:outline-none"
            @keydown.enter.shift="insertNewline"></textarea>

          <!-- Emoji Toggle Button -->
          <button type="button" @click="toggleEmojiPicker" class="absolute top-2 right-2 text-xl" title="Add emoji">
            😊
          </button>

          <!-- Emoji Picker -->
          <div v-if="showEmojiPicker" class="absolute z-50 top-10 right-0">
            <NuxtEmojiPicker :hide-search="false" :native="true" theme="light" @select="onSelectEmoji" />
          </div>
        </div>

        <!-- Submit Button -->
        <BaseButton :loading="loading" :disabled="!comment.trim() || loading || comment == comment.content
          " type="submit" class="mt-2">
          Save Changes
        </BaseButton>
      </form>
    </template>
  </BaseDialog>
</template>

<script setup>
import editComment from "@/graphql/comments/update.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["submitted", "update:modelValue"]);

const props = defineProps({
  comment: {
    type: Object,
    required: false,
  },

  modelValue: Boolean,
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const comment = ref("");
const showEmojiPicker = ref(false);
const textarea = ref(null);
const container = ref(null);

const refetchComments = inject("refetchComments");

// Toggle Emoji Picker
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

// Insert Emoji at cursor position
const onSelectEmoji = (emoji) => {
  const el = textarea.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;

  comment.value =
    comment.value.slice(0, start) + emoji.i + comment.value.slice(end);

  nextTick(() => {
    el.focus();
    el.selectionStart = el.selectionEnd = start + emoji.i.length;
  });
};

// GraphQL mutation
const { mutate, onDone, loading } = mutator(editComment, { clientId: "auth" });

onDone(({ data }) => {
  if (data.update_comments?.affected_rows) {
    refetchComments();
    open.value = false;
    comment.value = "";
    showEmojiPicker.value = false;
  } else {
    toast.error("Failed to update comment.", { position: "top-right" });
    open.value = false;
  }
});

// Submit handler
const submitComment = () => {
  const trimmed = comment.value.trim();
  if (!trimmed) return;

  mutate({
    input: { content: trimmed },
    filter: { id: { _eq: props.comment.id } },
  });
};

// Handle shift+enter for newline
const insertNewline = (e) => {
  const el = e.target;
  const start = el.selectionStart;
  const end = el.selectionEnd;

  comment.value =
    comment.value.slice(0, start) + "\n" + comment.value.slice(end);

  nextTick(() => {
    el.selectionStart = el.selectionEnd = start + 1;
  });
};

// Close emoji picker when clicking outside
const handleClickOutside = (e) => {
  if (container.value && !container.value.contains(e.target)) {
    showEmojiPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  comment.value = props.comment?.content;
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});





</script>
