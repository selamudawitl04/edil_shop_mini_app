<template>
  <BaseDialog v-model="open" title="ሙሉ ስም ቀይር">
    <template #content>
      <form @submit.prevent="updateName" class="space-y-4">
        <BaseInput
          v-model="name"
          placeholder="ሙሉ ስም"
          name="name"
          id="name"
          label="👤 ሙሉ ስም"
          rules="required"
        >
        </BaseInput>

        <BaseButton
          :disabled="updateUserLoading || user.name === name"
          class="px-2 py-1 text-sm font-medium border rounded-lg text-primary-light border-primary-light hover:bg-primary-light hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          <Icon name="mdi:pencil" class="w-4 h-4" />
          ቀይር
        </BaseButton>
      </form>
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, computed } from "vue";
import updateUserMutation from "@/graphql/auth/update_user.gql";
import { useToast } from "vue-toast-notification";
import { useForm } from "vee-validate";
const emit = defineEmits(["update:modelValue", "updated"]);

const toast = useToast();
const user = useCookie("userData");
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const name = ref(user.value.name);

// Toast + GraphQL
const { handleSubmit } = useForm();
const {
  mutate: updateUserMutate,
  onDone: updateUserDone,
  loading: updateUserLoading,
} = mutator(updateUserMutation, { clientId: "auth" });

updateUserDone(({ data }) => {
  if (data?.update_users_by_pk) {
    let newUser = { ...user.value };

    newUser.name = name.value;

    user.value = newUser;
    toast.success("ሙሉ ስም ተቀይሯል", {
      position: "top-right",
    });
    emit("updated", newUser);
  }
  open.value = false;
});

const updateName = handleSubmit(() => {
  updateUserMutate({
    input: { name: name.value },
    id: user.value.id,
  });
});
</script>
