<template>

    <div class=" mx-auto">
        <div class="space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                    Choose a Series
                </h3>
                <button @click="showCreateSeriesDialog = true"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition">
                    <Icon name="mdi:plus" size="16" class="mr-1" />
                    New Series
                </button>
            </div>


            <!-- Search -->
            <div class="relative">
                <input v-model="search" type="text" placeholder="Search devotion series..."
                    class="w-full px-3 py-2 pl-10 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark" />
                <Icon name="mdi:magnify" size="20"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary-light dark:text-textSecondary-dark" />
            </div>

            <!-- Series List Container (fixed height) -->
            <div class="h-64 overflow-y-auto space-y-3 relative" ref="seriesListRef">
                <!-- Series List -->
                <template v-if="filteredSeries.length">
                    <div v-for="series in filteredSeries" :key="series.id" @click="selectSeries(series)"
                        class="cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:border-primary-light dark:hover:border-primary-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-all"
                        :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10': selectedSeries?.id === series.id }">
                        <div class="flex items-start gap-3">
                            <!-- Cover Image or Icon -->
                            <div class="flex-shrink-0">
                                <div v-if="series.cover_image"
                                    class="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                    <img :src="series.cover_image" :alt="series.title"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div v-else
                                    class="w-12 h-12 rounded-lg bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center">
                                    <Icon name="mdi:book-multiple" size="24"
                                        class="text-primary-light dark:text-primary-dark" />
                                </div>
                            </div>

                            <!-- Series Info -->
                            <div class="flex-1 min-w-0">
                                <h4
                                    class="font-medium text-sm text-textPrimary-light dark:text-textPrimary-dark truncate">
                                    {{ series.title }}
                                </h4>

                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                        {{ series.devotions_aggregate?.aggregate?.count || 0 }} devotions
                                    </span>
                                    <span class="text-xs px-2 py-1 rounded-full" :class="series.visibility === 'public'
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'">
                                        {{ series.visibility === 'public' ? 'Public' : 'Private' }}
                                    </span>
                                </div>
                            </div>

                            <!-- Selection Indicator -->
                            <div v-if="selectedSeries?.id === series.id" class="flex-shrink-0">
                                <Icon name="mdi:check-circle" size="20"
                                    class="text-primary-light dark:text-primary-dark" />
                            </div>
                        </div>
                    </div>
                </template>

                <!-- No Series At All -->
                <template v-else>
                    <div
                        class="flex flex-col items-center justify-center h-full py-8 text-textSecondary-light dark:text-textSecondary-dark">
                        <Icon name="mdi:book-multiple-outline" size="48" class="mb-2 opacity-50" />
                        <p v-if="search" class="text-sm">No devotion series found for "{{ search }}"</p>
                        <p v-else class="text-sm">No devotion series found</p>
                        <button @click="showCreateSeriesDialog = true"
                            class="mt-2 text-primary-light dark:text-primary-dark hover:underline text-sm">
                            Create your first series
                        </button>
                    </div>
                </template>
            </div>


            <!-- Navigation -->
            <div class="flex justify-between items-center gap-4  ">
                <BaseButton @click="emit('previous')" type="button" :full="false">
                    Previous
                </BaseButton>
                <BaseButton :disabled="!selectedSeries" class="w-fit" @click="confirmSelection" type="button"
                    :full="false">
                    Next
                </BaseButton>
            </div>


        </div>

        <!-- Create Series Dialog -->
        <DevotionSeriesCreateDialog v-if="showCreateSeriesDialog" v-model="showCreateSeriesDialog"
            :community-id="communityId" :community-type="communityType" :role="role" :is-private-group="isPrivateGroup"
            @series-created="onSeriesCreated" />
    </div>

</template>

<script setup>
import DevotionSeriesCreateDialog from "~/components/devotions/SeriesCreateDialog.vue";
import getDevotionSeriesQuery from "@/graphql/devotions/series_list.gql";

const props = defineProps({
    modelValue: {
        type: Object,
        default: null,
    },

    communityId: {
        type: String,
        required: true,
    },
    communityType: {
        type: String,
        default: "group",
    },
    role: {
        type: String,
        default: "group:admin",
    },
    isPrivateGroup: {
        type: Boolean,
        default: false,
    },

});

const emit = defineEmits(["update:modelValue", "series-selected", "previous"]);

const selectedSeries = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const search = ref("");
const showCreateSeriesDialog = ref(false);
const user = useCookie("userData")

const refetchSerieses = inject("refetchSerieses");

// GraphQL query setup
const limit = ref(20);
const offset = ref(0);
const sort = ref([{ created_at: "desc" }]);


const filter = computed(() => {
    const query = {};

    // Filter by community type
    if (
        props.communityType === "group" &&
        (props.role === "group:admin" || props.role === "group:owner")
    ) {
        query.feed = {
            group_id: {
                _eq: props.communityId,
            },
        };
    } else if (props.communityType === "group" && props.role === "group:member") {
        query.feed = {
            group_id: {
                _eq: props.communityId,
            },
        };
        query.created_by = {
            _eq: user.value?.id,
        };
    } else if (props.communityType === "page") {
        query.feed = {
            page_id: {
                _eq: props.communityId,
            },
        };
    }
    // Add search filter if search term exists
    if (search.value?.length) {
        query._or = [
            {
                title: {
                    _ilike: `%${search.value}%`,
                },
            },

        ];
    }
    return query;
});

const { onResult, refetch } = queryList(getDevotionSeriesQuery, {
    clientId: "auth",
    filter: filter,
    order: sort,
    limit: limit,
    offset: offset,
});

const series = ref([]);

onResult(({ data }) => {
    if (data.devotion_series) {
        series.value = data.devotion_series;
    }
});

const filteredSeries = computed(() => {
    return series.value;
});

const selectSeries = (series) => {
    selectedSeries.value = series;
};

const confirmSelection = () => {
    if (selectedSeries.value) {
        emit("series-selected", selectedSeries.value);
    }
};
const onSeriesCreated = (newSeries) => {
    // Refresh the series list after creating a new one
    refetch();
    selectedSeries.value = newSeries;
    if (typeof refetchSerieses === "function") {
        refetchSerieses();
    }
};

</script>