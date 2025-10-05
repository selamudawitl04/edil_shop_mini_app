<template>
    <FeedsReactions :feed="prayerRequest.feed" :useReaction="useReaction" :totalReactions="totalReactions"
        :reactionTypes="prayerRequestReactions" />
</template>

<script setup>
import { useReactionTypes } from '@/composables/reactionTypes'

const props = defineProps({
    useReaction: {
        type: Object, // current user's reaction (or null/undefined)
        required: false,
        default: null,
    },
    totalReactions: {
        type: Number,
        required: true,
    },
    prayerRequest: {
        type: Object,
        required: true,
    },
})

const { prayerRequestReactions } = useReactionTypes()
</script>
