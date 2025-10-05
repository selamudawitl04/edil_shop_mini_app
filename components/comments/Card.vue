<template>
  <CommentsReportComment v-if="openReportCommentDialog" v-model="openReportCommentDialog" :comment="comment" />
  <CommentsUpdateComment v-if="openUpdateCommentDialog" v-model="openUpdateCommentDialog" :comment="comment" />

  <CommentsDeleteComment v-if="openDeleteCommentDialog" v-model="openDeleteCommentDialog" :comment="comment"
    :user-role="userRole" />

  <div class="flex gap-3 py-1.5" :class="isReply
    ? 'pl-8 border-l border-borderColor-light dark:border-borderColor-dark'
    : ''
    ">
    <!-- Avatar -->
    <div>
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center bg-primary-light text-white font-semibold text-sm"
        v-if="!comment.user?.profile_image">
        {{ userInitials }}
      </div>
      <img v-else :src="comment.user.profile_image" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
    </div>

    <!-- Comment content -->
    <div class="flex-1">
      <div class="flex justify-between gap-4 items-start">
        <!-- Author Name -->
        <div class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark">
          {{ comment.user.full_name }}
        </div>

        <!-- ---------Comment actions -->

        <HeadlessPopover class="relative inline-block text-left">
          <HeadlessPopoverButton
            class="rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition h-6 w-6 flex items-center justify-center">
            <Icon name="mi:options-vertical" size="22" class="text-textPrimary-light dark:text-textPrimary-dark" />
          </HeadlessPopoverButton>
          <HeadlessPopoverPanel
            class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50">
            <div class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark">
              <!-- Update Request -->
              <button v-if="canUpdate" @click="openUpdateCommentDialog = true"
                class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md">
                <Icon name="lucide:edit-3" class="w-4 h-4" />
                Update Comment
              </button>

              <!-- Report Comment -->
              <button @click="openReportCommentDialog = true"
                class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md">
                <Icon name="lucide:flag" class="w-4 h-4" />
                Report Comment
              </button>

              <!-- Delete Request -->
              <button v-if="canDelete" @click="openDeleteCommentDialog = true"
                class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
                Delete Comment
              </button>
            </div>
          </HeadlessPopoverPanel>
        </HeadlessPopover>
      </div>

      <!-- Comment Text -->
      <div class="text-sm text-textSecondary-light dark:text-textSecondary-dark">
        {{ comment.content }}
      </div>

      <!-- Metadata -->
      <div class="flex flex-wrap items-center gap-4 mt-2 text-xs text-textSecondary-light dark:text-textSecondary-dark">
        <span>{{ timeAgo(comment.created_at) }}</span>

        <button class="hover:underline" @click="showReplyInput = !showReplyInput">Reply</button>

        <!-- Like Icon and Count -->
        <button class="flex items-center gap-1 text-sm hover:opacity-80 transition" @click="handleLikeUnLike">
          <Icon :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'" class="text-red-500 w-4 h-4" />
          <span :id="comment.id + '-like'">{{ comment.like_count || 0 }}</span>
        </button>
      </div>

      <!-- Replies (conditionally shown) -->
      <div v-show="showReplies && comment.replies?.length" class="mt-1">
        <CommentsCard v-for="reply in comment.replies" :key="reply.id" :comment="reply" :is-reply="true" :feed="feed"
          :level="level + 1" @open-comment-dialog="openReply" />
      </div>

      <!-- View replies toggle -->
      <div v-if="comment.replies?.length" class="mt-2 text-xs">
        <button class="hover:underline text-textSecondary-light dark:text-textSecondary-dark" @click="toggleReplies">
          {{
            showReplies
              ? "Hide"
              : `View ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"
              }`
          }}
        </button>
      </div>

      <!-- Reply Input -->
      <div v-if="showReplyInput" class="mt-3">
        <CommentsInput :feed="feed" :parentComment="comment" @submitted="onReplySubmitted"
          :previousComments="comment.replies" />
      </div>
    </div>
  </div>
</template>

<script setup>
import likeQuery from "@/graphql/comments/like.gql";
import unLikeQuery from "@/graphql/comments/un_like.gql";
import { useBackStore } from "~/stores/back-route";

const backStore = useBackStore();
const emit = defineEmits(["openCommentDialog"]);

const router = useRouter();

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  feed: {
    type: Object,

    required: true,
  },

  isReply: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    default: 0,
  },
});

const user = useCookie("userData");


const comments = inject("comments");
function getCurrentComment() {
  const targetId = props.comment.id;

  // Recursive search function
  function findComment(commentsList) {
    for (const comment of commentsList) {
      if (comment.id === targetId) {
        return comment;
      }
      if (comment.replies?.length) {
        const found = findComment(comment.replies);
        if (found) return found;
      }
    }
    return null;
  }

  return findComment(comments.value);
}

const isLiked = computed(() => {
  if (!user.value) return false;
  return props.comment?.comment_likes?.length > 0;
});

const showReplyInput = ref(false);
const showReplies = ref(false);


// // Open reply input field
// function openReply() {
//   if (
//     route.query?.comment_id == props.comment?.id &&
//     route.query.type == "comment"
//   ) {
//     showReplyInput.value = true;
//   }
//   showReplies.value = true; // Show replies when replying
//   emit("openCommentDialog");
// }

// //Handle route
// const route = useRoute();
// if (route.query?.comment_id == props.comment?.id) {
//   openReply();
// }

// Toggle reply list visibility
function toggleReplies() {
  showReplies.value = !showReplies.value;
}

// Optional handler when reply is submitted
function onReplySubmitted() {
  showReplyInput.value = false;
  showReplies.value = true;
}

// Get initials from name
const userInitials = computed(() => {
  const name = props.comment.user?.full_name || "";
  const [first = "", last = ""] = name.trim().split(" ");
  return (first[0] || "") + (last[0] || "");
});

// Format time as "x ago"
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

// Like
const { mutate: likeMutate, onDone: likeDone } = mutator(likeQuery, {
  clientId: "auth",
});

likeDone(({ data }) => {
  if (data.insert_comment_likes_one?.id) {
    const currentComment = getCurrentComment();
    if (currentComment) {
      currentComment.like_count += 1;
      currentComment.comment_likes.push(data.insert_comment_likes_one);
    }
  }
});

// UnLike
const { mutate: unLikeMutate, onDone: unLikeDone } = useMutation(unLikeQuery, {
  clientId: "auth",
});

unLikeDone(({ data }) => {
  if (data.delete_comment_likes_by_pk?.id) {
    const currentComment = getCurrentComment();
    if (currentComment) {
      currentComment.like_count -= 1;
      currentComment.comment_likes = []
    }
  }
});

function handleLikeUnLike() {
  // Check user data
  if (!user.value) {
    // backStore.setRoute(`/${props.parentType}/${props.parent?.id}`, {
    //   comment_id: props.comment.id,
    //   type: "like",
    // });
    router.push("/auth/login");
    return;
  }

  if (isLiked.value) {
    const likeId = props.comment?.comment_likes[0]?.id;
    unLikeMutate({
      id: likeId,
    });
  } else {
    const input = {
      comment_id: props.comment.id,
    };

    likeMutate({ input });
  }
}







/**---------------------------Update Comment ------- */
const openUpdateCommentDialog = ref(false);
const canUpdate = computed(() => props.comment?.user?.id == user.value?.id);

/**---------------------------Report Comment -------- */
const openReportCommentDialog = ref(false);

/**---------------------------Delete Comment--------- */

const openDeleteCommentDialog = ref(false);
const canDelete = computed(() => {

  const myComment = props.comment?.user?.id == user.value?.id;
  const isPageAdmin = props.feed?.page?.page_admins?.some(pa => pa.user_id == user.value?.id);
  const isGroupAdmin = props.feed?.group?.group_members?.some(ga => ga.user_id == user.value?.id && ga.role !== "group:member" && ga.status == "approved");


  return myComment || isPageAdmin || isGroupAdmin;
});

const userRole = computed(() => {

  const myComment = props.comment?.user?.id == user.value?.id;
  const isPageAdmin = props.feed?.page?.page_admins?.some(pa => pa.user_id == user.value?.id);
  const isGroupAdmin = props.feed?.group?.group_members?.some(ga => ga.user_id == user.value?.id && ga.role !== "group:member" && ga.status == "approved");

  if (myComment) {
    return "user";
  }
  if (isPageAdmin) {
    return "page:admin";
  }
  if (isGroupAdmin) {
    return "group:admin";
  }

  return null;
});



// onMounted(async () => {
//   const commentId = route.query.comment_id;
//   const type = route.query.type;
//   if (commentId == props.comment?.id && type == "like") {
//     await nextTick(); // ensure DOM is rendered
//     const el = document.getElementById(`${commentId}-like`);
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "center" });
//     }
//   }
// });
</script>
