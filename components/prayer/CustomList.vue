<template>



    <div class=" space-y-3">

        <div>
            <!-- Lists -->
            <div v-if="customPrayerLists?.length" class="grid grid-cols-2 gap-2">

                <div v-for="list in customPrayerLists" :key="list.id" @click.stop="emit('list-selected', list)"
                    class="cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:border-primary-light dark:hover:border-primary-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-all"
                    :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10': selectedList?.id === list.id }">
                    <div class="flex items-start gap-3">
                        <!-- List Icon -->
                        <div class="hidden  md:block flex-shrink-0">
                            <div
                                class="w-12 h-12 rounded-lg bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center">
                                <Icon name="mdi:format-list-bulleted" size="24"
                                    class="text-primary-light dark:text-primary-dark" />
                            </div>
                        </div>

                        <!-- List Info -->
                        <div class="flex-1 min-w-0">
                            <h4 class="font-medium text-sm text-textPrimary-light dark:text-textPrimary-dark truncate">
                                {{ list.name }}
                            </h4>

                            <div class="flex items-center gap-2">
                                <span class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                    {{ list.prayer_list_items_aggregate?.aggregate?.count || 0 }} prayers
                                </span>
                                <span
                                    class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                    Custom
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8 text-textSecondary-light dark:text-textSecondary-dark">
                <Icon name="mdi:format-list-bulleted" size="48" class="mx-auto mb-2 opacity-50" />
                <p class="text-sm">No custom lists found</p>
                <button @click.stop="openCreateListDialog = true"
                    class="mt-2 text-primary-light dark:text-primary-dark hover:underline text-sm">
                    Create new prayer list
                </button>
            </div>


        </div>


        <button @click.stop="openCreateListDialog = true"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition">
            <Icon name="mdi:plus" size="16" class="mr-1" />
            New List
        </button>

        <!-- Create Custom List Dialog -->
        <PrayerCreateCustomList v-if="openCreateListDialog" v-model="openCreateListDialog"
            @list-created="onListCreated" />

    </div>



    <!-- ✨ Custom List Selection Dialog -->
    <BaseDialog v-if="false" v-model="open" title="🏷️ Select Custom List" :auto-close="false">
        <template #content>
            <div class="max-w-2xl mx-auto">
                <div class="space-y-4">
                    <!-- Header -->
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                            Choose a Custom List
                        </h3>


                        <button @click="openCreateListDialog = true"
                            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition">
                            <Icon name="mdi:plus" size="16" class="mr-1" />
                            New List
                        </button>
                    </div>





                    <!-- Custom Lists -->
                    <div v-if="customPrayerLists?.length" class="space-y-3 max-h-64 overflow-y-auto">
                        <div v-for="list in customPrayerLists" :key="list.id" @click="selectList(list)"
                            class="cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:border-primary-light dark:hover:border-primary-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-all"
                            :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10': selectedList?.id === list.id }">
                            <div class="flex items-start gap-3">
                                <!-- List Icon -->
                                <div class="flex-shrink-0">
                                    <div
                                        class="w-12 h-12 rounded-lg bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center">
                                        <Icon name="mdi:format-list-bulleted" size="24"
                                            class="text-primary-light dark:text-primary-dark" />
                                    </div>
                                </div>

                                <!-- List Info -->
                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="font-medium text-sm text-textPrimary-light dark:text-textPrimary-dark truncate">
                                        {{ list.name }}
                                    </h4>

                                    <div class="flex items-center gap-2">
                                        <span class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                            {{ list.prayer_list_items_aggregate?.aggregate?.count || 0 }} prayers
                                        </span>
                                        <span
                                            class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                            Custom
                                        </span>
                                    </div>
                                </div>

                                <!-- Selection Indicator -->
                                <div v-if="selectedList?.id === list.id" class="flex-shrink-0">
                                    <Icon name="mdi:check-circle" size="20"
                                        class="text-primary-light dark:text-primary-dark" />
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- Empty State -->
                    <div v-else class="text-center py-8 text-textSecondary-light dark:text-textSecondary-dark">
                        <Icon name="mdi:format-list-bulleted" size="48" class="mx-auto mb-2 opacity-50" />
                        <p class="text-sm">No custom lists found</p>
                        <button @click="openCreateListDialog = true"
                            class="mt-2 text-primary-light dark:text-primary-dark hover:underline text-sm">
                            Create new prayer list
                        </button>
                    </div>

                    <!-- Action Buttons -->
                    <div
                        class="flex justify-end gap-3 pt-4 border-t border-borderColor-light dark:border-borderColor-dark">
                        <BaseButton variant="outline" @click="cancelSelection">
                            Cancel
                        </BaseButton>
                        <BaseButton :disabled="!selectedList" @click="confirmSelection"
                            class="bg-primary-light dark:bg-primary-dark text-white hover:opacity-90">
                            Select List
                        </BaseButton>
                    </div>
                </div>


            </div>
        </template>
    </BaseDialog>
</template>

<script setup>


const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    selectedListValue: {
        type: Object,
        default: null,
    },
    customPrayerLists: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(["update:modelValue", "list-selected"]);

const open = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const search = ref("");
const openCreateListDialog = ref(false);
const selectedList = ref(props.selectedListValue);
const loading = ref(false);




const selectList = (list) => {
    selectedList.value = list;
};

const confirmSelection = () => {
    if (selectedList.value) {
        emit("list-selected", selectedList.value);
        open.value = false;
    }
};

const cancelSelection = () => {
    open.value = false;
};

const onListCreated = (newList) => {
    // Add the new list to the existing lists
    emit("list-selected", newList)
    selectedList.value = newList;
    openCreateListDialog.value = false;
    open.value
};

// Watch for dialog opening to refresh data
watch(open, (newVal) => {
    if (newVal) {
        // Refresh data when dialog opens
        // This is where you would call your API to get updated lists
    }
});
</script>