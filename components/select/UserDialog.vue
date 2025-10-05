<script setup>
import listQuery from "@/graphql/auth/users_list.gql";

// Emits
const emit = defineEmits(["update:modelValue", "selected"]);

// Props
const props = defineProps({
  modelValue: Boolean,

  exclude: {
    type: Array,
    default: () => [],
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

// State
const items = ref([]);
const limit = ref(4);
const offset = ref(0);
const search = ref("");

const sort = ref([{ full_name: "asc" }]);

const filter = computed(() => {
  const query = {};
  query._and = {};
  query._and._or = [
    {
      full_name: {
        _ilike: `%${search.value}%`,
      },
    },
    {
      user_name: {
        _ilike: `%${search.value}%`,
      },
    },
  ];
  query._and.id = {
    _nin: props.exclude,
  };

  return query;
});

// GraphQL Query
const { onResult, onError, refetch } = queryList(listQuery, {
  filter: filter,
  limit: limit,
  offset: offset,
  order: sort,
});

// Handle successful result
onResult(({ data }) => {
  if (data?.users) {
    items.value = data.users;
  }
});

// Handle errors
onError((error) => {
  console.error("Error loading users:", error);
});

// Emit selected user
const selectUser = (user) => {
  emit("selected", user);
  open.value = false; // Auto-close after selection
};
</script>

<template>
  <BaseDialog title="Select User" v-model="open">
    <template #content>
      <div class="h-80 space-y-3">
        <!-- 🔍 Search Input -->
        <BaseInput
          v-model="search"
          name="search"
          placeholder="Search users by name, username"
          class="mb-4"
        />

        <!-- 👥 User List -->
        <ul v-if="items.length" class="space-y-2">
          <li
            v-for="item in items"
            :key="item.id"
            @click="selectUser(item)"
            class="hover:cursor-pointer"
          >
            <div
              class="flex items-start gap-3 p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition"
            >
              <!-- 🖼️ Avatar -->
              <div
                class="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center font-bold text-lg overflow-hidden"
              >
                <img
                  v-if="item.profile_image"
                  :src="item.profile_image"
                  class="w-full h-full object-cover rounded-full"
                  alt="User Image"
                />
                <span class="capitalize" v-else>{{
                  item.full_name?.charAt(0)
                }}</span>
              </div>

              <!-- 📝 User Info -->
              <div class="flex-1">
                <div
                  class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
                >
                  {{ item.full_name }}
                </div>
                <div
                  class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
                >
                  @{{ item.user_name }}
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div
          v-else
          class="flex flex-col items-center justify-center text-center text-textSecondary-light dark:text-textSecondary-dark mt-10 space-y-2"
        >
          <!-- 🚫 Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 text-borderColor-light dark:text-borderColor-dark"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18.364 5.636a9 9 0 11-12.728 0M15 12h.01M9 12h.01M12 16h.01"
            />
          </svg>

          <!-- ✨ Message -->
          <p class="text-sm font-medium">No users found</p>
          <p
            class="text-xs text-textTertiary-light dark:text-textTertiary-dark"
          >
            Try adjusting your search or check for typos.
          </p>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
