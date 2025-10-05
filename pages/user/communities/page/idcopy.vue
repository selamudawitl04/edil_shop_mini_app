<template>
  <!-- -------------------Edit Page Dialod -->

  <PagesEditPageDialog v-if="page && myRoleForPage" v-model="openEditPageDialog" :page="page"
    :my-role-for-page="myRoleForPage" />

  <!-- -----------------Delete Page -->

  <PagesDeletePageDialog v-if="page && myRoleForPage" v-model="openDeletePageDialog" :page="page"
    :my-role-for-page="myRoleForPage" />

  <!-- -----------------Admin Leave Page -->
  <PagesAdminLeavePageDialog v-if="page && myRoleForPage" v-model="openLeavePageDialog"
    :my-role-for-page="myRoleForPage" />

  <div class="flex flex-col gap-3">
    <!-- ✅ Back Button on Mobile -->




    <BaseBack v-if="!isDesktop" />

    <div v-if="page && !loading" class=" text-textPrimary-light dark:text-textPrimary-dark">
      <div class="flex justify-between gap-3 items-start">
        <!-- ✅ Top section: image + title/stats -->
        <div class="flex items-start gap-4 mb-2">
          <!-- Group Image or Fallback Icon -->
          <div
            class="w-20 h-20 flex items-center justify-center rounded-md overflow-hidden bg-slate-200 dark:bg-slate-700">
            <img v-if="page.profile_image?.length" :src="page.profile_image" alt="Page"
              class="w-full h-full object-cover" />

            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-slate-400 dark:text-slate-300"
              fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h8V17H8v-1z" />
            </svg>
          </div>

          <!-- Title + Stats -->
          <div class="flex-1">
            <div class="flex justify-between gap-3 items-start">
              <h2 class="text-2xl font-bold text-primary-light dark:text-primary-dark">
                {{ page.name }}
              </h2>
            </div>

            <div class="mt-1 text-sm text-textSecondary-light dark:text-textSecondary-dark space-x-4">
              <span>Followers: {{ page?.followers_count || 0 }} </span>

              <!-------Un Follow-------- -->
              <button @click="openAcceptInvitationDialog = true"
                class="px-4 py-1.5 bg-primary-light dark:bg-primary-dark text-white rounded hover:bg-primary-dark dark:hover:bg-primary-light">
                Follow
              </button>
            </div>
          </div>
        </div>

        <!-- ---More options icon------------ -->
        <HeadlessPopover class="relative inline-block text-left">
          <HeadlessPopoverButton
            class="p-2 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition">
            <Icon name="mi:options-vertical" size="22" class="text-textPrimary-light dark:text-textPrimary-dark" />
          </HeadlessPopoverButton>

          <HeadlessPopoverPanel
            class="absolute right-0 mt-2 w-40 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50">
            <div class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark">
              <!-- ------------------Edit Page------- -->
              <button v-if="myRoleForPage" @click="editPage"
                class="w-full text-left flex items-center gap-2 px-4 py-2 transition rounded-md">
                <Icon name="mdi:pencil-outline" class="w-4 h-4" />
                Edit Page
              </button>

              <!-- -------------Delete Page  -->
              <button v-if="myRoleForPage.role == 'page:owner'" @click="deletePage"
                class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark transition rounded-md">
                <Icon name="mdi:delete-outline" class="w-4 h-4" />
                Delete Page
              </button>

              <!-- ------------Leave Page  -->
              <button @click="leavePage" v-if="myRoleForPage.role == 'page:admin'"
                class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark transition rounded-md">
                <Icon name="mdi:logout" class="w-4 h-4" />
                Leave Page
              </button>

              <!-- ------------Report Page  -->
              <button @click="reportPage"
                class="w-full text-left flex items-center gap-2 px-4 py-2 text-warning-light dark:text-warning-dark transition rounded-md">
                <Icon name="mdi:flag-outline" class="w-4 h-4" />
                Report Page
              </button>

              <!-- ------------Share Page  -->
              <button @click="sharePage"
                class="w-full text-left flex items-center gap-2 px-4 py-2 text-blue-500 dark:text-blue-400 transition rounded-md">
                <Icon name="mdi:share-variant" class="w-4 h-4" />
                Share Page
              </button>
            </div>
          </HeadlessPopoverPanel>
        </HeadlessPopover>
      </div>

      <!-- ✅ Description below -->
      <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark mt-2">
        {{ page.description }}
      </p>

      <div v-if="page.status !== 'active'" class="mt-4">
        <!-- Not active page status -->
        <div v-if="page.status === 'pending'"
          class="p-4 rounded-md mb-4 border-l-4 bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-100">
          <div class="flex items-center space-x-2">
            <span class="mt-1 text-xl">⏳</span>
            <p class="text-sm font-medium">
              Your group is under review. Please wait while we complete the
              process.
            </p>
          </div>
        </div>

        <!-- REJECTED -->
        <div v-if="page.status === 'rejected'"
          class="p-4 rounded-md mb-4 border-l-4 bg-red-50 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-100">
          <div class="flex items-center space-x-2">
            <span class="mt-1 text-xl">❌</span>
            <p class="text-sm font-medium">
              Your group has been rejected. Please contact us for more
              information.
            </p>
          </div>
        </div>

        <!-- DISABLED -->
        <div v-if="page.status === 'disabled'"
          class="p-4 rounded-md mb-4 border-l-4 bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-100">
          <div class="flex items-center space-x-2">
            <span class="mt-1 text-xl">🚫</span>
            <p class="text-sm font-medium">
              Your group has been disabled. Please contact support for details.
            </p>
          </div>
        </div>
      </div>

      <!-- ---------Page Detail------- -->

      <div v-else>
        <div class="my-5">
          <BaseTab id="pageDetailTab" :tabs="tabs" v-model:current-tab-index="currentTabIndex">
            <template #admins>
              <div class="">
                <PagesAdmins :page="page" />
              </div>
            </template>

            <template #prayer_requests>
              <div class="">
                <PagesRequestsList :page="page" :my-role-for-page="myRoleForPage" />
              </div>
            </template>

            <template #devotions>
              <div class="">
                <PagesDevotions :my-role-for-page="myRoleForPage" :page="page" />
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
const isDesktop = ref(false);
function handleResize() {
  isDesktop.value = window.innerWidth >= 1024;
}

const currentTabIndex = ref(0);
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
      name: "Devotions",
      value: "devotions",
    },
    {
      name: "Prayer Requests",
      value: "prayer_requests",
    },
    {
      name: "Events",
      value: "events",
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

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
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
</script>
