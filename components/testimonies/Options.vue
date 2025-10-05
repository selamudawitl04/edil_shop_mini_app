<script setup>
import { useTestimonyStore } from "~/stores/testimony";

const testimonyStore = useTestimonyStore();
const user = useCookie("userData");

const props = defineProps({
    testimony: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["edit", "delete", "share"]);

const isOwner = computed(() => {
    return props.testimony.feed.created_by === user.value?.id;
});

const isGroupAdmin = computed(() => {
    if (!props.testimony.feed?.group) return false;
    return props.testimony.feed.group.group_members?.some(
        (member) => member.user_id === user.value?.id && member.role === "group:admin"
    );
});

const isPageAdmin = computed(() => {
    if (!props.testimony.feed?.page) return false;
    return props.testimony.feed.page.page_admins?.some(
        (admin) => admin.user_id === user.value?.id
    );
});


const canDelete = computed(() => {
    return isOwner.value || isGroupAdmin.value || isPageAdmin.value;
});



const openDeleteTestimonyDialog = ref(false);
const openUpdateTestimonyDialog = ref(false);
const openFeedVisibilityDialog = ref(false);
</script>

<template>

    <!-- -------------Dialogs -------------------- -->
    <TestimoniesDeleteDialog v-if="openDeleteTestimonyDialog" v-model="openDeleteTestimonyDialog" :testimony="testimony"
        @success="openDeleteTestimonyDialog = false" />

    <TestimoniesUpdateDialog v-if="openUpdateTestimonyDialog" v-model="openUpdateTestimonyDialog"
        @success="openUpdateTestimonyDialog = false" :testimony="testimony" />

    <FeedsChangeFeedVisibilityDialog v-if="openFeedVisibilityDialog" v-model="openFeedVisibilityDialog"
        :feed="testimony.feed" @success="openFeedVisibilityDialog = false" />

    <HeadlessPopover class="relative inline-block text-left">
        <HeadlessPopoverButton
            class="p-2 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition">
            <Icon name="mi:options-vertical" size="22" class="text-textPrimary-light dark:text-textPrimary-dark" />
        </HeadlessPopoverButton>

        <HeadlessPopoverPanel
            class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50">
            <div class="py-1">
                <button v-if="isOwner" @click.stop="openUpdateTestimonyDialog = true"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Icon name="ph:pencil" class="w-4 h-4" />
                    Edit Testimony
                </button>
                <button v-if="isOwner && testimony.feed?.group?.is_private"
                    @click.stop="openFeedVisibilityDialog = true"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Icon name="ph:eye" class="w-4 h-4" />
                    Change Visibility
                </button>

                <button v-if="canDelete" @click.stop="openDeleteTestimonyDialog = true"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <Icon name="ph:trash" class="w-4 h-4" />
                    Delete Testimony
                </button>

                <button @click.stop="onShare"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Icon name="ph:share" class="w-4 h-4" />
                    Share Testimony
                </button>

            </div>
        </HeadlessPopoverPanel>
    </HeadlessPopover>
</template>