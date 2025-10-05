<script setup>
import { useDevotionStore } from "@/stores/devotion";


const props = defineProps({
    devotion: {
        type: Object,
        required: true,
    },
})

const user = useCookie("userData");
const openUpdateDialog = ref(false);
const openDeleteDialog = ref(false);
const openReportDialog = ref(false);
const openChangeVisibilityDialog = ref(false);




const userRole = computed(() => {
    if (props.devotion?.feed?.group) {
        if (props.devotion?.feed?.group?.group_members?.length && props.devotion?.feed?.group?.group_members[0].status === "approved") {
            return props.devotion?.feed?.group?.group_members[0].role;
        } else {
            return null;
        }
    } else if (props.devotion?.feed?.page) {
        if (props.devotion?.feed?.page?.page_admins?.length) {
            return props.devotion?.feed?.page?.page_admins[0].role;
        } else {
            return null;
        }
    } else {
        return null;
    }
});



const canDeleteDevotion = computed(() => {
    const isCreatorAndMember = user.value.id === props.devotion?.feed?.created_by && userRole.value === "group:member";
    const isGroupAdminOrOwner = ["group:admin", "group:owner"].includes(userRole.value);
    const isPageAdminOrOwner = ["page:admin", "page:owner"].includes(userRole.value);
    return isCreatorAndMember || isGroupAdminOrOwner || isPageAdminOrOwner;
})


const isAllowedToUpdate = computed(() => {
    return user.value.id === props.devotion?.feed?.created_by
});

</script>

<template>
    <!-- Update Dialog -->
    <DevotionsUpdateDialog v-if="isAllowedToUpdate && openUpdateDialog" v-model="openUpdateDialog" :devotion="devotion"
        :role="userRole" />

    <!-- Delete Dialog -->
    <DevotionsDeleteDialog v-if="canDeleteDevotion && openDeleteDialog" v-model="openDeleteDialog" :devotion="devotion"
        :role="userRole" />

    <!-- Change Visibility Dialog -->
    <FeedsChangeFeedVisibilityDialog v-if="isAllowedToUpdate && openChangeVisibilityDialog"
        v-model="openChangeVisibilityDialog" :feed="devotion.feed" />

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
                        Edit Devotion
                    </button>
                </template>

                <!-- Change visibility -->
                <template v-if="isAllowedToUpdate">
                    <button @click.stop="openChangeVisibilityDialog = true"
                        class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md">
                        <Icon name="mdi:eye-outline" class="w-4 h-4" />
                        Change Visibility
                    </button>
                </template>

                <!-- Delete -->
                <template v-if="canDeleteDevotion">
                    <button @click.stop="openDeleteDialog = true"
                        class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md">
                        <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                        Delete Devotion
                    </button>
                </template>

                <!-- Report Devotion -->
                <button @click.stop="openReportDialog = true"
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md">
                    <Icon name="mdi:alert-outline" class="w-4 h-4" />
                    Report Devotion
                </button>
            </div>
        </HeadlessPopoverPanel>
    </HeadlessPopover>
</template>