<template>
  <!-- -------------------Edit Page Dialod -->
  <PagesEditPageDialog
    v-if="page && myRoleForPage"
    v-model="openEditPageDialog"
    :page="page"
    :my-role-for-page="myRoleForPage"
  />

  <!-- -----------------Delete Page -->
  <PagesDeletePageDialog
    v-if="page && myRoleForPage"
    v-model="openDeletePageDialog"
    :page="page"
    :my-role-for-page="myRoleForPage"
  />

  <!-- -----------------Admin Leave Page -->
  <PagesAdminLeavePageDialog
    v-if="page && myRoleForPage"
    v-model="openLeavePageDialog"
    :my-role-for-page="myRoleForPage"
  />

  <div class="flex flex-col">
    <!-- ✅ Back Button on Mobile -->
    <BaseBackHeader :title="page?.name || 'Page Detail'" />

    <div
      v-if="page && !loading"
      class="text-textPrimary-light dark:text-textPrimary-dark"
    >
      <!-- Cover Image Section -->
      <div
        @click.stop="handleCoverImageClick"
        class="relative w-full h-48 md:h-64 lg:h-80 bg-gradient-to-br from-primary-light/20 to-primary-dark/20 dark:from-primary-dark/20 dark:to-primary-light/20 hover:cursor-pointer"
      >
        <!-- Cover Image -->
        <img
          v-if="page.cover_image"
          :src="page.cover_image"
          :alt="page.name"
          class="w-full h-full object-cover"
        />

        <!-- Fallback Background -->
        <div v-else class="w-full h-full flex items-center justify-center">
          <div class="text-center">
            <Icon
              name="mdi:file-document"
              size="64"
              class="text-primary-light/50 dark:text-primary-dark/50 mx-auto mb-2"
            />
            <p
              class="text-primary-light/70 dark:text-primary-dark/70 text-sm font-medium"
            >
              {{ page.name }}
            </p>
          </div>
        </div>

        <!-- Update Cover Image -->
        <div
          v-if="myRoleForPage"
          class="absolute bottom-2 right-4 md:right-8 transform translate-y-1/2"
        >
          <div class="relative inline-block">
            <PagesUpdateCoverImage
              ref="coverImageUploaderWrapper"
              :page="page"
              :my-role-for-page="myRoleForPage"
            />
          </div>
        </div>

        <!-- Circular Profile Image -->
        <div
          class="absolute bottom-0 left-4 md:left-8 transform translate-y-1/2 hover:cursor-pointer"
          @click.stop="handleProfileImageClick"
        >
          <BaseAvatar
            :avatar_image="page.profile_image"
            :avatar_color="page.avatar_color"
            size="110"
            custom_class="border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800 shadow-lg"
            :name="page.name"
          />
          <PagesUpdateProfileImage
            ref="profileImageUploaderWrapper"
            v-if="myRoleForPage"
            :page="page"
            :my-role-for-page="myRoleForPage"
          />
        </div>

        <!-- Action Buttons -->
        <div
          class="absolute -bottom-8 right-4 md:right-8 transform translate-y-1/2 flex gap-2"
        >
          <BaseButton
            variant="primary-light"
            size="md"
            @click.stop="openAcceptInvitationDialog = true"
          >
            Follow
          </BaseButton>

          <!-- More Options -->
          <HeadlessPopover class="relative inline-block text-left">
            <HeadlessPopoverButton
              class="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-primary-light dark:hover:bg-primary-dark transition-colors border dark:border-none"
            >
              <Icon
                name="mi:options-vertical"
                size="20"
                class="text-textPrimary-light dark:text-textPrimary-dark hover:text-white"
              />
            </HeadlessPopoverButton>

            <HeadlessPopoverPanel
              class="absolute right-0 mt-2 w-40 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50"
            >
              <div
                class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark"
              >
                <!-- Edit Page -->
                <button
                  v-if="myRoleForPage"
                  @click.stop="editPage"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
                >
                  <Icon name="mdi:pencil-outline" class="w-4 h-4" />
                  Edit Page
                </button>

                <!-- Delete Page -->
                <button
                  v-if="myRoleForPage.role == 'page:owner'"
                  @click.stop="deletePage"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md"
                >
                  <Icon name="mdi:delete-outline" class="w-4 h-4" />
                  Delete Page
                </button>

                <!-- Leave Page -->
                <button
                  @click.stop="leavePage"
                  v-if="myRoleForPage.role == 'page:admin'"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md"
                >
                  <Icon name="mdi:logout" class="w-4 h-4" />
                  Leave Page
                </button>

                <!-- Report Page -->
                <button
                  @click.stop="reportPage"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-warning-light dark:text-warning-dark hover:bg-warning-light/10 dark:hover:bg-warning-dark/10 transition rounded-md"
                >
                  <Icon name="mdi:flag-outline" class="w-4 h-4" />
                  Report Page
                </button>

                <!-- Share Page -->
                <button
                  @click.stop="sharePage"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition rounded-md"
                >
                  <Icon name="mdi:share-variant" class="w-4 h-4" />
                  Share Page
                </button>
              </div>
            </HeadlessPopoverPanel>
          </HeadlessPopover>
        </div>
      </div>

      <!-- Page Info Section -->
      <div class="px-3 lg:px-6 pt-16">
        <!-- Page Name and Stats -->
        <div class="flex justify-between items-start mb-1.5">
          <div class="flex-1">
            <h2
              class="text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-2"
            >
              {{ page.name }}
            </h2>

            <div
              class="flex items-center gap-4 text-sm text-textSecondary-light dark:text-textSecondary-dark"
            >
              <span>{{ page?.followers_count || 0 }} Followers</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p
          class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-6"
        >
          {{ page.description }}
        </p>

        <!-- Status Messages -->
        <div v-if="page.status !== 'active'" class="mb-6">
          <!-- PENDING -->
          <div
            v-if="page.status === 'pending'"
            class="p-4 rounded-md mb-4 border-l-4 bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-100"
          >
            <div class="flex items-center space-x-2">
              <span class="mt-1 text-xl">⏳</span>
              <p class="text-sm font-medium">
                Your page is under review. Please wait while we complete the
                process.
              </p>
            </div>
          </div>

          <!-- REJECTED -->
          <div
            v-if="page.status === 'rejected'"
            class="p-4 rounded-md mb-4 border-l-4 bg-red-50 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-100"
          >
            <div class="flex items-center space-x-2">
              <span class="mt-1 text-xl">❌</span>
              <p class="text-sm font-medium">
                Your page has been rejected. Please contact us for more
                information.
              </p>
            </div>
          </div>

          <!-- DISABLED -->
          <div
            v-if="page.status === 'disabled'"
            class="p-4 rounded-md mb-4 border-l-4 bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-100"
          >
            <div class="flex items-center space-x-2">
              <span class="mt-1 text-xl">🚫</span>
              <p class="text-sm font-medium">
                Your page has been disabled. Please contact support for details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Detail Tabs -->
      <div v-if="page.status === 'active'" class="px-3 lg:px-6">
        <div class="my-5">
          <BaseTab
            id="pageDetailTab"
            :tabs="tabs"
            v-model:current-tab-index="currentTabIndex"
          >
            <template #admins>
              <div class="">
                <PagesAdmins :page="page" />
              </div>
            </template>

            <template #prayer_requests>
              <div class="">
                <PagesRequestsList
                  :page="page"
                  :my-role-for-page="myRoleForPage"
                />
              </div>
            </template>

            <template #devotions>
              <div class="">
                <PagesDevotions
                  :my-role-for-page="myRoleForPage"
                  :page="page"
                />
              </div>
            </template>

            <template #testimonies>
              <div class="">
                <PagesTestimonies
                  :my-role-for-page="myRoleForPage"
                  :page="page"
                />
              </div>
            </template>

            <template #events>
              <div class="">
                <PagesEvents :my-role-for-page="myRoleForPage" :page="page" />
              </div>
            </template>
          </BaseTab>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import getPageQuery from "@/graphql/pages/get_page.gql";

const route = useRoute();
const router = useRouter();
const user = useCookie("userData");

const page = ref();
const { onResult, onError, refetch, loading } = queryItem(getPageQuery, {
  id: route.params.id,
  include_user: true,
  clientId: user.value?.id ? "auth" : "default",
});

provide("refetchPage", refetch);
onResult(({ data }) => {
  if (data?.page) {
    page.value = data?.page;
  } else {
    showError(
      createError({
        statusCode: 404,
        statusMessage: "Page Not Found",
        message: "The requested page does not exist.",
        fatal: true,
      })
    );
  }
});

onError(() => {
  // 500 — Internal Server Error
  showError(
    createError({
      statusCode: 500,
      statusMessage: "Failed to Fetch Page",
      message: "An unexpected error occurred while fetching the page.",
      fatal: true,
    })
  );
});

const myRoleForPage = computed(() => {
  return page.value?.page_admins?.find(
    (pageAdmin) => pageAdmin.user_id == user.value?.id
  );
});
const tabs = computed(() => {
  const _tabs = [
    {
      name: "Events",
      value: "events",
    },
    {
      name: "Testimonies",
      value: "testimonies",
    },

    {
      name: "Devotions",
      value: "devotions",
    },
    {
      name: "Prayer Requests",
      value: "prayer_requests",
    },
  ];

  if (myRoleForPage.value?.role == "page:owner") {
    _tabs.push({
      name: "Admins",
      value: "admins",
    });
  }
  return _tabs;
});

function getTabIndex() {
  if (route.query.tab) {
    return tabs.value.findIndex((tab) => tab.value === route.query.tab);
  }
  return 0;
}

const currentTabIndex = ref(getTabIndex());
watch(currentTabIndex, (newVal) => {
  router.push({
    query: {
      tab: tabs.value[newVal].value,
    },
  });
});

/**-------------------UnFollow Page------------- */
const openUnFollowDialog = ref(false);
const unFollow = () => {
  openUnFollowDialog.value = true;
};
/**-------------------Leave page---------------- */
const openLeavePageDialog = ref(false);
const leavePage = () => {
  openLeavePageDialog.value = true;
};

/**-------------------Edit Page------------- */
const openEditPageDialog = ref(false);
const editPage = () => {
  openEditPageDialog.value = true;
};

const openDeletePageDialog = ref(false);

/**-------------------Delete Page------------- */
const deletePage = () => {
  openDeletePageDialog.value = true;
};

/**--------------------Cover Image Uploader------------- */
const coverImageUploaderWrapper = ref(null);
const handleCoverImageClick = () => {
  if (
    myRoleForPage.value?.role == "page:owner" ||
    myRoleForPage.value?.role == "page:admin"
  ) {
    if (coverImageUploaderWrapper.value) {
      coverImageUploaderWrapper.value.openFilePicker();
    }
  }
};

/**--------------------Profile Image Uploader------------- */
const profileImageUploaderWrapper = ref(null);
const handleProfileImageClick = () => {
  if (
    myRoleForPage.value?.role == "page:owner" ||
    myRoleForPage.value?.role == "page:admin"
  ) {
    if (profileImageUploaderWrapper.value) {
      profileImageUploaderWrapper.value.openFilePicker();
    }
  }
};
</script>
