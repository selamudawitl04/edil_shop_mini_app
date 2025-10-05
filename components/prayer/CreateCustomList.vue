<template>
    <!-- ✨ Create Custom List Dialog -->
    <BaseDialog v-model="open" title="🏷️ Create New List" :autoClose="false">
        <template #content>
            <div class=" mx-auto">
                <div class="space-y-4">
                    <!-- Header -->
                    <div class="text-center mb-4">
                        <div
                            class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Icon name="mdi:format-list-bulleted" class="w-6 h-6 text-white" />
                        </div>
                        <h3 class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                            Create New Prayer List
                        </h3>
                        <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark mt-1">
                            Give your new prayer list a meaningful name
                        </p>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="onSubmit" class="space-y-4">
                        <!-- List Name Input -->
                        <div class="space-y-2">
                            <BaseInput id="name" name="name" label="List Name"
                                placeholder="e.g., Health Prayers, Family Prayers..." rules="required|min:2|max:50"
                                v-model="name" maxlength="50" />

                            <!-- Character Counter -->
                            <div class="flex justify-end text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                <span>{{ name.length }}/50</span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div
                            class="flex justify-end gap-3 pt-4 border-t border-borderColor-light dark:border-borderColor-dark">
                            <BaseButton type="button" variant="outline" @click="cancel"
                                :disabled="addPrayerListLoading">
                                Cancel
                            </BaseButton>
                            <BaseButton type="submit" :disabled="addPrayerListLoading"
                                class="bg-primary-light dark:bg-primary-dark text-white hover:opacity-90">
                                <div v-if="addPrayerListLoading" class="flex items-center space-x-2">
                                    <div
                                        class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                                    </div>
                                    <span>Creating...</span>
                                </div>
                                <div v-else class="flex items-center space-x-2">
                                    <Icon name="mdi:check" size="16" />
                                    <span>Create List</span>
                                </div>
                            </BaseButton>
                        </div>
                    </form>
                </div>
            </div>
        </template>
    </BaseDialog>
</template>

<script setup>
import addPrayerList from "~/graphql/prayers/add_prayer_list.gql";
import { useForm } from "vee-validate";
import { useToast } from "vue-toast-notification";

const toast = useToast();

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});


const emit = defineEmits(["update:modelValue", "list-created"]);

const open = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

// Form validation
const name = ref("");
const { handleSubmit } = useForm();

// Add prayer list mutation
const {
    mutate: addPrayerListMutate,
    loading: addPrayerListLoading,
    onDone: addPrayerListDone,
    onError: addPrayerListError
} = mutator(addPrayerList, {
    clientId: "auth",
    showToast: false,
});

// Handle form submission
const onSubmit = handleSubmit(() => {
    const input = {
        name: name.value.trim(),
        type: "custom"
    };
    addPrayerListMutate({ input });
});

// Handle successful creation
addPrayerListDone(({ data }) => {
    if (data?.insert_prayer_lists_one) {
        const newList = {
            id: data.insert_prayer_lists_one.id,
            name: data.insert_prayer_lists_one.name,
            prayer_count: 0,
            created_at: data.insert_prayer_lists_one.created_at,
        };
        emit("list-created", newList);
        open.value = false;
        name.value = "";
    }
});


const cancel = () => {
    name.value = "";
    open.value = false;
};

// Watch for dialog opening to reset form
watch(open, (newVal) => {
    if (!newVal) {
        name.value = "";
    }
});
</script>