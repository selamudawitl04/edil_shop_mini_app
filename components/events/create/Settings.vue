<script setup>

const { handleSubmit } = useForm();


const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    }
});

const emit = defineEmits(["update:modelValue", "next"]);
const form = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});




const onSubmit = handleSubmit(async () => {
    emit("next");
});


</script>

<template>
    <!--  -->
    <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Group Settings -->
        <div
            class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4">
            <div class="mb-4">
                <h3 class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                    ⚙️ Group Settings & Permissions
                </h3>
                <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                    Configure how members can interact with your prayer group
                </p>
            </div>

            <div class="space-y-4">
                <!-- Left column: Private-only options -->
                <div v-if="form.visibility === 'private'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                        <label class="flex items-start space-x-3 cursor-pointer">
                            <input type="checkbox" v-model="form.settings.allowMembersToInvite"
                                class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                            <div>
                                <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                                    👥 Allow member invitations
                                </span>
                                <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                                    Let current members send invitations to others
                                </p>
                            </div>
                        </label>
                    </div>

                    <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                        <label class="flex items-start space-x-3 cursor-pointer">
                            <input type="checkbox" v-model="form.settings.autoApproveMembers"
                                class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                            <div>
                                <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                                    ✅ Auto-approve members
                                </span>
                                <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                                    Automatically approve join requests without admin review
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Right column: Shared options for all visibility types -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- ------------------Allow prayer request creation and sharing -->
                    <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                        <label class="flex items-start space-x-3 cursor-pointer">
                            <input type="checkbox" v-model="form.settings.allowMembersToCreatePrayerRequest"
                                class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                            <div>
                                <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                                    🙏 Allow prayer requests
                                </span>
                                <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                                    Members can create and share prayer requests directly to this group
                                </p>
                            </div>
                        </label>

                    </div>


                    <!-- -------------------Allow devotion -->

                    <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                        <label class="flex items-start space-x-3 cursor-pointer">
                            <input type="checkbox" v-model="form.settings.allowMembersToCreateDevotion"
                                class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                            <div>
                                <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                                    🛐 Allow devotions
                                </span>
                                <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                                    Members can create and share devotions directly to this group
                                </p>
                            </div>
                        </label>
                    </div>




                    <!-- ---------------------Allow testimonies creation and sharing        -->
                    <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                        <label class="flex items-start space-x-3 cursor-pointer">
                            <input type="checkbox" v-model="form.settings.allowMembersToCreateTestimony"
                                class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />

                            <div>
                                <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                                    Allow testimonies
                                </span>
                                <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                                    Members can create and share testimonies directly to this group
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>


        <div class="flex justify-between items-center w-full">

            <BaseButton variant="outline" :full="false" @click="emit('back')">
                ← Back
            </BaseButton>


            <!-- Submit -->
            <BaseButton @click="onSubmit" :full="false">
                <span class="text-white">Next →</span>
            </BaseButton>

        </div>

    </form>
</template>
