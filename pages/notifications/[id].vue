<template>
    <NuxtLayout>
        <section class="bg-card-light dark:bg-card-dark pb-16 pt-32 px-4 sm:px-8 md:px-16 lg:px-32">
            <div class="max-w-4xl mx-auto">
                <!-- Back Button -->
                <div class="mb-6">
                    <button @click="$router.back()"
                        class="flex items-center gap-2 text-textSecondary-light dark:text-textSecondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                        <Icon name="ph:arrow-left" class="w-5 h-5" />
                        Back to Testimonies
                    </button>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center py-12">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark">
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-12">
                    <Icon name="ph:warning" class="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                        Testimony Not Found
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        The testimony you're looking for doesn't exist or has been removed.
                    </p>
                    <NuxtLink to="/testmonies"
                        class="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-primary-light/90 dark:hover:bg-primary-dark/90 transition-colors">
                        Browse All Testimonies
                    </NuxtLink>
                </div>

                <!-- Testimony Content -->
                <div v-else-if="testimony" class="space-y-8">
                    <!-- Header -->
                    <div class="text-center">
                        <h1
                            class="text-3xl md:text-4xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-4">
                            {{ testimony.title }}
                        </h1>

                        <div
                            class="flex items-center justify-center gap-4 text-textSecondary-light dark:text-textSecondary-dark">
                            <div class="flex items-center gap-2">
                                <BaseAvatar :avatar_color="avatarColor" :name="name" :avatar_image="avatarImage" />
                                <span class="font-medium">{{ name }}</span>
                            </div>

                            <span class="text-sm">•</span>

                            <span class="text-sm">{{ testimonyCreatedAt }}</span>
                        </div>
                    </div>

                    <!-- Cover Image -->
                    <div v-if="testimony.cover_image" class="w-full">
                        <img :src="testimony.cover_image" :alt="testimony.title"
                            class="w-full max-h-96 object-cover rounded-lg shadow-lg" />
                    </div>

                    <!-- Content -->
                    <div class="prose prose-lg max-w-none dark:prose-invert">
                        <div
                            class="whitespace-pre-wrap text-textSecondary-light dark:text-textSecondary-dark leading-relaxed text-lg">
                            {{ testimony.content }}
                        </div>
                    </div>

                    <!-- Actions -->
                    <div
                        class="flex items-center justify-between pt-6 border-t border-borderColor-light dark:border-borderColor-dark">
                        <div class="flex items-center gap-4">
                            <TestimonyReactions :testimony="testimony"
                                :user-reaction="testimony.feed?.feed_reactions?.[0]" />

                            <div class="flex items-center gap-1 text-textSecondary-light dark:text-textSecondary-dark">
                                <Icon name="ph:chat-circle" class="w-5 h-5" />
                                <span class="text-sm">{{ testimony.feed?.comment_count || 0 }} comments</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <TestimonyOptions :testimony="testimony" />

                            <button @click="shareTestimony"
                                class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <Icon name="ph:share" class="w-4 h-4" />
                                Share
                            </button>
                        </div>
                    </div>

                    <!-- Comments Section (placeholder for future implementation) -->
                    <div class="pt-8 border-t border-borderColor-light dark:border-borderColor-dark">
                        <h3 class="text-xl font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-6">
                            Comments
                        </h3>
                        <div class="text-center py-12 text-textSecondary-light dark:text-textSecondary-dark">
                            <Icon name="ph:chat-circle" class="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p class="text-lg">Comments feature coming soon!</p>
                            <p class="text-sm mt-2">Share your thoughts and encouragement with the community.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import { formatDistanceToNow } from "date-fns";

const route = useRoute();
const user = useCookie("userData");

// GraphQL query
const { $query } = useNuxtApp();
const { data: testimony, loading, error } = $query(
    "getTestimonyItem",
    () => ({
        id: route.params.id,
        include_user: !!user.value,
        user_id: user.value?.id || "",
    }),
    {
        enabled: computed(() => !!route.params.id),
    }
);

// Computed properties
const testimonyCreatedAt = computed(() => {
    if (!testimony.value?.created_at) return "Unknown";
    const _createdAt = new Date(testimony.value.created_at);
    return formatDistanceToNow(_createdAt);
});

const avatarImage = computed(() => {
    if (testimony.value?.feed?.group) {
        return testimony.value.feed.group.profile_image;
    } else if (testimony.value?.feed?.page) {
        return testimony.value.feed.page.profile_image;
    } else if (testimony.value?.feed?.user) {
        return testimony.value.feed.user.profile_image;
    } else {
        return null;
    }
});

const avatarColor = computed(() => {
    if (testimony.value?.feed?.group) {
        return testimony.value.feed.group.avatar_color;
    } else if (testimony.value?.feed?.page) {
        return testimony.value.feed.page.avatar_color;
    } else if (testimony.value?.feed?.user) {
        return testimony.value.feed.user.avatar_color;
    } else {
        return null;
    }
});

const name = computed(() => {
    if (testimony.value?.feed?.group) {
        return testimony.value.feed.group.name;
    } else if (testimony.value?.feed?.page) {
        return testimony.value.feed.page.name;
    } else if (testimony.value?.feed?.user) {
        return testimony.value.feed.user.full_name;
    } else {
        return "Anonymous";
    }
});

// Methods
const shareTestimony = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: testimony.value.title,
                text: testimony.value.content.substring(0, 100) + "...",
                url: window.location.href,
            });
        } catch (error) {
            console.log("Error sharing:", error);
        }
    } else {
        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(window.location.href);
            // You could add a toast notification here
        } catch (error) {
            console.log("Error copying to clipboard:", error);
        }
    }
};

// SEO
useHead({
    title: computed(() => testimony.value?.title || "Testimony"),
    meta: [
        {
            name: "description",
            content: computed(() =>
                testimony.value?.content?.substring(0, 160) + "..." ||
                "Read this inspiring testimony of God's faithfulness."
            ),
        },
    ],
});
</script>