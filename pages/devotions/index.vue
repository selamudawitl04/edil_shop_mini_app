<template>
    <DevotionsCreate v-if="openCreateNewDevotionDialog" v-model="openCreateNewDevotionDialog" :community-id="0"
        community-type="user" :role="'user'" />

    <NuxtLayout>
        <section
            class="bg-gradient-to-b from-primary-light/10 to-card-light dark:from-primary-dark/10 dark:to-card-dark pb-24 pt-36 px-4 sm:px-8 md:px-16 lg:px-32 transition-colors duration-300">
            <div class="max-w-3xl mx-auto text-center">

                <!-- Hero / Title -->
                <h1
                    class="text-4xl sm:text-5xl font-extrabold mb-4 text-textPrimary-light dark:text-textPrimary-dark flex justify-center items-center gap-3">
                    <span class="text-5xl">🛐</span>
                    Devotions
                </h1>
                <p
                    class="text-lg sm:text-xl text-textSecondary-light dark:text-textSecondary-dark mb-10 max-w-2xl mx-auto">
                    Connect, reflect, and grow spiritually by exploring heartfelt devotions shared by believers around
                    the world. Share your own journey and inspire others.
                </p>

                <!-- Search + Create -->
                <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-12">
                    <input type="text" placeholder="Search devotions..." v-model="search"
                        class="w-full sm:w-auto flex-1 px-4 py-3 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition" />

                    <template v-if="canCreateDevotion">
                        <BaseButton :full="false" size="md" @click="openCreateNewDevotionDialog = true"
                            class="bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light transition text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                            <Icon name="uil:plus" size="20" />
                            Share Devotion
                        </BaseButton>
                    </template>
                </div>

                <!-- Devotions List -->
                <div class="space-y-6">
                    <div v-if="devotions.length" class="grid gap-6 md:grid-cols-1">
                        <DevotionsCard v-for="devotion in devotions" :key="devotion.id" :devotion="devotion"
                            :role="'user'" :show-series="true" />
                    </div>

                    <!-- No Results -->
                    <div v-else-if="!loading" class="text-center text-textSecondary-light dark:text-textSecondary-dark">
                        <p class="text-lg">No devotions found.</p>
                        <p class="mt-2">Be the first to share your inspiration!</p>
                    </div>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="flex justify-center py-8">
                        <div class="loader"></div>
                    </div>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import getDevotionsQuery from "@/graphql/devotions/list.gql";

const user = useCookie("userData");
const canCreateDevotion = computed(() => true);

const search = ref("");
const limit = ref(50);
const offset = ref(0);
const length = ref(0);
const devotions = ref([]);
const sort = ref([{}]);

const filter = computed(() => {
    const query = {};
    query._and = {
        is_deleted: { _eq: false }
    };
    query._and._or = [
        { title: { _ilike: `%${search.value}%` } },
        { content: { _ilike: `%${search.value}%` } }
    ];
    return query;
});

const { onResult, loading, refetch } = queryList(getDevotionsQuery, {
    clientId: user.value?.id ? "auth" : "default",
    filter,
    order: sort,
    limit,
    offset,
    include_user: true
});

onResult(({ data }) => {
    if (data.devotion_devotions) {
        devotions.value = data.devotion_devotions;
        length.value = data.devotion_devotions_aggregate.aggregate.count;
    }
});

provide("refetchDevotions", refetch);

/* Create New Devotion Dialog */
const openCreateNewDevotionDialog = ref(false);
</script>
