<template>
  <button
    :disabled="likeLoading || unlikeLoading"
    @click.stop="handleLikeToggle"
    class="flex items-center justify-center focus:outline-none"
  >
    <div
      v-if="buttonType === 'button'"
      :class="[
        'rounded-full border p-2 transition-all duration-200',
        isLiked
          ? 'bg-red-50 border-red-200'
          : 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      ]"
    >
      <Icon
        :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'"
        :class="[
          'w-5 h-5 transition-transform duration-200',
          isLiked ? 'text-red-600 scale-110' : 'text-gray-600',
        ]"
      />
    </div>

    <Icon
      v-else
      :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'"
      :class="[
        'transition-all duration-200 w-5 h-5',
        isLiked
          ? 'text-red-500 scale-110'
          : 'text-blue-600 hover:text-blue-700',
      ]"
    />
  </button>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import likeCreator from "@/graphql/creators/like_creator.gql";
import unlikeCreator from "@/graphql/creators/unlike_creator.gql";
import { useAuthStore } from "@/stores/auth"; // if you have auth store

const props = defineProps({
  creator: { type: Object, required: true },
  buttonType: { type: String, default: "icon" },
});

const emit = defineEmits(["updated"]);
const router = useRouter();
const auth = useAuthStore();

const isLiked = ref(props.creator?.likes?.length > 0);

// --- GraphQL Mutations ---
const {
  mutate: likeMutate,
  onDone: onLikeDone,
  loading: likeLoading,
} = mutator(likeCreator, { clientId: "auth" });

const {
  mutate: unlikeMutate,
  onDone: onUnlikeDone,
  loading: unlikeLoading,
} = mutator(unlikeCreator, { clientId: "auth" });

// --- Like function ---
const likeCreatorFunction = async () => {
  likeMutate({ creator_id: props.creator.id });

  onLikeDone(({ data }) => {
    if (data?.insert_creator_likes_one) {
      emit("updated");
    } else {
      isLiked.value = false; // revert optimistic UI
    }
  });
};

// --- Unlike function ---
const unlikeCreatorFunction = async () => {
  if (!props.creator.likes?.length) return;

  unlikeMutate({ id: props.creator.likes[0].id });

  onUnlikeDone(({ data }) => {
    if (data?.delete_creator_likes_by_pk) {
      emit("updated");
    } else {
      isLiked.value = true; // revert optimistic UI
    }
  });
};

// --- Handle toggle ---
const handleLikeToggle = async () => {
  if (!auth.isAuthenticated) {
    router.push("/login");
    return;
  }

  if (!isLiked.value) {
    isLiked.value = true;
    await likeCreatorFunction();
  } else {
    isLiked.value = false;
    await unlikeCreatorFunction();
  }
};

// --- Watch for updates ---
watch(
  () => props.creator.likes,
  (newLikes) => {
    isLiked.value = newLikes?.length > 0;
  }
);
</script>
