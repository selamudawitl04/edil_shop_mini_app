<template>
  <!-- --------------Add admin-------------- -->

  <PagesAddAdminDialog v-if="page && openAddAdminDialog" v-model="openAddAdminDialog" :page="page" />

  <!-- ------------Remove admin----------------- -->
  <PagesRemoveAdminDialog v-if="page && openRemoveAdminDialog" v-model="openRemoveAdminDialog" :admin="selectedAdmin" />

  <div class="space-y-3 my-4 lg:my-6 w-full">
    <!-- -----------------Admins search and add new admins ---------------->
    <div class="flex justify-between items-center mb-4 gap-2 px-0">
      <div>
        <input type="text" placeholder="Search admins..." v-model="search"
          class="w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-card-dark text-textPrimary-light dark:text-textPrimary-dark placeholder-textSecondary-light dark:placeholder-textSecondary-dark border-borderColor-light dark:border-borderColor-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-background-light dark:focus:ring-offset-background-dark" />
      </div>

      <!-- Add New Button (only for owner) -->

      <button @click="openAddAdminDialog = true"
        class="inline-flex items-center justify-center px-2 samsg:px-4 py-2 text-sm font-semibold rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition whitespace-nowrap">
        <Icon name="uil:plus" size="20" class="mr-2 hidden" />
        Add Admin
      </button>
    </div>

    <!-- ---------------Admin list------- -->

    <!-- 👥 Admins List -->
    <ul v-if="pageAdmins?.length" class="space-y-2">
      <li v-for="pageAdmin in pageAdmins" :key="pageAdmin.id" class="hover:cursor-pointer">
        <div
          class="flex items-center justify-between p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition">
          <!-- 👤 User Info Section -->
          <div class="flex items-start gap-3">
            <!-- 🖼️ Avatar -->

            <BaseAvatar :avatar_image="pageAdmin.user.profile_image" :name="pageAdmin.user.full_name"
              :avatar_color="pageAdmin.user.avatar_color" class="w-10 h-10 rounded-full" />

            <!-- 📝 Name & Username -->
            <div>
              <div class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                {{ pageAdmin.user.full_name }}
              </div>
              <div class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                @{{ pageAdmin.user.user_name }}
              </div>
            </div>
          </div>

          <!-- 📋 Role & Options -->
          <div class="flex items-center gap-3">
            <span class="text-xs font-medium px-2 py-1 rounded-full" :class="{
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200':
                pageAdmin.role === 'page:owner',
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                pageAdmin.role === 'page:admin',
            }">
              {{ pageAdmin.role === "page:owner" ? "Owner" : "Admin" }}
            </span>
            <HeadlessPopover v-if="pageAdmin.role == 'page:admin'" class="relative inline-block text-left">
              <HeadlessPopoverButton
                class="p-2 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition">
                <Icon name="mi:options-vertical" size="22" class="text-textPrimary-light dark:text-textPrimary-dark" />
              </HeadlessPopoverButton>

              <HeadlessPopoverPanel
                class="absolute right-0 mt-2 w-60 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50">
                <div class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark">
                  <!-- ❌ Remove admin -->
                  <button @click="selectPageAdminToRemove(pageAdmin)"
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark transition rounded-md">
                    <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                    Remove Admin
                  </button>
                </div>
              </HeadlessPopoverPanel>
            </HeadlessPopover>
          </div>
        </div>
      </li>
    </ul>
    <!-- No admins found -->
    <div v-else class="text-sm text-center text-textSecondary-light dark:text-textSecondary-dark mt-6">
      No admins found.
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  page: {
    type: Object,
    require: true,
  },
});

const pageAdmins = computed(() =>
  props.page?.page_admins?.filter((pageAdmin) =>
    pageAdmin.user?.full_name
      ?.toLowerCase()
      ?.includes(search.value.toLowerCase())
  )
);

const search = ref("");

const selectedAdmin = ref();

/**--------------------Add admin------------- */
const openAddAdminDialog = ref(false);

/**--------------------Remove Admin ------------- */
const openRemoveAdminDialog = ref(false);

const selectPageAdminToRemove = (pageAdmin) => {
  selectedAdmin.value = pageAdmin;
  openRemoveAdminDialog.value = true;
};
</script>
