<template>


  <div class=" w-full max-w-full ">
    <!-- <div v-if="suggestions?.length > 0" class="flex flex-nowrap gap-2 mb-2 overflow-x-scroll hide-scrollbar ">
      <button @click="addSuggestion(suggestion)" v-for="suggestion in suggestions" :key="suggestion.id"
        class="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
        {{ suggestion.text_en }} 💬
      </button>
    </div> -->

    <!-- <div v-if="suggestions?.length > 0" class="suggestions-strip mb-2 hide-scrollbar pr-4">
      <button v-for="suggestion in suggestions" :key="suggestion.id" @click="addSuggestion(suggestion)"
        class="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
        {{ suggestion.text_en }} 💬
      </button>
    </div> -->


    <!-- -----Selamu Dawit Selemon -->
    <div v-if="suggestions?.length > 0" class="sticky top-0 z-10 bg-white dark:bg-card-dark mb-2 min-w-0">

      <div class="overflow-x-auto hide-scrollbar touch-pan-x">
        <div class="inline-flex gap-2 pr-4">
          <button v-for="suggestion in suggestions" :key="suggestion.id" @click="addSuggestion(suggestion)" class="shrink-0 text-xs px-2 py-1 rounded-full 
                     bg-slate-100 dark:bg-slate-700 
                     text-slate-600 dark:text-slate-300 
                     font-medium whitespace-nowrap">
            {{ suggestion.text_en }} 💬
          </button>
        </div>
      </div>

    </div>



    <div
      class="relative mt-3 border border-borderColor-light dark:border-borderColor-dark rounded-md px-2 pt-2 pb-1 bg-background-light dark:bg-background-dark w-full"
      ref="container">
      <div class="relative">

        <textarea ref="textarea" v-model="comment" rows="1" placeholder="Add a comment..."
          class="w-full pr-12 pb-10 form-textarea resize-none rounded-md bg-transparent text-sm text-textPrimary-light dark:text-textPrimary-dark focus:outline-none"
          :style="{ maxHeight: maxHeight + 'px' }" @input="autoResize" @keydown.enter.prevent="onEnter"
          @keydown.enter.shift="insertNewline" :id="id"></textarea>

        <!-- Emoji Toggle Button (top-right) -->
        <button type="button" @click="toggleEmojiPicker" class="absolute top-2 right-2 text-xl"
          aria-label="Toggle emoji picker">
          😊
        </button>


        <!-- ------------Shoe loading state ------------ -->
        <div v-if="loading"
          class="absolute bottom-4 right-2 text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary-light disabled:opacity-50 disabled:cursor-not-allowed">


          <Icon name="eos-icons:bubble-loading" class="text-2xl  " />

        </div>

        <!-- Send Button (Telegram icon, bottom-right) -->
        <button v-else type="button" @click="submitComment" :disabled="!comment.trim()"
          class="absolute bottom-4 right-2 text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send comment">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 rotate-45" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l19.5-7.5-7.5 19.5-3-8-8-3z" />
          </svg>
        </button>

        <!-- Emoji Picker -->
        <div v-if="showEmojiPicker" class="absolute z-50 top-10 right-0">
          <NuxtEmojiPicker :hide-search="false" :native="true" theme="light" @select="onSelectEmoji" />
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import addComment from "@/graphql/comments/add_comment.gql";
import { useBackStore } from "~/stores/back-route";

const backStore = useBackStore();
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["submitted"]);
const props = defineProps({
  parentComment: { //  Parent comment
    type: Object,
    required: false,
  },

  feed: { // prayer_request, devotion, etc.
    type: Object,
    required: true,
  },


  previousComments: {
    type: Array,
    required: false,
  },

});


const id = computed(
  () => `${props.parent?.id}-input`
);


const suggestions = computed(() => {
  if (props.parent?.category?.prayer_category_comments?.length) {
    return props.parent.category.prayer_category_comments;
  }
  return [];
});

const addSuggestion = (suggestion) => {
  comment.value = suggestion.text_en;
  submitComment();
};


const user = useCookie("userData");
const comment = ref("");

const showEmojiPicker = ref(false);
const textarea = ref(null);
const container = ref(null);

// Calculate max height as 70% of viewport height
const maxHeight = ref(window.innerHeight * 0.7);

// Update max height on window resize
const updateMaxHeight = () => {
  maxHeight.value = window.innerHeight * 0.7;
  autoResize(); // Recalculate textarea height after resize
};

// Toggle emoji picker
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

// Insert emoji into comment
const onSelectEmoji = (emoji) => {
  const el = textarea.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  comment.value =
    comment.value.slice(0, start) + emoji.i + comment.value.slice(end);

  nextTick(() => {
    el.focus();
    el.selectionStart = el.selectionEnd = start + emoji.i.length;
    autoResize();
  });
};

// Facebook-style auto-resize function
const autoResize = () => {
  const el = textarea.value;
  if (!el) return;

  // Reset height to auto to get the natural scroll height
  el.style.height = "auto";

  // Get the natural height needed for the content
  const scrollHeight = el.scrollHeight;

  // Calculate the new height (minimum 1 row, maximum 70% of viewport)
  let newHeight = Math.max(scrollHeight, 40); // Minimum height for 1 row

  if (newHeight > maxHeight.value) {
    // If content exceeds max height, set to max height and enable scrolling
    newHeight = maxHeight.value;
    el.style.overflowY = "auto";
  } else {
    // If content fits within max height, hide scrollbar
    el.style.overflowY = "hidden";
  }

  // Apply the calculated height
  el.style.height = newHeight + "px";
};

// Submit comment
const { mutate, onDone, loading } = mutator(addComment, { clientId: "auth" });
onDone(({ data }) => {
  if (data.insert_comments_one) {

    if (props.previousComments) {
      props.previousComments.unshift({
        ...data.insert_comments_one,
        replies: [],
        comment_likes: [],
        like_count: 0,
      });
    }

    props.feed.comment_count++;
    emit("submitted");
  }
});

const submitComment = () => {



  const trimmed = comment.value.trim();
  if (!trimmed) return;

  if (!user.value) {
    // backStore.setRoute(`/prayer-requests/${props.prayerRequestId}`, {
    //   comment_id: props.prayerComment?.id,
    //   content: trimmed,
    //   type: "comment",
    // });
    router.push("/auth/login");
    return;
  }

  const input = {
    content: trimmed,
    feed_id: props.feed?.id,
    parent_comment_id: props.parentComment?.id || null,
  };

  mutate({ input });
  comment.value = "";
  nextTick(() => {
    autoResize(); // reset height after clearing
  });
  showEmojiPicker.value = false;
};

// Allow Shift+Enter for newline + auto resize after
const insertNewline = (e) => {
  const el = e.target;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  comment.value =
    comment.value.substring(0, start) + "\n" + comment.value.substring(end);
  nextTick(() => {
    el.selectionStart = el.selectionEnd = start + 1;
    autoResize();
  });
};

// On Enter key press (without Shift) submit comment
const onEnter = () => {
  submitComment();
};

// Close emoji picker when clicking outside
const handleClickOutside = (e) => {
  if (container.value && !container.value.contains(e.target)) {
    showEmojiPicker.value = false;
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", updateMaxHeight);

  nextTick(() => autoResize());

  const commentId = route.query.comment_id;
  const commentContent = route.query.content;
  const type = route.query.type;

  if (
    (commentId == props.prayerComment?.id ||
      commentId == props.prayerRequestId) &&
    commentContent &&
    type == "comment"
  ) {
    comment.value = commentContent;
    await nextTick();
    const el = document.getElementById(`${commentId}-input`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    autoResize();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", updateMaxHeight);
});
</script>
