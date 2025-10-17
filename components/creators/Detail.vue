<template>
  <!-- Header with back icon -->
  <BasePageDialog v-model="creatorStore.showCreator">
    <template #content>
      <header
        v-if="errorHappened"
        class="sticky top-0 bg-white shadow-sm flex items-center px-4 py-3 z-50"
      >
        <button
          @click="goBack()"
          class="flex items-center text-gray-700 hover:text-primary-light transition"
        >
          <Icon name="si:arrow-left-line" class="text-4xl" />

          ውዱዋላ ተመለስ
        </button>
      </header>
      <BaseError v-if="errorHappened" show-retry @retry="refetch" />
      <div v-else>
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="loader"></div>
        </div>

        <!-- No Result -->
        <div v-if="!loading && !creator" class="text-center">
          <BaseZeroResult message="ምንም ውጤት አልተገኘም" />
        </div>

        <!-- Main Content -->
        <section
          v-if="creator"
          class="container lg:py-8 min-h-screen max-w-5xl lg:space-y-6"
        >
          <!-- Sticky Header -->
          <div class="sticky top-0 z-50 bg-white px-3">
            <!-- Header Bar -->
            <header class="flex items-center justify-between py-2">
              <div class="flex items-center gap-2">
                <!-- Back Button -->
                <button @click="goBack">
                  <Icon name="si:arrow-left-line" class="text-4xl" />
                </button>

                <!-- Creator Name -->
                <h1 class="text-xl font-semibold text-gray-900">
                  {{ creator.name }}
                </h1>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <!-- Like Button -->
                <CreatorsLike :creator="creator" />
              </div>
            </header>

            <!-- Tabs -->

            <div class="pb-2">
              <div class="flex bg-gray-200 rounded-lg">
                <button
                  v-for="(tab, index) in tabs"
                  :key="tab.id"
                  @click="selectedTabIndex = index"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                  :class="
                    selectedTabIndex === index
                      ? 'bg-primary-light text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-300'
                  "
                >
                  <Icon :name="tab.icon" class="text-base" />
                  {{ tab.name }}
                </button>
              </div>
            </div>

            <div
              v-if="selectedTabIndex === 1"
              class="flex items-center gap-2 text-sm"
            >
              <div
                v-for="(tab, index) in lotteryTabs"
                :key="index"
                class="flex-1 cursor-pointer rounded-lg py-1.5 px-1 text-center transition-all duration-200"
                :class="
                  selected === index
                    ? 'bg-primary-light text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
                @click="selected = index"
              >
                <div class="flex justify-center items-center gap-1">
                  <!-- Icon -->
                  <Icon :name="tab.icon" class="text-base" />
                  <!-- Title -->
                  <span class="font-semibold text-sm">{{ tab.title }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- --------------Creator Detail Component---------------- -->
          <CreatorsInformation v-if="selectedTabIndex === 0" :user="creator" />

          <!-- --------------Creator Lotteries Component---------------- -->
          <CreatorsLotteries
            v-if="selectedTabIndex === 1"
            :user="creator"
            :selected="selected"
          />
        </section>
      </div>
    </template>
  </BasePageDialog>
</template>

<script setup>
import getCreatorQuery from "@/graphql/creators/item.gql";
import { useCreatorStore } from "@/stores/creator";

const creatorStore = useCreatorStore();

const creator = ref(null);

const errorHappened = ref(false);

// Tabs configuration
const tabs = computed(() => [
  {
    id: "overview",
    name: "መረጃ",
    value: "overview",
    icon: "mdi:information-outline",
  },
  {
    id: "lotteries",
    name: "እጣዎች",
    value: "lotteries",
    icon: "mdi:ticket-confirmation-outline",
  },
]);

const selectedTabIndex = ref(0);
const selected = ref(0);

const lotteryTabs = [
  { title: "ሁሉም", icon: "gg:list" }, // All
  { title: "ያልዎጡ", icon: "mdi:autorenew" }, // Not Played
  { title: "የዎጡ", icon: "material-symbols:emoji-events" }, // Won
  { title: "የተጠናቀቁ", icon: "tdesign:time" }, // Completed / Scheduled
];

// GraphQL query
const { onResult, onError, refetch, loading } = queryItem(getCreatorQuery, {
  id: creatorStore.selectedCreatorId,
  clientId: "auth",
});

onResult(({ data }) => {
  if (data?.users_by_pk) {
    creator.value = data.users_by_pk;
  }

  if (!data?.users_by_pk) {
    errorHappened.value = true;
  } else {
    errorHappened.value = false;
  }
});

onError((error) => {
  errorHappened.value = true;
});

provide("refetchCreator", refetch);

function goBack() {
  creatorStore.closeCreator();
}
</script>
