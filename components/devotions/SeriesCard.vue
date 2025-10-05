<template>
    <div @click="devotionStore.openDevotionSeries(series.id)" :title="`Click to view details of: ${series.title}`"
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
                        {{ name || "Unknown" }}
                    </span>
                    <!-- Show group name if present -->
                    <span v-if="series.feed?.group"
                        class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                        Series in <strong>{{ series.feed?.group.name }}</strong>
                    </span>


                </div>
            </div>

            <DevotionsSeriesOptions :series="series" :role="role" />
        </div>

        <!-- ✅ Title -->
        <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
            {{ series.title }}
        </h3>

        <!-- ✅ Description Preview -->
        <div class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-3">
            <div v-html="showFullDescription ? series.description : truncatedDescription"
                class="prose prose-sm dark:prose-invert max-w-none"></div>
            <button v-if="series.description && series.description.length > 200"
                @click.stop="showFullDescription = !showFullDescription"
                class="text-xs text-primary-light dark:text-primary-dark hover:underline mt-1">
                {{ showFullDescription ? "Show Less" : "Show More" }}
            </button>
        </div>

        <!-- ✅ Cover Image -->
        <div v-if="series.cover_image" class="mb-3">
            <img :src="series.cover_image" :alt="series.title"
                class="w-full h-32 object-cover rounded-lg border border-borderColor-light dark:border-borderColor-dark" />
        </div>

        <!-- ✅ Footer -->
        <div class="pt-2 border-t border-borderColor-light dark:border-borderColor-dark">
            <div class="flex justify-between items-center text-sm mt-2">
                <!-- Actions -->
                <!-- Remove actions and put devotions count here -->
                <div class="flex items-center gap-4">
                    <span class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                        📚 {{ series.devotions_aggregate?.aggregate?.count || 0 }} devotions
                    </span>

                </div>
                <!-- Visibility Badge -->
                <div>
                    <span class="text-xs px-2 py-1 rounded-full" :class="series?.feed?.visibility === 'public'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'">
                        {{ series?.feed?.visibility === 'public' ? 'Public' : 'Private' }}
                    </span>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>


import { useDevotionStore } from "@/stores/devotion"
const devotionStore = useDevotionStore()
import htmlTruncate from "html-truncate";

const user = useCookie("userData")

const props = defineProps({
    series: Object,
    isBookmarked: Boolean,
    isLiked: Boolean,
});



const avatarImage = computed(() => {
    if (props.series?.feed?.group) {
        return props.series?.feed?.user?.profile_image || props.series?.feed?.group?.profile_image
    } else {
        return props.series?.feed?.page?.profile_image
    }
})

const avatarColor = computed(() => {
    if (props.series?.feed?.group) {
        return props.series?.feed?.user?.avatar_color || props.series?.feed?.group?.avatar_color
    } else {
        return props.series?.feed?.page?.avatar_color
    }
})

const name = computed(() => {
    if (props.series?.feed?.group) {
        return props.series?.feed?.user?.full_name || props.series?.feed?.group?.name
    } else {
        return props.series?.feed?.page?.name
    }
})

const emits = defineEmits(["openDetail", "series-selected"]);
const showFullDescription = ref(false);

// ✅ Safely truncate HTML to ~200 characters
const truncatedDescription = computed(() => {
    const html = props.series.description || "";
    return htmlTruncate(html, 200); // You can adjust the length
});

// Sample methods
const onLike = () => { };
const onShare = () => { };
</script>

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