<script setup>
import { reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import addQuery from "@/graphql/pages/create.gql";
import { useToast } from "vue-toast-notification";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const steps = ["Basic Info", "Categories", "Medias"];

// --- Active step from URL query or default ---
const activeStep = ref(parseInt(route.query.step || 0));

// --- Form state ---
const form = reactive({
  name: "",
  description: "",
  language: "",
  profileImage: "",
  coverImage: "",
  categories: [],
});

const pageTitle = computed(() => {
  return `Create Page - ${steps[activeStep.value]}`;
});

// --- Restore saved form ---
const saved = localStorage.getItem("page-create-form");
if (saved) Object.assign(form, JSON.parse(saved));

// --- Save form to local storage ---
watch(
  form,
  (newVal) => {
    localStorage.setItem("page-create-form", JSON.stringify(newVal));
  },
  { deep: true }
);

// --- Sync activeStep with route changes ---
watch(
  () => route.query.step,
  (val) => {
    const stepNum = parseInt(val || 0);
    if (!isNaN(stepNum) && stepNum >= 0 && stepNum < steps.length) {
      activeStep.value = stepNum;
    }
  }
);

function goToStep(step) {
  router.push({
    query: { ...route.query, step },
  });
}

function nextStep() {
  if (activeStep.value < steps.length - 1) {
    goToStep(activeStep.value + 1);
  }
}

function prevStep() {
  if (activeStep.value > 0) {
    goToStep(activeStep.value - 1);
  }
}

// GraphQL: Add Page
const { mutate, onDone, loading } = mutator(addQuery, {
  clientId: "auth",
});
const onSubmit = async () => {
  const input = {
    name: form.name,
    description: form.description,
    language_code: form.language,
    profile_image: form.profileImage,
    cover_image: form.coverImage,
    page_categories: {
      data: form.categories.map(categoryId => ({
        category_id: categoryId
      }))
    }
  };
  await mutate({ input });
};

function clearFormData() {
  localStorage.removeItem("page-create-form");
  Object.assign(form, {
    name: "",
    description: "",
    language: "",
    profileImage: "",
    coverImage: "",
    categories: [],
  });
}

function isFormEmpty() {
  return (
    !form.name &&
    !form.description &&
    !form.language &&
    !form.profileImage &&
    !form.coverImage &&
    form.categories.length === 0
  );
}

onDone(async ({ data }) => {
  const newPage = data?.insert_pages_one;
  if (newPage) {
    toast.success("Page created successfully!", {
      position: "top-right",
    });
    clearFormData(); // ✅ clears storage & form

    // ✅ Navigate without keeping history
    window.location.replace(`/user/communities/page/${newPage.id}`);
  } else {
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });
  }
});


// Prevent leaving without confirmation
onMounted(() => {
  window.addEventListener("beforeunload", preventUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", preventUnload);
});

function preventUnload(e) {
  if (!isFormEmpty()) {
    e.preventDefault();
    e.returnValue = "";
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (!isFormEmpty()) {
    if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
      clearFormData();
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

const openDialog = ref(false);

onMounted(() => {
  openDialog.value = true;
});

watch(openDialog, (newVal) => {
  if (!newVal) {
    // Check history and back if needed
    if (history.length > 1) {
      history.back();
    }
    if (history.length === 1) {
      router.push('/user/communities');
    }
  }
});

const closeDialog = () => {

  openDialog.value = false;
  router.push('/user/communities');
}
</script>

<template>


  <BaseDialog v-model="openDialog" @close="closeDialog" :fullHeight="true" :title="pageTitle" :noBack="true"
    :bodyClass="'max-w-3xl'">
    <template #content>
      <div>

        <PagesCreateBasicInfo v-if="activeStep === 0" v-model="form" @next="nextStep" />

        <PagesCreateCategories v-if="activeStep === 1" v-model="form" @next="nextStep" @back="prevStep" />

        <PagesCreateMedias v-if="activeStep === 2" v-model="form" @next="onSubmit" @back="prevStep" />
      </div>
    </template>
  </BaseDialog>
</template>
