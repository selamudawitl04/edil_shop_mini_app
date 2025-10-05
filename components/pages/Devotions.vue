<template>
    <DevotionsCreate v-if="openCreateNewDevotionDialog" v-model="openCreateNewDevotionDialog" :community-id="page.id"
        community-type="page" :role="myRoleForPage.role" />
    <div class="space-y-3 my-4 lg:my-6 w-full">
        <div class="flex justify-between items-center  gap-2 px-0">

            <div>
                <input type="text" placeholder="Search devotions..." v-model="search"
                    class="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark" />
            </div>

            <!-- Page admin or owner can create devotion -->

            <template v-if="canCreateDevotion">
                <!-- <button @click="openCreateNewDevotionDialog = true"
                    class="inline-flex items-center justify-center px-2 samsg:px-4 py-2 text-sm font-semibold rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition whitespace-nowrap">
                    <Icon name="uil:plus" size="20" class="mr-2 hidden" />
                    Devotion
                </button> -->
                <BaseButton :full="false" size="md" @click="openCreateNewDevotionDialog = true">
                    <Icon name="uil:plus" size="20" class="mr-2 hidden" />

                    Devotion
                </BaseButton>
            </template>
        </div>



        <BaseTabButton v-model="activeIndex" :statuses="statuses" />

        <!-- ---------------------------Devotions List -------------------- -->
        <!-- only one column -->
        <div v-if="activeIndex != 1 && devotions.length" class="grid gap-6 md:grid-cols-1">
            <DevotionsCard v-for="devotion in devotions" :key="devotion.id" :devotion="devotion"
                :role="myRoleForPage?.role" :show-series="true" />
        </div>

        <!-- ---------------------------Series List -------------------- -->
        <div v-if="activeIndex === 1 && devotionSeries.length" class="grid gap-6 md:grid-cols-1">
            <DevotionsSeriesCard v-for="series in devotionSeries" :key="series.id" :series="series"
                :role="myRoleForPage?.role" />
        </div>

        <!-- ---------------No Result Found -->
        <div v-if="!loading && !devotions.length && activeIndex === 0" class="text-center">
            No devotions found
        </div>

        <div v-if="!loadingSeries && !devotionSeries.length && activeIndex === 1" class="text-center">
            No series found
        </div>

        <div v-if="loading && activeIndex === 0" class="class flex justify-center py-8">
            <div class="loader"></div>
        </div>

        <div v-if="loadingSeries && activeIndex === 1" class="class flex justify-center py-8">
            <div class="loader"></div>
        </div>



    </div>
</template>

<script setup>

import getDevotionsQuery from "@/graphql/devotions/list.gql";
import getDevotionSeriesQuery from "@/graphql/devotions/series_list.gql";
const props = defineProps({
    page: {
        type: Object,
        require: true,
    },
    myRoleForPage: {
        type: Object,
        required: true,
    },
});

const user = useCookie("userData")
const canCreateDevotion = computed(() => {
    return props.myRoleForPage?.role === "page:admin" || props.myRoleForPage?.role === "page:owner";
});


const statuses = ref([
    { name: "All", value: "all", count: 0 },
    { name: "Series", value: "series", count: 0 },
    { name: "Public", value: "public", count: 0 },
    { name: "Shared", value: "shared", count: 0 },
]);
const search = ref("");
const limit = ref(50);
const offset = ref(0);
const length = ref(0);
const devotions = ref([]);
const sort = ref([{}]);
const activeIndex = ref(0);
const filter = computed(() => {
    const query = {};
    query._and = {
        deleted_at: {
            _is_null: true,
        },
    };
    query._and._or = [
        {
            title: {
                _ilike: `%${search.value}%`,
            },
        },
    ];

    if (activeIndex.value === 2) {
        query._and.visibility = {
            _eq: "public",
        };
    }

    query._and.feed = {
        page_id: {
            _eq: props.page.id,
        },
    };

    return query;
});

const enabled = computed(() => {
    // Only enable if the page is defined and the user has a role
    return activeIndex.value !== 3;
});

const enabledSeries = computed(() => {
    // Enable series query when on series tab
    return activeIndex.value === 1;
});


const { onResult, loading, refetch } = queryList(getDevotionsQuery, {
    clientId: user.value?.id ? "auth" : "default",
    filter: filter,
    order: sort,
    limit: limit,
    offset: offset,
    enabled: enabled,
    include_user: true,
});

onResult(({ data }) => {
    if (data.devotion_devotions) {
        devotions.value = data.devotion_devotions;
        length.value = data.devotion_devotions_aggregate.aggregate.count;
    }
});

provide("refetchDevotions", refetch);


/* --------------------Devotion Series -------------------- */
const devotionSeries = ref([]);

const seriesFilter = computed(() => {
    const query = {};

    // Filter by page
    query.feed = {
        page_id: {
            _eq: props.page.id,
        },
    };

    // Add search filter if search term exists
    if (search.value) {
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

const { onResult: onResultSeries, loading: loadingSeries, refetch: refetchSeries } = queryList(getDevotionSeriesQuery, {
    clientId: user.value?.id ? "auth" : "default",
    filter: seriesFilter,
    order: sort,
    enabled: enabledSeries,
    include_user: true,
});

onResultSeries(({ data }) => {
    if (data.devotion_series) {
        devotionSeries.value = data.devotion_series;
    }
});
provide("refetchSerieses", refetchSeries);




/* --------------------Create New Devotion Dialog -------------------- */
const openCreateNewDevotionDialog = ref(false);




</script>