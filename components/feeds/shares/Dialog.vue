<script setup>
import { useClipboard } from "@vueuse/core";
import { useShareStore } from "@/stores/share";
import getUserGroups from "@/graphql/groups/get_members.gql";
import getPageAdmins from "@/graphql/pages/get_admins.gql";

const emit = defineEmits(["update:modelValue"]);

import { Icon } from "@iconify/vue";



const props = defineProps({

    item: {
        type: Object,
        required: true,
    },

    modelValue: {
        type: Boolean,
        required: true,
    },

});


const open = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});


const user = useCookie("userData");

const { copy } = useClipboard();
const pageUrl = computed(() => {
    return `${window.location.origin}/prayer-requests/${props.item.id}`;
});

const shareText = computed(() => {
    if (props.item?.feed?.type === "prayer_request") {
        return `Please pray for this request: ${props.item?.title}`;
    }
    if (props.item?.feed?.type === "devotion") {
        return `Please read this devotion: ${props.item?.title}`;
    }
    if (props.item?.feed?.type === "event") {
        return `Please join us for this event: ${props.item?.title}`;
    }
    if (props.item?.feed?.type === "testimony") {
        return `Please read this testimony: ${props.item?.title}`;
    }

    return `Please read this article: ${props.item?.title}`;
});

const emailSubject = computed(() => {
    const type = props.item?.feed?.type;
    const title = props.item?.title;

    let subject;

    switch (type) {
        case "prayer":
            subject = `Prayer: ${title || "🙏 A Prayer"}`;
            break;
        case "prayer_request":
            subject = `Prayer Request: ${title || "🙏 A Prayer Request"}`;
            break;
        case "devotion":
            subject = `Devotion: ${title || "🙏 A Devotion"}`;
            break;
        case "event":
            subject = `Event: ${title || "🙏 An Event"}`;
            break;
        case "testimony":
            subject = `Testimony: ${title || "🙏 A Testimony"}`;
            break;
        default:
            subject = `Article: ${title || "🙏 An Article"}`;
    }

    return encodeURIComponent(subject);
});


const emailBody = computed(() => {
    const plainText = `${props.item?.description || "Please join in prayer."
        }\n\n${pageUrl.value}`;
    return encodeURIComponent(plainText);
});


const openShareInGroupDialog = ref(false);
const openShareOnPageDialog = ref(false);


const handleEngagement = () => {
    updatePrayerRequestEngagement(props.item.id);

    open.value = false;
};

const copyToClipboard = () => {
    copy(pageUrl.value);
    handleEngagement();
};

// Scroll functions for mobile navigation
const scrollContainer = ref(null);

const scrollLeft = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollBy({ left: -200, behavior: 'smooth' });
    }
};

const scrollRight = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollBy({ left: 200, behavior: 'smooth' });
    }
};

const handleFeedShared = () => {
    openShareInGroupDialog.value = false;
    openShareOnPageDialog.value = false;
    open.value = false;
};


// Fetch user groups

const groups = ref([]);
// Filter for user groups include search
const filter = computed(() => {
    let query = {
        user_id: {
            _eq: user.value.id,
        },
        status: {
            _eq: "approved",
        },
    };
    return query;
});

const groupFetchEnabled = computed(() => {
    return !!user.value;
});


const groupLimit = ref(10);
const { onResult } = queryList(getUserGroups, {
    clientId: "auth",
    filter: filter,
    limit: groupLimit,
    enabled: groupFetchEnabled,
});

const checkCreateFeedPermission = (group, type) => {

    if (type === "prayer_request") {
        return group.allow_members_to_create_request
    }

    else if (type === "devotion") {
        return group.allow_members_to_create_devotion
    }

    else if (type === "testimony") {

        return group.allow_members_to_create_testimony
    }
    return false;
}

onResult(({ data }) => {
    if (data.group_members) {
        groups.value = data.group_members;
        // Remove current group
        // Filter groups where use
        groups.value = groups.value.filter(group => group.id !== props.feed?.group_id);
        groups.value = groups.value.filter(group => {
            // Check if user is a group member and has permission to create feed
            const isGroupMemberAndAllowCreate = group.role == 'group:member' && checkCreateFeedPermission(group.group, props.feed?.type);
            const isGroupAdminOrOwner = group.role == 'group:admin' || group.role == 'group:owner';
            return isGroupMemberAndAllowCreate || isGroupAdminOrOwner;
        });
    }
});

// Fetch user pages

const pageFilter = computed(() => {
    let query = {
        user_id: {
            _eq: user.value.id,
        },
        page: {
            status: {
                _eq: "active",
            },
            deleted_at: {
                _is_null: true,
            },
        },
    };
    return query;
});

const pageLimit = ref(10);

const pageFetchEnabled = computed(() => {
    return !!user.value
});
const pages = ref([]);
const { onResult: onResultPages } = queryList(getPageAdmins, {
    clientId: "auth",
    filter: pageFilter,
    limit: pageLimit,
    enabled: pageFetchEnabled,
});

onResultPages(({ data }) => {
    if (data.page_admins) {
        pages.value = data.page_admins;
    }
});



</script>

<template>


    <!-- Main Share Dialog -->
    <BaseDialog v-model="open" :auto-close="false" :title="`Share ${props.item?.feed?.type?.replace('_', ' ')}`"
        body-class="max-w-xl">
        <template #content>
            <div class=" dark:bg-secondary-dark-2 w-full ">

                <!-- Header Section -->
                <div class="text-center mb-8">
                    <div
                        class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-light to-primary-dark dark:from-primary-dark dark:to-primary-light rounded-full flex items-center justify-center">
                        <Icon icon="material-symbols:share" class="w-8 h-8 text-white" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Share this {{ props.item?.feed?.type?.replace('_', ' ') }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Choose how you'd like to share this content
                    </p>
                </div>



                <FeedsSharesSocialLinks :pageUrl="pageUrl" :shareText="shareText" :emailSubject="emailSubject"
                    :emailBody="emailBody" @engagement="handleEngagement" />


                <!-- Social Share Options: Single Scrollable Row -->
                <div v-if="false" class="relative">
                    <!-- Carousel Navigation Buttons -->
                    <button @click="scrollLeft"
                        class="sm:hidden absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10">
                        <Icon icon="material-symbols:chevron-left" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>

                    <button @click="scrollRight"
                        class="sm:hidden absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10">
                        <Icon icon="material-symbols:chevron-right" class="w-6 h-6 text-gray-600 dark:text-gray-300" />

                    </button>

                    <div class="overflow-x-auto overflow-y-hidden py-4  hide-scrollbar" ref="scrollContainer">
                        <div class="flex gap-6 w-max px-4">
                            <!-- Copy Link Button (Vibrant Gradient) -->
                            <button @click="copyToClipboard"
                                class="group w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 dark:from-purple-500 dark:to-orange-500 dark:hover:from-purple-600 dark:hover:to-orange-600 flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                                <Icon icon="material-symbols:link" class="w-9 h-9 text-white" />
                            </button>

                            <!-- WhatsApp -->
                            <a @click="handleEngagement"
                                :href="`https://api.whatsapp.com/send?text=${shareText}%20${pageUrl}`" target="_blank"
                                class="group w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                                <Icon icon="logos:whatsapp-icon" class="w-9 h-9 text-white" />
                            </a>

                            <!-- Telegram -->
                            <a @click="handleEngagement"
                                :href="`https://t.me/share/url?url=${pageUrl}&text=${shareText}`" target="_blank"
                                class="group w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                                <Icon icon="logos:telegram" class="w-9 h-9 text-white" />
                            </a>

                            <!-- Facebook -->
                            <a @click="handleEngagement"
                                :href="`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`" target="_blank"
                                class="group w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                                <Icon icon="logos:facebook" class="w-9 h-9 text-white" />
                            </a>

                            <!-- Twitter / X -->
                            <a @click="handleEngagement"
                                :href="`https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`"
                                target="_blank"
                                class="group w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                                <Icon icon="akar-icons:x-fill" class="w-9 h-9 text-white" />
                            </a>

                            <!-- Email -->
                            <a @click="handleEngagement" :href="`mailto:?subject=${emailSubject}&body=${emailBody}`"
                                class="group w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                                <Icon icon="ic:baseline-email" class="w-9 h-9 text-white" />
                            </a>
                        </div>
                    </div>
                </div>


                <!-- Additional Share Options (for authenticated users) -->
                <div v-if="user && item.feed.visibility === 'public'" class="space-y-4">
                    <!-- Share with Group -->
                    <button v-if="groups.length > 0" @click="openShareInGroupDialog = true"
                        class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-200">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Icon icon="material-symbols:group" class="w-5 h-5 text-white" />
                            </div>
                            <div class="text-left">
                                <h4 class="font-medium text-gray-900 dark:text-white">Share with a Group</h4>
                                <p class="text-xs text-gray-600 dark:text-gray-400">Share in your community groups</p>
                            </div>
                        </div>
                        <Icon icon="material-symbols:arrow-forward-ios" class="w-4 h-4 text-gray-400" />
                    </button>

                    <!-- Share on Page -->
                    <button v-if="pages.length > 0" @click="openShareOnPageDialog = true"
                        class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 transition-all duration-200">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <Icon icon="material-symbols:article" class="w-5 h-5 text-white" />
                            </div>
                            <div class="text-left">
                                <h4 class="font-medium text-gray-900 dark:text-white">Share on Page</h4>
                                <p class="text-xs text-gray-600 dark:text-gray-400">Post to your community page</p>
                            </div>
                        </div>
                        <Icon icon="material-symbols:arrow-forward-ios" class="w-4 h-4 text-gray-400" />
                    </button>
                </div>

            </div>
        </template>
    </BaseDialog>

    <!-- Share in Group Dialog -->
    <FeedsSharesShareInGroupDialog v-model="openShareInGroupDialog" v-if="openShareInGroupDialog" :item="item"
        @feedShared="handleFeedShared" />

    <!-- Share on Page Dialog -->
    <FeedsSharesShareOnPageDialog v-model="openShareOnPageDialog" v-if="openShareOnPageDialog" :item="item"
        @feedShared="handleFeedShared" />
</template>

<style scoped>
/* Custom animations and styles */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* Smooth transitions for all interactive elements */
* {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
