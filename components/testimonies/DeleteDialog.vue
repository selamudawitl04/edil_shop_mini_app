<script setup>
import deleteTestimony from "@/graphql/testimonies/update.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
    testimony: {
        type: Object,
        required: true,
    },
    modelValue: Boolean,
});

const open = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

// GraphQL mutation
const { mutate, onDone, loading, onError } = mutator(deleteTestimony, {
    clientId: "auth",
});

// Mutation response handler
onDone(({ data }) => {
    const affected = data?.update_testimony_testimonies?.affected_rows;
    if (affected > 0) {
        window.location.reload();
    } else {
        toast.error("Failed to delete the testimony.", {
            position: "top-right",
        });
    }
    open.value = false;
});

onError((error) => {
    toast.error("An error occurred while deleting.", { position: "top-right" });
    open.value = false;
});

// Delete handler
const handleDelete = (confirmed) => {
    if (!confirmed) {
        open.value = false;
        return;
    }
    const input = {
        is_deleted: true,
    };
    mutate({
        input,
        id: props.testimony?.id,
    });
};
</script>

<template>
    <BaseConfirmation v-model="open" confirm-button="Delete"
        :description="`Are you sure you want to delete this testimony? This action cannot be undone.`"
        title="Delete Testimony" icon="uil:trash" icon-class="text-danger-light dark:text-danger-dark text-2xl"
        confirm-title="Deleted" confirm-msg="The testimony was deleted successfully."
        cancel-msg="Testimony deletion was canceled." @confirm="handleDelete" :loading="loading" />
</template>
