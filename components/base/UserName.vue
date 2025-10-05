<template>
  <BaseInput
    name="user_name"
    placeholder="user name"
    rules="user_name"
    v-model="userName"
  >
    <template #label>
      <div
        class="mb-1 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark flex items-center space-x-2"
      >
        <span class="text-sm">UserName</span>

        <span class="text-red-600 dark:text-red-400">*</span>
        <span
          v-if="userName?.length > 2 && !isUserNameExist"
          class="text-green-600 dark:text-green-400"
          >✓ Available</span
        >
        <span
          v-else-if="userName && isUserNameExist"
          class="text-red-600 dark:text-red-400"
          >✗ Taken</span
        >
      </div>
    </template>
  </BaseInput>
</template>

<script setup>
import getUsersQuery from "@/graphql/auth/users_list.gql";
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const users = ref([]);
const limit = ref(1);
const offset = ref(0);
const enabled = computed(() => userName.value?.length > 2);

const userName = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const filter = computed(() => {
  return {
    user_name: {
      _eq: userName.value,
    },
  };
});
const { onResult, onError } = queryList(getUsersQuery, {
  filter: filter,
  limit: limit,
  offset: offset,
  enabled: enabled,
});

onResult(({ data }) => {
  if (data) users.value = data.users;
});

const isUserNameExist = computed(
  () =>
    users.value?.length &&
    userName.value?.length > 2 &&
    userName.value?.length < 31
);
</script>
