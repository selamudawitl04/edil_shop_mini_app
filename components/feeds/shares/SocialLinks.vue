<script setup>
import { useClipboard } from "@vueuse/core";
import { Icon } from "@iconify/vue";

const props = defineProps({
    pageUrl: {
        type: String,
        required: true,
    },
    shareText: {
        type: String,
        required: true,
    },
    emailSubject: {
        type: String,
        required: true,
    },
    emailBody: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['engagement']);

const { copy, copied } = useClipboard();

const handleEngagement = () => {
    emit('engagement');
};

const copyToClipboard = () => {
    copy(props.pageUrl);
    handleEngagement();
};

const responseMessage = computed(() => copied.value ? "Copied!" : "");

// Scroll state management
const scrollContainer = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const checkScrollState = () => {
    if (scrollContainer.value) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
        canScrollLeft.value = scrollLeft > 0;
        canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1; // -1 for rounding errors
    }
};

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

// Watch for scroll events
onMounted(() => {
    if (scrollContainer.value) {
        scrollContainer.value.addEventListener('scroll', checkScrollState);
        // Check initial state
        nextTick(() => {
            checkScrollState();
        });
    }
});

onUnmounted(() => {
    if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', checkScrollState);
    }
});
</script>

<template>
    <div class="relative">
        <!-- Carousel Navigation Buttons -->
        <button v-if="canScrollLeft" @click="scrollLeft"
            class="sm:hidden absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10">
            <Icon icon="material-symbols:chevron-left" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <button v-if="canScrollRight" @click="scrollRight"
            class="sm:hidden absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10">
            <Icon icon="material-symbols:chevron-right" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <div class="overflow-x-auto overflow-y-hidden py-4 hide-scrollbar" ref="scrollContainer">
            <div class="flex gap-5 w-max px-4">
                <!-- Copy Link Button (Vibrant Gradient) -->
                <button @click="copyToClipboard"
                    class="group w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 dark:from-purple-500 dark:to-orange-500 dark:hover:from-purple-600 dark:hover:to-orange-600 flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                    <Icon icon="material-symbols:link" class="w-9 h-9 text-white" />
                </button>

                <!-- WhatsApp -->
                <a @click="handleEngagement" :href="`https://api.whatsapp.com/send?text=${shareText}%20${pageUrl}`"
                    target="_blank"
                    class="group w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                    <Icon icon="logos:whatsapp-icon" class="w-9 h-9 text-white" />
                </a>

                <!-- Telegram -->
                <a @click="handleEngagement" :href="`https://t.me/share/url?url=${pageUrl}&text=${shareText}`"
                    target="_blank"
                    class="group w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                    <Icon icon="logos:telegram" class="w-9 h-9 text-white" />
                </a>

                <!-- Facebook -->
                <a @click="handleEngagement" :href="`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`"
                    target="_blank"
                    class="group w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 flex items-center justify-center transition transform duration-300 cursor-pointer shadow-xl hover:scale-110 flex-shrink-0">
                    <Icon icon="logos:facebook" class="w-9 h-9 text-white" />
                </a>

                <!-- Twitter / X -->
                <a @click="handleEngagement" :href="`https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`"
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

        <!-- Copy Feedback -->
        <div v-if="responseMessage" class="text-center mt-4">
            <p class="text-sm text-primary-light dark:text-primary-dark font-medium">
                {{ responseMessage }}
            </p>
        </div>
    </div>
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