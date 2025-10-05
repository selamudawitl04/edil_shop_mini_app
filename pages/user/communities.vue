<template>
  <SelectCommunityTypeDialog v-model="openCreateCommunityDialog" />
  <NuxtLayout name="user">
    <!-- Sticky Mobile Header -->
    <header
      v-if="!$route.params?.id && !$route.path?.includes('create')"
      class="sticky top-0 z-50 w-full border-b border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark shadow-sm px-4 py-1 lg:hidden"
    >
      <div class="flex items-center justify-between gap-2 w-full">
        <!-- Left Section -->
        <div class="flex items-center gap-2 w-full">
          <transition name="fade" mode="out-in">
            <!-- Title Mode Group -->
            <div
              v-if="!openSearch"
              key="title-group"
              class="flex items-center gap-2 w-full"
            >
              <button
                @click="handleBack"
                class="text-textPrimary-light dark:text-textPrimary-dark hover:opacity-75 transition"
              >
                <Icon name="mdi:arrow-left" size="24" />
              </button>
              <h2
                class="text-base font-semibold text-textPrimary-light dark:text-textPrimary-dark truncate"
              >
                My Communities
              </h2>
            </div>

            <!-- Search Mode Group -->
            <div
              v-else
              key="search-group"
              class="flex items-center gap-2 w-full"
            >
              <button
                @click="handleBack"
                class="text-textPrimary-light dark:text-textPrimary-dark hover:opacity-75 transition"
              >
                <Icon name="mdi:arrow-left" size="24" />
              </button>
              <input
                type="text"
                v-model="search"
                placeholder="Search communities ..."
                class="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all duration-200"
              />
            </div>
          </transition>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-2 shrink-0">
          <transition name="fade" mode="out-in">
            <div
              v-if="!openSearch"
              key="right-title"
              class="flex items-center gap-2"
            >
              <button
                @click="openSearch = true"
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition"
                aria-label="Open Search"
              >
                <Icon
                  name="heroicons:magnifying-glass"
                  size="20"
                  class="text-textPrimary-light dark:text-textPrimary-dark"
                />
              </button>
              <button
                @click="openCreateCommunityDialog = true"
                class="px-3 py-1.5 text-sm rounded-md bg-primary-light text-white dark:bg-primary-dark font-medium hover:bg-blue-700 dark:hover:bg-blue-300 dark:hover:text-black transition whitespace-nowrap"
              >
                + Create
              </button>
            </div>

            <div v-else key="right-search" class="flex items-center gap-2">
              <button
                @click="openSearch = false"
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition"
                aria-label="Close Search"
              >
                <Icon
                  name="heroicons:x-mark"
                  size="20"
                  class="text-textPrimary-light dark:text-textPrimary-dark"
                />
              </button>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <div class="flex max-w-full lg:overflow-hidden">
      <!-- Sidebar: show always on desktop or on mobile if not in create/detail view -->
      <aside
        v-if="
          (!$route.path?.includes('create') && !$route.params.id) || isDesktop
        "
        class="w-full lg:w-1/4 lg:max-w-xs mx-auto sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto lg:border-r lg:pr-4 space-y-2 no-scrollbar"
        :class="[
          'bg-background-light dark:bg-background-dark',
          'border-borderColor-light dark:border-borderColor-dark',
        ]"
      >
        <!-- Sticky Header (Desktop) -->
        <header
          class="sticky top-0 z-50 w-full hidden lg:block bg-background-light dark:bg-background-dark"
        >
          <div
            class="flex items-center justify-between gap-2 w-full min-h-[42px]"
          >
            <!-- Left Section: Title/Search -->
            <div class="flex items-center gap-2 w-full">
              <transition name="fade" mode="out-in">
                <!-- Search Mode -->
                <div v-if="openSearch" key="search" class="relative w-full">
                  <input
                    type="text"
                    v-model="search"
                    placeholder="Search communities ..."
                    class="w-full px-3 py-2 pr-10 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all duration-200"
                  />
                  <!-- Close Icon inside input -->
                  <button
                    @click="openSearch = false"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-textSecondary-light dark:text-textSecondary-dark hover:text-textPrimary-light dark:hover:text-textPrimary-dark transition"
                    aria-label="Close Search"
                  >
                    <Icon name="heroicons:x-mark" size="18" />
                  </button>
                </div>

                <!-- Title Mode -->
                <div v-else key="title" class="flex items-center gap-2">
                  <h2
                    class="text-base font-semibold text-textPrimary-light dark:text-textPrimary-dark truncate"
                  >
                    My Communities
                  </h2>
                </div>
              </transition>
            </div>

            <!-- Right Section: Buttons (Always visible) -->
            <div class="flex items-center gap-2 shrink-0">
              <!-- Search Toggle -->
              <transition name="fade" mode="out-in">
                <button
                  v-if="!openSearch"
                  key="search-btn"
                  @click="openSearch = true"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition"
                  aria-label="Open Search"
                >
                  <Icon
                    name="heroicons:magnifying-glass"
                    size="20"
                    class="text-textPrimary-light dark:text-textPrimary-dark"
                  />
                </button>
              </transition>

              <!-- Create Button -->
              <button
                @click="openCreateCommunityDialog = true"
                class="px-3 py-1.5 text-sm rounded-md bg-primary-light text-white dark:bg-primary-dark font-medium hover:bg-blue-700 dark:hover:bg-blue-300 dark:hover:text-black transition whitespace-nowrap"
              >
                + Create
                <span class="hidden xs:inline lg:hidden">New Community</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Communities List -->

        <CommunitiesFilter v-model="activeIndex" :statuses="statuses" />

        <div v-if="loading" class="class flex justify-center py-8">
          <div class="loader"></div>
        </div>

        <template v-else>
          <template v-if="activeIndex != 1">
            <div>
              <ul v-if="groups.length">
                <li v-for="group in groups" :key="group.id">
                  <NuxtLink
                    :to="`/user/communities/group/${group.id}?name=${group.name}`"
                    class="flex items-start gap-3 p-2 rounded-md cursor-pointer transition hover:bg-primary-light/10 dark:hover:bg-primary-dark/10"
                    active-class="bg-primary-light/10 dark:bg-primary-dark/10"
                  >
                    <BaseAvatar
                      :avatar_image="group.profile_image"
                      :name="group.name"
                      :avatar_color="group.avatar_color"
                      class="w-10 h-10 rounded-full"
                    />

                    <!-- Info -->
                    <div class="flex-1">
                      <div class="text-sm font-medium line-clamp-1">
                        {{ group.name }}
                      </div>
                      <div class="text-xs mt-0.5">
                        {{ group.group_members?.length }} members
                      </div>
                    </div>
                  </NuxtLink>
                </li>
              </ul>

              <!-- No Results -->
              <p
                v-else
                class="text-center text-sm text-textSecondary-light dark:text-textSecondary-dark mt-4"
              >
                No groups found.
              </p>
            </div>
          </template>

          <!-- ---------------Pages------------- -->
          <template v-else>
            <div v-if="pagesLoading" class="class flex justify-center py-8">
              <div class="loader"></div>
            </div>
            <div v-else>
              <ul v-if="pages.length">
                <li v-for="page in pages" :key="page.id">
                  <NuxtLink
                    :to="`/user/communities/page/${page.id}?name=${page.name}`"
                    class="flex items-start gap-3 p-2 rounded-md cursor-pointer transition hover:bg-primary-light/10 dark:hover:bg-primary-dark/10"
                    active-class="bg-primary-light/10 dark:bg-primary-dark/10"
                  >
                    <BaseAvatar
                      :avatar_image="page.profile_image"
                      :name="page.name"
                      :avatar_color="page.avatar_color"
                      class="w-10 h-10 rounded-full"
                    />

                    <!-- Info -->
                    <div class="flex-1">
                      <div class="text-sm capitalize font-medium line-clamp-1">
                        {{ page.name }}
                      </div>
                      <div class="text-xs mt-0.5">
                        {{ page?.followers_count || 0 }} Followers
                      </div>
                    </div>
                  </NuxtLink>
                </li>
              </ul>

              <!-- No Results -->
              <p
                v-else
                class="text-center text-sm text-textSecondary-light dark:text-textSecondary-dark mt-4"
              >
                No pages found.
              </p>
            </div>
          </template>
        </template>
      </aside>

      <!--  Detail Community -->
      <section
        v-if="$route.path?.includes('create') || $route.params.id"
        class="flex-1 w-full lg:overflow-y-auto h-[calc(100vh-100px)]"
      >
        <NuxtPage />
      </section>

      <!-- Placeholder -->
      <section
        v-else-if="isDesktop"
        class="flex-1 text-textSecondary-light dark:text-textSecondary-dark text-center pt-20"
      >
        Please select a community to view its details.
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup>
import getGroupsQuery from "@/graphql/groups/get_groups.gql";
import getPagesQuery from "@/graphql/pages/get_pages.gql";

const router = useRouter();
const route = useRoute();

function handleBack() {
  router.replace("/");
}

const statuses = ref([
  { name: "All", value: "all", count: 0 },
  { name: "Pages", value: "pages", count: 0 },
  { name: "Request", value: "pending", count: 0 },
  { name: "Invitation", value: "invited", count: 0 },
]);

const activeIndex = ref(0);
if (route.fullPath.includes("group")) {
  activeIndex.value = 0;
} else if (route.fullPath.includes("page")) {
  activeIndex.value = 1;
}
const user = useCookie("userData");
const search = ref("");

const openSearch = ref(false);

/**---------------------------------Fetch groups------------------ */
const groups = ref([]);
const limit = ref(2000);
const sort = ref([{}]);
const offset = ref(0);

const filter = computed(() => {
  const query = {
    _and: [
      // Filter name, description, and other fields
      {
        _or: [
          {
            name: {
              _ilike: `%${search.value}%`,
            },
          },
          {
            description: {
              _ilike: `%${search.value}%`,
            },
          },
        ],
      },

      // Group member status filter
      {
        _or: [
          {
            group_members: {
              _and: {
                user_id: {
                  _eq: user.value.id,
                },
                status: {
                  _eq: statuses.value[activeIndex.value].value,
                },
              },
            },
          },
        ],
      },
    ],
  };

  if (activeIndex.value === 0) {
    query._and[1]._or[0].group_members._and.status = {
      _in: ["approved", "pending", "invited"],
    };
    query._and[1]._or.push({
      owner_id: {
        _eq: user.value.id,
      },
    });
  }

  return query;
});

const enabled = computed(() => activeIndex.value != 1);
const { onResult, refetch, loading } = queryList(getGroupsQuery, {
  order: sort,
  offset: offset,
  limit: limit,
  clientId: "auth",
  filter: filter,
  enabled: enabled,
});

onResult(({ data }) => {
  if (data) {
    groups.value = data.prayer_groups;
  }
});

provide("refetchGroups", refetch);

/**---------------------------------Fetch pages------------------ */
const pages = ref([]);
const pagesLimit = ref(2000);
const pagesSort = ref([{}]);
const pagesOffset = ref(0);

const pagesFetchEnabled = computed(() => activeIndex.value == 1);

const pagesFilter = computed(() => {
  const query = {
    _and: [
      // pagesFilter name, description, and other fields
      {
        _or: [
          {
            name: {
              _ilike: `%${search.value}%`,
            },
          },
          {
            description: {
              _ilike: `%${search.value}%`,
            },
          },
        ],
      },

      // Followers pagesFilter
      {
        _or: [
          {
            page_followers: {
              _and: {
                user_id: {
                  _eq: user.value.id,
                },
              },
            },
          },

          {
            page_admins: {
              _and: {
                user_id: {
                  _eq: user.value.id,
                },
              },
            },
          },
        ],
      },
    ],
  };

  return query;
});
const {
  onResult: pagesResult,
  refetch: pagesRefetch,
  loading: pagesLoading,
} = queryList(getPagesQuery, {
  order: pagesSort,
  offset: pagesOffset,
  limit: pagesLimit,
  filter: pagesFilter,
  enabled: pagesFetchEnabled,
});
pagesResult(({ data }) => {
  if (data) {
    pages.value = data.pages;
  }
});

provide("refetchPages", pagesRefetch);

// Detect desktop
const isDesktop = ref(false);
function handleResize() {
  isDesktop.value = window.innerWidth >= 1024;
}
handleResize();
window.addEventListener("resize", handleResize);

/**----------------------------Create community Dialog----------------------- */
const openCreateCommunityDialog = ref(false);
</script>
