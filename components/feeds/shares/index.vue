<script setup>


const props = defineProps({

    item: {
        type: Object,
        required: true,
    },
});

const openShareDialog = ref(false)


</script>

<template>

    <FeedsSharesDialog v-model="openShareDialog" :item="item" v-if="openShareDialog" />
    <!-- Share Button -->

    <button @click.stop="openShareDialog = true"
        class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1">
        <div class="flex items-center gap-1">
            <span class="text-base">🔗</span>
            <span class="text-xs">({{ item?.feed?.share_count || 0 }})</span>
        </div>
        <span class="text-xs">Shares</span>
    </button>


</template>
