<script setup>
import htmlTruncate from "html-truncate";
import { useDevotionStore } from "@/stores/devotion";

const user = useCookie("userData")
const devotionStore = useDevotionStore();
const props = defineProps({
  devotion: Object,
  totalReads: Number,
  isBookmarked: Boolean,
  isLiked: Boolean,
  userRead: Boolean,
  showSeries: Boolean,

});



/**-----------------------------------------User Reaction --------------- */
const userReaction = computed(() => {
  return props.devotion?.feed?.feed_reactions?.length > 0 ? props.devotion?.feed?.feed_reactions[0] : null;
});
const onReact = (reaction) => {
  if (userReaction.value) {

    props.devotion.feed.feed_reactions.find(like => like.user_id === user.value.id).reaction_type = reaction.reaction_type;

  } else {
    props.devotion.feed.feed_reactions.push(reaction);
    props.devotion.feed.reaction_count++;
  }




}
const onUnReact = () => {
  if (userReaction.value) {
    props.devotion.feed.feed_reactions = []
    props.devotion.feed.reaction_count--;
  }
}


const avatarImage = computed(() => {
  if (props.devotion?.feed?.group) {
    return props.devotion?.feed?.user?.profile_image || props.devotion?.feed?.group?.profile_image
  } else {
    return props.devotion?.feed?.page?.profile_image
  }
})

const avatarColor = computed(() => {
  if (props.devotion?.feed?.group) {
    return props.devotion?.feed?.user?.avatar_color || props.devotion?.feed?.group?.avatar_color
  } else {
    return props.devotion?.feed?.page?.avatar_color
  }
})

const name = computed(() => {
  if (props.devotion?.feed?.group) {
    return props.devotion?.feed?.user?.full_name || props.devotion?.feed?.group?.name
  } else {
    return props.devotion?.feed?.page?.name
  }
})






const emits = defineEmits(["openDetail"]);
const openCommentDialog = ref(false);
const showFullContent = ref(false);

// ✅ Safely truncate HTML to ~300 characters
const truncatedContent = computed(() => {
  const html = props.devotion.content || "";
  return htmlTruncate(html, 300); // You can adjust the length
});




// Utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}


</script>
<template>
  <div @click="devotionStore.openDevotion(devotion.id, showSeries)"
    :title="`Click to view details of: ${devotion.title}`"
    class="flex flex-col justify-between h-full hover:cursor-pointer min-h-[300px] bg-white dark:bg-slate-800 border border-borderColor-light dark:border-borderColor-dark px-4 py-4 2xl:py-6 2xl:px-6 rounded-lg shadow hover:shadow-lg hover:ring-1 hover:ring-primary-light dark:hover:ring-primary-dark transition-all duration-150">
    <div class="flex justify-between">
      <!-- ✅ Creator Section -->
      <div class="flex items-center gap-3 mb-3">
        <!-- Avatar -->
        <BaseAvatar :avatar_color="avatarColor" :name="name" :avatar_image="avatarImage" />


        <!-- Info -->
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark capitalize">
            <!-- Show creator name -->
            {{ name }}
          </span>
          <!-- Show group name if present -->
          <span v-if="devotion.feed?.group" class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
            Posted in <strong>{{ devotion.feed.group.name }}</strong>
          </span>
          <!-- Read count and created at -->
          <span class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
            📖 {{ devotion.read_count }} people read, {{ formatDate(devotion.created_at) }}
          </span>



        </div>
      </div>

      <DevotionsOptions :devotion="devotion" />
    </div>


    <!-- ----------Show Series Name if present -->
    <div v-if="devotion.series && showSeries" @click.stop="devotionStore.openDevotionSeries(devotion.series.id)"
      class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-3">
      <span class="text-xs">Series: {{ devotion.series.title }}</span>
    </div>

    <!-- ✅ Title -->
    <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
      {{ devotion.title }}
    </h3>

    <!-- ✅ Content Preview with Show More -->
    <div class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-3">
      <div v-html="showFullContent ? devotion.content : truncatedContent"
        class="prose prose-sm dark:prose-invert max-w-none"></div>
      <button v-if="devotion.content.length > 300" @click.stop="showFullContent = !showFullContent"
        class="text-xs text-primary-light dark:text-primary-dark hover:underline mt-1">
        {{ showFullContent ? "Show Less" : "Show More" }}
      </button>
    </div>

    <!-- ✅ Cover Image -->
    <div v-if="devotion.cover_image" class="mb-3">
      <img :src="devotion.cover_image" :alt="devotion.title"
        class="w-full h-32 object-cover rounded-lg border border-borderColor-light dark:border-borderColor-dark" />
    </div>




    <!-- ✅ Footer -->
    <div class="pt-2 border-t border-borderColor-light dark:border-borderColor-dark">
      <div class="flex justify-between items-center text-sm mt-2">
        <!-- Actions -->
        <div class="flex items-center gap-4">

          <DevotionsReactions :devotion="devotion" :useReaction="userReaction"
            :totalReactions="devotion.feed.reaction_count" @react="onReact" @unreact="onUnReact" />

          <button @click.prevent="openCommentDialog = true"
            class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1">
            <div class="flex items-center gap-1">
              <span class="text-base">💬</span>
              <span class="text-xs">({{ devotion.feed.comment_count || 0 }})</span>
            </div>
            <span class="text-xs">Comments</span>
          </button>

          <FeedsShares :item="devotion" />

        </div>


        <!-- Mark as Read -->
        <DevotionsMarkAsRead :devotion="devotion" />


      </div>
    </div>






  </div>
</template>

<style scoped>
.prose {
  @apply text-sm leading-relaxed;
}

.prose p {
  @apply mb-2;
}

.prose h1,
.prose h2,
.prose h3 {
  @apply font-semibold mb-2;
}

.prose ul,
.prose ol {
  @apply mb-2 pl-4;
}

.prose li {
  @apply mb-1;
}

.prose blockquote {
  @apply border-l-4 border-primary-light dark:border-primary-dark pl-4 italic;
}
</style>
