<template>


    <HeadlessPopover v-slot="{ open, close }" class="relative inline-block text-left">
        <!-- Trigger -->
        <HeadlessPopoverButton class="focus:outline-none">
            <button
                class="text-primary-light dark:text-primary-dark hover:underline flex flex-col items-center gap-1 focus:outline-none">
                <div class="flex items-center gap-1">
                    <span class="text-base">
                        {{useReaction ? reactions.find(r => r.name === useReaction.reaction_type)?.iconText || "🤍" :
                            "🤍"}}
                    </span>
                    <span class="text-xs">({{ totalReactions || 0 }})</span>
                </div>
                <span class="text-xs capitalize">
                    {{ useReaction ? useReaction.reaction_type : "React" }}
                </span>
            </button>
        </HeadlessPopoverButton>
        <HeadlessPopoverPanel class="absolute bottom-full left-0 mb-2 z-50 bg-white dark:bg-card-dark rounded-2xl shadow-lg ring-1 ring-black/5 border border-borderColor-light dark:border-borderColor-dark
         w-56  overflow-hidden">
            <div class="px-2 py-2">
                <!-- 2-col grid -->
                <div class="grid grid-cols-2 gap-x-2 gap-y-2">
                    <button v-for="reaction in reactions" :key="reaction.name" @click.stop="onChoose(reaction, close)"
                        class="w-full group relative flex items-center gap-2 px-2.5 py-1.5 rounded-md transition
               hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 focus:outline-none" :class="useReaction?.reaction_type === reaction.name
                ? 'bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light dark:border-primary-dark'
                : 'border border-transparent'">
                        <!-- Emoji -->
                        <span class="text-lg leading-none" :class="useReaction?.reaction_type === reaction.name
                            ? 'scale-110 text-primary-light dark:text-primary-dark'
                            : ''">
                            {{ reaction.iconText }}
                        </span>

                        <!-- Label -->
                        <span class="text-xs capitalize whitespace-nowrap" :class="useReaction?.reaction_type === reaction.name
                            ? 'font-semibold text-primary-light dark:text-primary-dark'
                            : 'text-textPrimary-light dark:text-textPrimary-dark'">
                            {{ reaction.name }}
                        </span>
                    </button>
                </div>
            </div>
        </HeadlessPopoverPanel>


    </HeadlessPopover>
</template>

<script setup>


import reactMutation from '@/graphql/feeds/react.gql'
import unreactMutation from '@/graphql/feeds/unreact.gql'

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
    feed: {
        type: Object,
        required: true,
    },
    reactionTypes: {
        type: Array,
        required: true,
        default: () => [
            { name: 'love', iconText: '❤️' },
            { name: 'amen', iconText: '🙏' },
            { name: 'blessed', iconText: '✨' },
            { name: 'prayed', iconText: '🛐' },
        ]
    }
})

const emit = defineEmits(['react', 'unreact'])

// Use the reaction types from props
const reactions = computed(() => props.reactionTypes)

const { mutate: reactFeed, onDone: onReactDone } = mutator(reactMutation, {
    clientId: "auth"
})
const { mutate: unreactFeed, onDone: onUnreactDone } = mutator(unreactMutation, {
    clientId: "auth"
})

onReactDone(({ data }) => {
    if (data.insert_feed_reactions_one) {
        if (props.useReaction) {
            props.feed.feed_reactions[0].reaction_type = data.insert_feed_reactions_one.reaction_type;

        } else {
            props.feed.feed_reactions.push(data.insert_feed_reactions_one);
            props.feed.reaction_count++;
        }
    }
})
onUnreactDone(({ data }) => {
    if (data.delete_feed_reactions_by_pk) {
        props.feed.feed_reactions = [];
        props.feed.reaction_count--;
    }
})

/**
 * Handle choosing a reaction.
* - If clicking the same reaction again: emit "unreact" and clear.
 * - If choosing a different one: emit "react" with the reaction name.
 */
const onChoose = (reaction, close) => {
    if (props.useReaction?.reaction_type === reaction.name) {
        unreactFeed({ id: props.useReaction.id })
    } else {
        const input = {
            feed_id: props.feed.id,
            reaction_type: reaction.name,
        }
        reactFeed({ input })
    }
    // Close the popover after selection (like FB)
    close?.()
}

</script>
