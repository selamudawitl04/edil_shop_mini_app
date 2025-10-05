<script setup>
import updateTestimony from "@/graphql/testimonies/update.gql";
import { useToast } from "vue-toast-notification";
import { useForm } from "vee-validate";

const props = defineProps({
    modelValue: Boolean,
    testimony: {
        type: Object,
        required: true,
    },
});

const toast = useToast();
const { handleSubmit } = useForm();

const emit = defineEmits(["update:modelValue", "success"]);

const open = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const title = ref("");
const content = ref("");
const visibility = ref("public");
const coverImage = ref("");

// Initialize form with existing testimony data
watch(() => props.testimony, (newTestimony) => {
    if (newTestimony) {
        title.value = newTestimony.title || "";
        content.value = newTestimony.content || "";
        visibility.value = newTestimony.feed?.visibility || "public";
        coverImage.value = newTestimony.cover_image || "";
    }
}, { immediate: true });

const { mutate, onDone, loading } = mutator(updateTestimony, {
    clientId: "auth",
});

const onSubmit = handleSubmit(() => {
    const input = {
        title: title.value,
        content: content.value,
        cover_image: coverImage.value || null,
    };

    mutate({
        id: props.testimony.id,
        input
    });
});

onDone(({ data }) => {
    if (data?.update_testimony_testimonies) {

        props.testimony.title = title.value;
        props.testimony.content = content.value;
        props.testimony.cover_image = coverImage.value;

        toast.success("Testimony updated successfully!", {
            position: "top-right",
        });
        open.value = false;
        emit("success");
    } else {
        toast.error("Failed to update testimony. Please try again.");
    }
});

const onClose = () => {
    open.value = false;
};
</script>

<template>
    <BaseDialog v-model="open" title="Edit Testimony" @close="onClose">
        <template #content>
            <form @submit.prevent="onSubmit" class="space-y-6">




                <!-- Title -->

                <div>
                    <BaseInput id="title" name="title" label="Title" v-model="title"
                        placeholder="Give your testimony a meaningful title" rules="required" />
                </div>


                <!-- Content -->
                <BaseTextEditor id="content" name="content" label="Devotion Content" v-model="content"
                    placeholder="Write the main body of the devotion here" rules="required" :min-height="'300px'"
                    :max-height="'600px'" />


                <!-- Optional Cover Image -->
                <div
                    class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark">
                    <label class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                        Cover Image
                        <span class="text-sm text-textSecondary-light dark:text-textSecondary-dark">(optional)</span>
                    </label>
                    <MediaImageUpload v-model="coverImage" :folder="'uploads/devotions'" />
                </div>


                <div class="flex justify-between items-center w-full">

                    <!-- Submit -->
                    <BaseButton :loading="loading" :disabled="loading" :full="true">
                        <span class="text-white" v-if="!loading">📖 Submit</span>
                        <span class="text-white" v-else>Loading...</span>
                    </BaseButton>
                </div>
            </form>
        </template>
    </BaseDialog>
</template>