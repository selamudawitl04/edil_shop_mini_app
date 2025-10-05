<script setup>

import getPageAdmins from "@/graphql/pages/get_admins.gql";

const user = useCookie("userData")

// Emits
const emit = defineEmits(["update:modelValue", "selected"]);

// Props
const props = defineProps({
  modelValue: Boolean,
  exclude: {
    type: Array,
    default: () => [],
  },
  feed: {
    type: Object,
    default: () => { },
  },
});

// Two-way binding for dialog open/close
const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});



const search = ref("");
const pages = ref([]);
// Filter for user groups include search
const filter = computed(() => {
  let query = {
    user_id: {
      _eq: user.value.id,
    },
    page: {
      status: {
        _eq: "active",
      },
      deleted_at: {
        _is_null: true,
      },
    },
  };

  if (search.value) {
    query.page = {
      name: {
        _ilike: `%${search.value}%`,
      },
    };
  }


  return query;
});

const limit = ref(20);
const { onResult } = queryList(getPageAdmins, {
  clientId: "auth",
  filter: filter,
  limit: limit,
});



onResult(({ data }) => {
  if (data.page_admins) {
    pages.value = data.page_admins;

  }
});


// Emit selected group
const selectGroup = (group) => {
  emit("selected", group);
  open.value = false; // Auto-close after selection
};


</script>

<template>
  <BaseDialog title="Select Page" v-model="open" body-class="max-w-xl">
    <template #content>
      <div class="h-80 space-y-3">
        <!-- 🔍 Search Input -->
        <BaseInput v-model="search" name="search" placeholder="Search pages by name" class="mb-4" />

        <!-- 👥 User List -->
        <ul v-if="pages.length" class="space-y-2">
          <li v-for="item in pages" :key="item.id" @click="selectGroup(item)" class="hover:cursor-pointer">
            <div
              class="flex items-start gap-3 p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition">
              <!-- 🖼️ Avatar -->

              <BaseAvatar :avatar_image="item.page.cover_image" :name="item.page.name"
                :avatar_color="item.page.avatar_color" class="w-10 h-10 rounded-full" />

              <!-- 📝 User Info -->
              <div class="flex-1">
                <div class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                  {{ item.page.name }}
                </div>
                <div class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                  {{ item.page.is_private ? "Private" : "Public" }}
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div v-else
          class="flex flex-col items-center justify-center text-center text-textSecondary-light dark:text-textSecondary-dark mt-10 space-y-2">
          <!-- 🚫 Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-borderColor-light dark:text-borderColor-dark"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18.364 5.636a9 9 0 11-12.728 0M15 12h.01M9 12h.01M12 16h.01" />
          </svg>

          <!-- ✨ Message -->
          <p class="text-sm font-medium">No pages found</p>
          <p class="text-xs text-textTertiary-light dark:text-textTertiary-dark">
            Try adjusting your search or check for typos.
          </p>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
