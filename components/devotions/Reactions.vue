<template>
    <FeedsReactions :feed="devotion.feed" :useReaction="useReaction" :totalReactions="totalReactions"
        :reactionTypes="devotionReactions" />
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
    devotion: {
        type: Object,
        required: true,
    },
})


const { devotionReactions } = useReactionTypes()
</script>
