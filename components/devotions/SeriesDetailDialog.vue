<template>


    <!-- ✨ Devotion Series Detail Dialog -->
    <BaseDialog :open="devotionStore.showDevotionSeries" :title="series?.title || 'Series Details'" :auto-close="false"
        body-class="max-w-3xl" @close="devotionStore.closeDevotionSeries">
        <template #content>
            <div v-if="series" class="space-y-6">
                <!-- Creator Section -->
                <div class="flex justify-between">
                    <div class="flex items-center gap-3 mb-3">
                        <!-- Avatar -->
                        <BaseAvatar :avatar_color="avatarColor" :name="name" :avatar_image="avatarImage" />

                        <!-- Info -->
                        <div class="flex flex-col">
                            <span
                                class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark capitalize">
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

                    <!-- Actions -->
                    <DevotionsSeriesOptions :series="series" :role="userRole" />
                </div>




                <!-- Title -->
                <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                    {{ series.title }}
                </h3>

                <!-- Description -->
                <div v-if="series.description"
                    class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-3">
                    <div v-html="series.description" class="prose prose-sm dark:prose-invert max-w-none"></div>
                </div>

                <!-- Cover Image -->
                <div v-if="series.cover_image" class="mb-3">
                    <img :src="series.cover_image" :alt="series.title"
                        class="w-full h-64 object-cover rounded-lg border border-borderColor-light dark:border-borderColor-dark" />
                </div>

                <!-- Footer -->
                <div class="pt-2 border-t border-borderColor-light dark:border-borderColor-dark">
                    <div class="flex justify-between items-center text-sm mt-2">
                        <!-- Devotion count -->
                        <span class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                            📚 {{ series.devotions_aggregate?.aggregate?.count || 0 }} devotions
                        </span>

                        <!-- Visibility Badge -->
                        <div>
                            <span class="text-xs px-2 py-1 rounded-full" :class="series.visibility === 'public'
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'">
                                {{ series.visibility === 'public' ? 'Public' : 'Private' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Devotions List -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                            Devotions in this Series
                        </h3>
                        <button v-if="canCreateDevotion" @click="openCreateDevotionDialog = true"
                            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition">
                            <Icon name="mdi:plus" size="16" class="mr-1" />
                            Add Devotion
                        </button>
                    </div>
                    <!-- Devotions -->
                    <div v-if="seriesDevotions.length" class="grid gap-6 md:grid-cols-1">
                        <DevotionsCard v-for="devotion in seriesDevotions" :key="devotion.id" :devotion="devotion"
                            :role="userRole" />
                    </div>

                    <!-- No Devotions -->
                    <div v-else class="text-center py-8 text-textSecondary-light dark:text-textSecondary-dark">
                        <Icon name="mdi:book-open-variant" size="48" class="mx-auto mb-2 opacity-50" />
                        <p class="text-sm">No devotions in this series yet</p>
                        <button v-if="canCreateDevotion" @click="openCreateDevotionDialog = true"
                            class="mt-2 text-primary-light dark:text-primary-dark hover:underline text-sm">
                            Add the first devotion
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div v-else-if="loading" class="text-center py-8">
                <div class="loader mx-auto"></div>
                <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark mt-2">
                    Loading series details...
                </p>
            </div>

            <!-- Error -->
            <div v-else class="text-center py-8 text-textSecondary-light dark:text-textSecondary-dark">
                <Icon name="mdi:alert-circle" size="48" class="mx-auto mb-2 opacity-50" />
                <p class="text-sm">Failed to load series details</p>
            </div>

            <!-- Create Devotion Dialog -->
            <DevotionsCreate v-if="openCreateDevotionDialog" v-model="openCreateDevotionDialog"
                :community-id="series?.feed?.group_id || series?.feed?.page_id" :allow-series-select="false"
                :allow-type-select="false" :community-type="series?.feed?.group_id ? 'group' : 'page'" :role="userRole"
                :preselected-series="series" />


        </template>
    </BaseDialog>


</template>


<script setup>



import htmlTruncate from "html-truncate";
import getSeriesDevotionsQuery from "@/graphql/devotions/list.gql";
import { useDevotionStore } from "@/stores/devotion";
import getSeriesItemQuery from "@/graphql/devotions/series_item.gql";

const devotionStore = useDevotionStore();
const user = useCookie("userData");


// ----------------------Fetch Series ----------------------

const series = ref(null);
const { onResult: seriesResult, loading: seriesLoading, onError: seriesError, refetch: refetchSeries } = queryItem(getSeriesItemQuery, {
    id: devotionStore?.devotionSeriesId || null,
    include_user: true,
    clientId: user.value?.id ? "auth" : "default",
});


seriesResult(({ data }) => {
    if (data.devotion_series_by_pk) {
        series.value = data.devotion_series_by_pk;
    } else {
        showError(
            createError({
                statusCode: 404,
                statusMessage: "Series Not Found",
                message: "The requested series does not exist.",
                fatal: true,
            })
        );
    }
});


seriesError((err) => {
    showError(createError({
        statusCode: 500,
        statusMessage: "Something went wrong",
        message: "An error occurred while fetching the series.",
        fatal: true,
    }))
})

provide("refetchSeries", refetchSeries);




const avatarImage = computed(() => {
    if (series.value?.feed?.group) {
        return series.value?.feed?.user?.profile_image || series.value?.feed?.group?.profile_image
    } else {
        return series.value?.feed?.page?.profile_image
    }
})

const avatarColor = computed(() => {
    if (series.value?.feed?.group) {
        return series.value?.feed?.user?.avatar_color || series.value?.feed?.group?.avatar_color
    } else {
        return series.value?.feed?.page?.avatar_color
    }
})

const name = computed(() => {
    if (series.value?.feed?.group) {
        return series.value?.feed?.user?.full_name || series.value?.feed?.group?.name
    } else {
        return series.value?.feed?.page?.name
    }
})


// ----------------------Fetch Series Devotions ------------
const devotionsFilter = computed(() => ({
    series_id: {
        _eq: devotionStore.devotionSeriesId,
    },
    deleted_at: {
        _is_null: true,
    },
}))
const { onResult, loading, onError, refetch } = queryList(getSeriesDevotionsQuery, {
    clientId: user.value?.id ? "auth" : "default",
    filter: devotionsFilter,
    include_user: true,
});

const seriesDevotions = ref([]);
onResult(({ data }) => {
    if (data.devotion_devotions) {
        seriesDevotions.value = data.devotion_devotions;
    }
});
provide("refetchDevotions", refetch);




const userRole = computed(() => {
    if (series.value?.feed?.group) {

        if (series.value?.feed?.group?.group_members?.length && series.value?.feed?.group?.group_members[0].status === "approved") {
            return series.value?.feed?.group?.group_members[0].role;
        } else {
            return null;
        }

    } else {
        if (series.value?.feed?.page?.page_admins?.length) {
            return series.value?.feed?.page?.page_admins[0].role;
        } else {
            return null;
        }
    }
});




const openCreateDevotionDialog = ref(false);


const canCreateDevotion = computed(() => {
    const isGroup = Boolean(series.value?.feed?.group);
    const allowMembersToCreate = series.value?.feed?.group?.allow_members_to_create_devotion;

    if (isGroup) {
        const isPrivileged = ["group:admin", "group:owner"].includes(userRole.value);
        const isAllowedMember = userRole.value === "group:member" && allowMembersToCreate;
        return isPrivileged || isAllowedMember;
    }

    return ["page:admin", "page:owner"].includes(userRole.value);
});



const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

const truncateContent = (content) => {
    return htmlTruncate(content || "", 150);
};

// Add missing properties to match SeriesCard
const isLiked = ref(false); // This should be computed based on actual like status

const onLike = () => {
    // TODO: Implement like functionality
    console.log('Like clicked');
};

const onShare = () => {
    // TODO: Implement share functionality
    console.log('Share clicked');
};




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