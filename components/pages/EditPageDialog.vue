<script setup>
import updateQuery from "@/graphql/pages/update_page.gql";
import { useToast } from "vue-toast-notification";

const router = useRouter();
const { handleSubmit } = useForm();
const toast = useToast();

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  page: {
    type: Object,
    required: true,
  },
  myRoleForPage: {
    type: Object,
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
const refetchPage = inject("refetchPage");
const refetchPages = inject("refetchPages");

const form = reactive({
  name: props.page.name || "",
  description: props.page.description || "",
  language: props.page.language_code || "en",
  categories: props.page.page_categories.map(category => category.category_id) || [],
});

const hasChanges = computed(() => {
  // Get original category IDs
  const originalCategoryIds = props.page.page_categories?.map(gc => gc.category_id) || [];

  // Check if categories have changed
  const categoriesChanged = JSON.stringify(form.categories.sort()) !== JSON.stringify(originalCategoryIds.sort());

  return (
    form.name !== (props.page.name || "") ||
    form.description !== (props.page.description || "") ||
    form.language !== (props.page.language_code || "en") ||
    categoriesChanged
  );
});

// GraphQL: Update Group
const { mutate, onDone, loading } = mutator(updateQuery, {
  clientId: "auth",
  role: props.myRoleForPage?.role || "group:owner", // Assuming user will join as a regular members
});

const onSubmit = handleSubmit(() => {
  const input = {
    name: form.name,
    description: form.description,
    language_code: form.language,
  };
  const categoryInput = form.categories.map(categoryId => ({
    page_id: props.page.id,
    category_id: categoryId
  }));

  mutate({ id: props.page.id, input, category_input: categoryInput });
});

onDone(({ data }) => {
  const newRequest = data?.update_pages_by_pk;
  if (newRequest) {
    toast.success("Page updated successfully!", {
      position: "top-right",
    });
    if (typeof refetchPage === "function") {
      refetchPage();
    }

    if (typeof refetchPages === "function") {
      refetchPages();
    }
  } else {
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });
  }

  open.value = false;
});
</script>

<template>
  <BaseDialog v-model="open" title="Edit Page" :loading="loading" @close="open = false">
    <template #content>
      <div class="max-w-3xl mx-auto">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <BaseInput id="name" name="name" label="Name" v-model="form.name" placeholder="Name" rules="required"
              :disabled="myRoleForPage?.role != 'page:owner'" />
          </div>

          <!-- ----------------Language-------- -->
          <div>
            <SelectLanguage v-model="form.language" label="Language" rules="required"
              :disabled="myRoleForPage?.role != 'page:owner'" />
          </div>

          <!-- Description -->

          <div>
            <BaseTextInput id="description" name="description" label="Description" v-model="form.description"
              placeholder="Enter a short description for your page" rules="required" />
          </div>


          <!-- Categories -->
          <div class="mb-6">
            <PagesCategorySelection v-model="form.categories" />
          </div>



          <!-- Submit Button -->

          <BaseButton :loading="loading" :disabled="loading || !hasChanges">
            <span class="text-white" v-if="!loading">🙏 Submit</span>
            <span class="text-white" v-else>Loading...</span>
          </BaseButton>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>
