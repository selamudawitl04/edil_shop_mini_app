<template>
    <HeadlessPopover class="relative inline-block text-left">
        <HeadlessPopoverButton
            class="p-2 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition">
            <Icon name="mi:options-vertical" size="22" class="text-textPrimary-light dark:text-textPrimary-dark" />
        </HeadlessPopoverButton>

        <HeadlessPopoverPanel
            class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50">
            <div class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark">
                <!-- Update -->
                <template v-if="isAllowedToUpdate">
                    <button @click.stop="openUpdateDialog = true"
                        class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md">
                        <Icon name="mdi:file-edit-outline" class="w-4 h-4" />
                        Edit Series
                    </button>
                </template>

                <!-- -----------Change visibility -->
                <template v-if="isAllowedToUpdate">
                    <button @click.stop="openChangeVisibilityDialog = true"
                        class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md">
                        <Icon name="mdi:eye-outline" class="w-4 h-4" />
                        Change Visibility
                    </button>
                </template>

                <!-- Delete -->
                <template v-if="isAllowedToDelete">
                    <button @click.stop="openDeleteDialog = true"
                        class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md">
                        <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                        Delete Series
                    </button>
                </template>



                <!-- Report -->
                <button @click.stop="openReportDialog = true"
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md">
                    <Icon name="mdi:alert-outline" class="w-4 h-4" />
                    Report Series
                </button>
            </div>
        </HeadlessPopoverPanel>
    </HeadlessPopover>

    <!-- Update Dialog -->
    <DevotionsSeriesUpdateDialog v-if="isAllowedToUpdate && openUpdateDialog" v-model="openUpdateDialog"
        :series="series" :role="role" />

    <!-- Delete Dialog -->
    <DevotionsSeriesDeleteDialog v-if="isAllowedToDelete && openDeleteDialog" v-model="openDeleteDialog"
        :series="series" :role="role" />

    <!-- Change Visibility Dialog -->
    <FeedsChangeFeedVisibilityDialog v-if="isAllowedToUpdate && openChangeVisibilityDialog"
        v-model="openChangeVisibilityDialog" :feed="series.feed" />
</template>

<script setup>
const user = useCookie("userData");

const props = defineProps({
    series: {
        type: Object,
        required: true
    },
    role: {
        type: String,
        default: null
    }
});

const emits = defineEmits(['update', 'delete', 'report']);
const openUpdateDialog = ref(false);
const openDeleteDialog = ref(false);
const openReportDialog = ref(false);
const openChangeVisibilityDialog = ref(false);

const userRole = computed(() => {
    if (props.series?.feed?.group) {
        if (props.series?.feed?.group?.group_members?.length && props.series?.feed?.group?.group_members[0].status === "approved") {
            return props.series?.feed?.group?.group_members[0].role;
        } else {
            return null;
        }
    } else {
        if (props.series?.feed?.page?.page_admins?.length) {
            return props.series?.feed?.page?.page_admins[0].role;
        } else {
            return null;
        }
    }
});

const isAllowedToUpdate = computed(() => {
    return user.value.id === props.series?.feed?.created_by;
});

const isAllowedToDelete = computed(() => {
    const isCreatorAndMember = user.value.id === props.series?.feed?.created_by && userRole.value === "group:member";
    const isGroupAdminOrOwner = ["group:admin", "group:owner"].includes(userRole.value);
    const isPageAdminOrOwner = ["page:admin", "page:owner"].includes(userRole.value);
    return isCreatorAndMember || isGroupAdminOrOwner || isPageAdminOrOwner;
});


</script>