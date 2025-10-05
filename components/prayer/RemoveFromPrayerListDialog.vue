<template>
    <!-- ❌ Remove From Prayer List Confirmation Dialog -->
    <BaseConfirmation v-model="open" confirm-button="Remove From Prayer List"
        :description="`Are you sure you want to remove this prayer request from your prayer list?`"
        title="Remove From Prayer List" icon="mdi:account-remove-outline"
        icon-class="text-danger-light dark:text-danger-dark text-2xl" confirm-title="Prayer Request Removed"
        confirm-msg="The prayer request has been successfully removed."
        cancel-msg="The prayer request is still in your prayer list." @confirm="handleRemove" :loading="loading" />
</template>

<script setup>
import deletePrayerListItemMutation from "@/graphql/prayers/delete_prayer_list_item.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
    modelValue: Boolean,
    prayerListItem: {
        type: Object,
        required: true,
    },
});

const refetchPrayerListItems = inject("refetchPrayerListItems");

const open = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const { mutate, onDone, loading } = mutator(deletePrayerListItemMutation, {
    clientId: "auth",
});

const handleRemove = (confirmed) => {
    if (confirmed) {
        mutate({ id: props.prayerListItem.id });
    } else {
        open.value = false;
    }
};
onDone(({ data }) => {
    if (data?.delete_prayer_list_items_by_pk) {
        toast.success("✅ Prayer list item removed successfully.", {
            position: "top-right",
        });
        if (typeof refetchPrayerListItems === "function") refetchPrayerListItems();
        open.value = false;
    } else {
        toast.error("❌ Failed to remove the prayer list item.", {
            position: "top-right",
        });
    }
});
</script>
