<template>
  <button
    :disabled="likeLoading || unlikeLoading"
    @click.stop="handleLikeToggle"
    class="flex items-center justify-center focus:outline-none"
  >
    <Icon
      :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'"
      :class="[
        'transition-all duration-200 w-6 h-6',
        isLiked
          ? 'text-red-500 scale-110'
          : 'text-blue-600 hover:text-blue-700',
      ]"
    />
  </button>
</template>

<script setup>
import { ref, watch } from "vue";

import likeLottery from "@/graphql/lottery/like.gql";
import unlikeLottery from "@/graphql/lottery/unlike.gql";

const props = defineProps({
  lottery: { type: Object, required: true },
});

const emit = defineEmits(["updated"]);

const isLiked = ref(props.lottery?.likes?.length > 0);

// --- LIKE Mutation
const {
  mutate: likeMutate,
  onDone: onLikeDone,
  loading: likeLoading,
} = mutator(likeLottery, {
  clientId: "auth",
});

// --- UNLIKE Mutation
const {
  mutate: unlikeMutate,
  onDone: onUnlikeDone,
  loading: unlikeLoading,
} = mutator(unlikeLottery, {
  clientId: "auth",
});

// --- Like action
const likeLotteryFunction = async () => {
  likeMutate({ lottery_id: props.lottery.id });

  onLikeDone(({ data }) => {
    if (data?.insert_lottery_likes_one) {
      emit("updated");
    } else {
      isLiked.value = false; // revert optimistic UI
    }
  });
};

// --- Unlike action
const unlikeLotteryFunction = async () => {
  if (!props.lottery.likes?.length) {
    return;
  }

  unlikeMutate({ id: props.lottery.likes[0].id });

  onUnlikeDone(({ data }) => {
    if (data?.delete_lottery_likes_by_pk) {
      emit("updated");
    } else {
      isLiked.value = true; // revert optimistic UI
    }
  });
};

// --- Handle click
const handleLikeToggle = async () => {
  if (!isLiked.value) {
    isLiked.value = true;
    await likeLotteryFunction();
  } else {
    isLiked.value = false;
    await unlikeLotteryFunction();
  }
};

watch(
  () => props.lottery.likes,
  (newLikes) => {
    isLiked.value = newLikes?.length > 0;
  }
);
</script>
