<script setup>
import { ref, reactive, computed } from "vue";
import getPrayerLists from "~/graphql/prayers/prayer_lists.gql";
import addPrayerListItem from "~/graphql/prayers/add_prayer_list_item.gql";
import { useToast } from "vue-toast-notification";

const props = defineProps({
  prayerRequestId: { type: String, required: true },
  modelValue: Boolean,
});

const toast = useToast();

const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
const user = useCookie("userData");

// get prayer lists
const prayerLists = ref([]);
const { onResult, refetch } = queryList(getPrayerLists, {
  filter: {
    user_id: {
      _eq: 1,
    },
  },
  clientId: "auth",
});

onResult(({ data }) => {
  if (data) {
    prayerLists.value = data.prayer_lists;
  }
});

const customPrayerLists = computed(() => {
  return prayerLists.value?.filter((pr) => pr.type === "custom");
});

// add prayer list item
const {
  mutate,
  onDone: onAddPrayerListItemDone,
  loading: onAddPrayerListItemLoading,
  onError: onAddPrayerListItemError,
} = mutator(addPrayerListItem, {
  clientId: "auth",
  showError: false,
});

onAddPrayerListItemError((error) => {
  if (error.message?.includes("Uniqueness violation")) {
    toast.success("This prayer is alrady in the list added", {
      position: "top-right",
    });
  } else {
    toast.error("Unable to save prayer, please try again later", {
      position: "top-right",
    });
  }
});

onAddPrayerListItemDone(({ data }) => {
  if (data) {
    toast.success("Prayer added to list", {
      position: "top-right",
      duration: 5000,
      pauseOnHover: true,
    });
    open.value = false;
  }
});

const listOptions = ref([
  {
    value: "general",
    label: "General List",
    description: "Add this prayer to your general prayer list",
    icon: "📋",
  },
  {
    value: "daily",
    label: "Today",
    description: "Add this prayer to today's prayer list (based on weekday)",
    icon: "📅",
  },
  {
    value: "weekly",
    label: "This Week",
    description: "Add this prayer to this week's prayer list",
    icon: "📆",
  },
  {
    value: "custom",
    label: "Custom List",
    description: "Add this prayer to your custom prayer list",
    icon: "🏷️",
  },
]);

// Helper: Get Monday of a given date
function getMonday(date) {
  const day = date.getDay(); // Sunday=0, Monday=1, ...
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday;
}

function onCustomListSelected(list) {
  prayerLists.value?.unshift(list);
  handleSubmit(list);
}

// Get YYYY-MM-DD string in user’s timezone
function formatDateToYYYYMMDD_TZ(date, timezone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;

  return `${y}-${m}-${d}`;
}

function handleSubmit(selected, isCustomListType = true) {
  const input = {
    prayer_request_id: props.prayerRequestId,
  };

  if (isCustomListType) {
    input.prayer_list_id = selected.id;
  } else {
    // Use try catch to handle errors
    try {
      // get user's timezone or device timezone
      const tz =
        user.value.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (selected.value === "weekly") {
        const now = new Date();
        // compute "monday" in user's timezone
        const monday = getMonday(
          new Date(
            formatDateToYYYYMMDD_TZ(now, tz) // get today in tz, then adjust
          )
        );
        let scheduled_week = formatDateToYYYYMMDD_TZ(monday, tz);

        const prayerList = prayerLists.value.find(
          (list) => list.type === "weekly"
        );
        if (prayerList) {
          input.prayer_list_id = prayerList.id;
          input.scheduled_week = scheduled_week;
        } else {
          toast.error("Prayer list not found", {
            position: "top-right",
          });
          return;
        }
      } else if (selected.value === "daily") {
        input.scheduled_date = formatDateToYYYYMMDD_TZ(new Date(), tz);

        const prayerList = prayerLists.value.find(
          (list) => list.type === "daily"
        );

        if (prayerList) {
          input.prayer_list_id = prayerList.id;
        } else {
          toast.error("Prayer list not found", {
            position: "top-right",
          });
          return;
        }
      } else {
        // general
        input.prayer_list_id = prayerLists.value.find(
          (list) => list.type === "general"
        ).id;
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Unable to save prayer, please try again later", {
        position: "top-right",
      });
    }
  }

  mutate({ input });
}
</script>

<template>
  <BaseDialog
    v-model="open"
    title="Add to Prayer List"
    class="max-w-md"
    :show-close-button="false"
    :auto-close="false"
  >
    <template #content>
      <div class="text-center mb-6">
        <div
          class="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
        >
          <Icon name="plus" class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Add to Prayer List
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Choose how you'd like to organize this prayer
        </p>
      </div>

      <div class="space-y-5">
        <div>
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Select List Type
          </label>
          <div class="grid gap-3">
            <div
              @click="handleSubmit(option, false)"
              v-for="option in listOptions"
              :key="option.value"
              :class="[
                'relative p-3 rounded-lg border cursor-pointer transition  space-y-4',
                false
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
              ]"
            >
              <div class="flex items-center space-x-3">
                <div
                  :class="[
                    'w-9 h-9 rounded-md flex items-center justify-center',
                    false
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
                  ]"
                >
                  {{ option.icon }}
                </div>
                <div class="flex-1">
                  <h4
                    class="font-semibold text-gray-900 dark:text-white text-sm"
                  >
                    {{ option.label }}
                  </h4>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ option.description }}
                  </p>
                </div>
                <div
                  v-if="false"
                  class="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <Icon name="uil:check" class="w-3 h-3 text-white" />
                </div>
              </div>

              <PrayerCustomList
                v-if="option.value == 'custom'"
                :custom-prayer-lists="customPrayerLists"
                @list-selected="onCustomListSelected"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
