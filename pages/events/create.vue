<script setup>
import { reactive, ref, watch, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import addQuery from "@/graphql/events/create.gql";
import { useToast } from "vue-toast-notification";

const router = useRouter();
const route = useRoute();
const toast = useToast();

if (!route.query.communityId) {
  router.replace("/");
}

const steps = ["Basic Info", "Medias", "Location", "Time Date"];

// --- Active step from URL query or default ---
const activeStep = ref(parseInt(route.query.step || 0));

// --- Dialog state ---

// --- Form state ---
const form = reactive({
  title: "",
  description: "",
  category_id: "",
  banner_url: "",
  location_type: "online",
  location: "", // physical address
  location_link: "", // map link
  event_links: [], // for online platform
  start_date: "",
  end_date: "",
  start_time_utc: "",
  end_time_utc: "",
  time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  is_recurring: false,
  recurrence_rule: {
    freq: "weekly",
    interval: 1,
    byDay: [],
  },
  is_all_day: false,
});

const isBasicInfoValid = computed(() => {
  return (
    form.title?.length > 0 &&
    form.description?.length > 0 &&
    form.category_id?.length
  );
});

if (activeStep.value > 0 && !isBasicInfoValid.value) {
  goToStep(0);
}

const pageTitle = computed(() => {
  return `Create Event - ${steps[activeStep.value]}`;
});

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

// --- Mutation ---
const { mutate, onDone, loading } = mutator(addQuery, {
  clientId: "auth",
  role: route.query.role,
});

const onSubmit = async () => {
  const input = {
    title: form.title,
    description: form.description,
    banner_url: form.banner_url,
    event_category_id: form.category_id,
    start_time_utc: new Date(form.start_time_utc).toISOString(),
    end_time_utc: new Date(form.end_time_utc).toISOString(),
    timezone: form.time_zone,
    // is_recurring: false,
    // recurrence_rule: `FREQ=${form.recurrence_rule.freq};INTERVAL=${
    //   form.recurrence_rule.interval
    // };BYDAY=${form.recurrence_rule.byDay.join(",")}`,
    location_address: form.location,
    location_type: form.location_type,
    location_link: form.location_link,
    event_links: {
      data: form.event_links.map((link) => ({
        url: link.url,
        platform: link.platform,
      })),
    },
    feed: {
      data: {
        type: "event",
        visibility: route.query.visibility,
      },
    },
  };
  if (route.query.communityType === "group") {
    input.feed.data.group_id = route.query.communityId;
  } else if (route.query.communityType === "page") {
    input.feed.data.page_id = route.query.communityId;
  }
  mutate({ input });
};

onDone(async ({ data }) => {
  const newEvent = data?.insert_events_one;
  if (newEvent) {
    toast.success("Event created successfully!", {
      position: "top-right",
    });
    router.replace("/");
    // router.replace(`/user/events/event/${newEvent.id}`);
    // router.push(`/events/${newEvent.id}`);
  } else {
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });
  }
});

const openDialog = ref(false);

onMounted(() => {
  openDialog.value = true;
});

// Debug: Watch for dialog state changes
watch(openDialog, (newVal, oldVal) => {
  console.log("Dialog state changed:", { from: oldVal, to: newVal });
  if (!newVal && oldVal) {
    console.log("Dialog was closed. Stack trace:", new Error().stack);
  }
});

// Debug: Watch for form changes
watch(
  form,
  (newVal) => {
    console.log("Form changed:", newVal);
  },
  { deep: true }
);
</script>

<template>
  <BaseDialog
    v-model="openDialog"
    :fullHeight="true"
    :title="pageTitle"
    :bodyClass="'max-w-3xl'"
    :autoClose="false"
  >
    <template #content>
      <div>
        <!-- <pre>{{ route.query }}</pre> -->
        <EventsCreateBasicInfo
          v-if="activeStep === 0"
          v-model="form"
          @next="nextStep"
        />

        <EventsCreateMedias
          v-if="activeStep === 1"
          v-model="form"
          @next="nextStep"
          @back="prevStep"
        />

        <EventsCreateLocation
          v-if="activeStep === 2"
          v-model="form"
          @next="nextStep"
          @back="prevStep"
        />

        <EventsCreateSchedule
          v-if="activeStep === 3"
          v-model="form"
          @next="onSubmit"
          @back="prevStep"
        />
      </div>
    </template>
  </BaseDialog>
</template>
