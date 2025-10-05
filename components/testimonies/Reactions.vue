<template>
    <FeedsReactions :feed="testimony.feed" :useReaction="useReaction" :totalReactions="totalReactions"
        :reactionTypes="testimonyReactions" />
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
    testimony: {
        type: Object,
        required: true,
    },
})


const { testimonyReactions } = useReactionTypes()
</script>
