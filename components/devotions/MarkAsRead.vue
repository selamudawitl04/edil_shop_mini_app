<script setup>

import markAsReadQuery from "@/graphql/devotions/mark_as_read.gql";


const { mutate, onDone } = mutator(markAsReadQuery, {
    clientId: "auth"
})



const props = defineProps({
    devotion: {
        type: Object,
        required: true,
    },
})


const userRead = computed(() => {
    return props.devotion?.reads?.length > 0 ? true : false;
});


const onRead = () => {
    if (userRead.value) {
        return;
    }
    mutate({
        input: {
            devotion_id: props.devotion.id,
        },
    });
}

onDone(({ data }) => {
    if (data.insert_devotion_reads_one?.devotion_id) {


        props.devotion.reads.push(data.insert_devotion_reads_one);
    }

})


</script>
<template>
    <div>
        <button :disabled="userRead" @click.stop="onRead" :class="[
            'text-sm font-medium px-2 py-[2px] rounded-md text-white hover:opacity-90',
            userRead
                ? 'bg-green-500 dark:bg-green-600 cursor-not-allowed'
                : 'bg-primary-light dark:bg-primary-dark',
        ]">
            {{ userRead ? "✅ Read" : "📖 Mark as Read" }}
        </button>
    </div>
</template>