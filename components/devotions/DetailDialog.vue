<script setup>
import { useDevotionStore } from "@/stores/devotion";
import getDevotionItemQuery from "@/graphql/devotions/item.gql";

const devotionStore = useDevotionStore();
const user = useCookie("userData");

// Reactive state
const error = ref(null);
const devotion = ref(null);
const commentsRef = ref(null);

// Fetch devotion data
const { onResult, onError, refetch, loading } = queryItem(getDevotionItemQuery, {
    id: devotionStore.devotionId,
    include_user: true,
    user_id: user.value?.id || null,
    clientId: user.value?.id ? "auth" : "default",
})

onResult(({ data }) => {

    if (data.devotion_devotions_by_pk) {
        devotion.value = data.devotion_devotions_by_pk;
    } else {
        showError(
            createError({
                statusCode: 404,
                statusMessage: "Devotion Not Found",
                message: "The requested devotion does not exist.",
                fatal: true,
            })
        );
    }
})

onError((err) => {
    showError(createError({
        statusCode: 500,
        statusMessage: "Something went wrong",
        message: "An error occurred while fetching the devotion.",
        fatal: true,
    }))

})

// Retry function
const retryFetch = () => {
    loading.value = true;
    error.value = null;
    refetch();
}

provide("refetchDevotion", refetch);

const userReaction = computed(() => {
    return devotion.value?.feed?.feed_reactions?.length > 0 ? devotion.value?.feed?.feed_reactions[0] : null;
});


const onReact = (reaction) => {
    if (userReaction.value) {
        userReaction.value.reaction_type = reaction.reaction_type;
    } else {
        devotion.value.feed.feed_reactions.push(reaction);
        devotion.value.feed.reaction_count++;
    }
}

const onUnReact = () => {
    if (userReaction.value) {
        devotion.value.feed.feed_reactions = []
        devotion.value.feed.reaction_count--;
    }
}



const avatarImage = computed(() => {
    if (devotion.value?.feed?.group) {
        return devotion.value?.feed?.user?.profile_image || devotion.value?.feed?.group?.profile_image
    } else {
        return devotion.value?.feed?.page?.profile_image
    }
})

const avatarColor = computed(() => {
    if (devotion.value?.feed?.group) {
        return devotion.value?.feed?.user?.avatar_color || devotion.value?.feed?.group?.avatar_color
    } else {
        return devotion.value?.feed?.page?.avatar_color
    }
})

const name = computed(() => {
    if (devotion.value?.feed?.group) {
        return devotion.value?.feed?.user?.full_name || devotion.value?.feed?.group?.name
    } else {
        return devotion.value?.feed?.page?.name
    }
})







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

// Watch for devotion ID changes to refetch
watch(() => devotionStore.devotionId, (newId) => {
    if (newId) {
        loading.value = true;
        error.value = null;
        devotion.value = null;
    }
})

const currentUser = computed(() => {
    return user.value
})




// TODO: Implement this
const userRead = computed(() => {
    return false; //props.devotion.feed.feed_prayed.length > 0;
});

</script>


<template>
    <BaseDialog :open="devotionStore.showDevotion" @close="devotionStore.closeDevotion" :auto-close="false"
        :fullHeight="true" :title="devotion?.title || 'Devotion Detail'">
        <template #content>

            <div class="flex flex-col">
                <!-- fixed height for dialog content -->
                <div class="flex-grow overflow-y-auto" :class="{
                    ' pb-[5.5rem]': currentUser,

                }">

                    <div v-if="loading" class="flex flex-col items-center justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p class="mt-2 text-sm text-gray-500">Loading devotion...</p>
                    </div>

                    <div v-else-if="error" class="flex flex-col items-center justify-center py-8">
                        <div class="text-red-500 text-4xl mb-2">⚠️</div>
                        <p class="text-red-600 font-medium">Failed to load devotion</p>
                        <p class="text-sm text-gray-500 mt-1">{{ error.message }}</p>
                        <button @click="retryFetch"
                            class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            Try Again
                        </button>
                    </div>

                    <div v-if="devotion" class="flex flex-col gap-1.5 transition-all duration-300">

                        <!-- Header with Avatar, Name, Group, Timestamp -->
                        <div class="flex justify-between">
                            <div class="flex items-center gap-3 mb-3">
                                <BaseAvatar :avatar_color="avatarColor" :name="name" :avatar_image="avatarImage" />
                                <div class="flex flex-col">
                                    <span
                                        class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark capitalize">
                                        {{ name || "Unknown" }}
                                    </span>
                                    <span v-if="devotion.feed?.group"
                                        class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                        Posted in <strong>{{ devotion.feed.group.name }}</strong>
                                    </span>


                                    <!-- Read count and created at -->
                                    <span class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                        📖 {{ devotion.read_count }} people read, {{ formatDate(devotion.created_at) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <DevotionsOptions :devotion="devotion" />
                        </div>

                        <!-- Title -->
                        <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                            {{ devotion.title }}
                        </h3>

                        <!-- Series -->
                        <div v-if="devotion.series && devotionStore.showSeriesOnDevotionDetail">
                            <span class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                Series: <span class="text-primary-light dark:text-primary-dark"
                                    @click.stop="devotionStore.openDevotionSeries(devotion.series.id)">{{
                                        devotion.series.title }}</span>
                            </span>
                        </div>



                        <!-- Content -->
                        <div class="text-sm text-textSecondary-light dark:text-textSecondary-dark">
                            <div v-html="devotion.content" class="prose prose-sm dark:prose-invert max-w-none"></div>
                        </div>

                        <!-- Cover Image -->
                        <div v-if="devotion.cover_image">
                            <img :src="devotion.cover_image" :alt="devotion.title"
                                class="w-full h-48 object-cover rounded-lg border border-borderColor-light dark:border-borderColor-dark" />
                        </div>

                        <!-- Footer Actions -->
                        <div class="pt-2 border-t border-borderColor-light dark:border-borderColor-dark">
                            <div class="flex justify-between items-center text-sm mt-2">
                                <div class="flex items-center gap-4">
                                    <DevotionsReactions :devotion="devotion" :useReaction="userReaction"
                                        :totalReactions="devotion.feed.reaction_count" @react="onReact"
                                        @unreact="onUnReact" />


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

                                <DevotionsMarkAsRead :devotion="devotion" />
                            </div>
                        </div>


                        <!-- ------------------------------Commment section ------------------------------ -->
                        <Comments ref="commentsRef" :feed="devotion.feed" />

                    </div>

                    <div v-else class="flex flex-col items-center justify-center py-8">
                        <div class="text-gray-400 text-4xl mb-2">📖</div>
                        <p class="text-gray-600 font-medium">No devotion found</p>
                        <p class="text-sm text-gray-500 mt-1">The devotion you're looking for doesn't exist or has been
                            removed.
                        </p>
                    </div>
                </div>





                <!-- Fixed comment input -->
                <div v-if="currentUser" class="sticky bottom-0
           bg-white dark:bg-card-dark flex items-end gap-3 ">
                    <!-- Avatar -->
                    <div class="flex-shrink-0 self-end">
                        <BaseAvatar :avatar_color="currentUser?.avatar_color" :name="currentUser?.full_name"
                            :avatar_image="currentUser?.profile_image" />
                    </div>

                    <!-- Input -->
                    <div class="flex-grow">
                        <CommentsInput :feed="devotion.feed" @submitted="commentsRef.refetch()" />
                    </div>
                </div>


            </div>
        </template>

    </BaseDialog>
</template>
