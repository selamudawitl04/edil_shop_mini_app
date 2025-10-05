<script setup>
import listQuery from "@/graphql/auth/users_list.gql";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  label: {
    type: String,
  },
});

const selectedItem = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const items = ref([]);
const limit = ref(100);
const offset = ref(0);
const { onResult, onError } = queryList(listQuery, {});

onResult(({ data }) => {
  if (data.users) {
    items.value = data.users;
  }
});

onError((error) => {
  console.log(error);
});
</script>

<template>
  <BaseSearchSelect
    :label="label"
    :items="items"
    v-model="selectedItem"
    name="user"
    :rules="rules"
    placeholder="Select user"
    show-by="full_name"
    value="id"
    search-placeholder="Search user by name, email, username or phone number"
  >
    <template v-slot:row="{ item }">
      <div
        class="flex items-start gap-3 p-2 rounded-md cursor-pointer transition hover:bg-primary-light/10 dark:hover:bg-primary-dark/10"
      >
        <!-- Avatar -->
        <div
          class="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center font-bold text-lg overflow-hidden"
        >
          <img
            v-if="item.profile_image"
            :src="item.profile_image"
            class="w-full h-full object-cover rounded-full"
            alt="Group Image"
          />
          <span v-else>{{ item.full_name?.charAt(0) }}</span>
        </div>

        <!-- Info -->
        <div class="flex-1">
          <div class="text-sm mt-0.5">
            {{ item.full_name }}
          </div>
          <div class="text-xs mt-0.5">
            {{ item.user_name }}
          </div>
        </div>
      </div>
    </template>
  </BaseSearchSelect>
</template>
