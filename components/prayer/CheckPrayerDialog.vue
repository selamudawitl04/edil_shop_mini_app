<template>
  <!-- ----------Check Prayer  Dialog-------- -->

  <BaseDialog v-model="open" title="Check Prayer Request">
    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <BaseInput v-model="form.editToken" label="Edit token"
          placeholder="Enter edit token which given for when you create the prayer request" name="edit_token "
          id="edit_token" rules="required" />

        <BaseButton type="submit" class="mt-2" :loading="loading" :disabled="loading">Submit</BaseButton>
      </form>
    </template>
  </BaseDialog>
</template>
<script setup>
import checkPrayerMutation from "@/graphql/prayers/check_prayer_request.gql";
import { useForm } from "vee-validate";
import { usePrayerStore } from "@/stores/prayer";

const prayerStore = usePrayerStore();

const { handleSubmit } = useForm();

const router = useRouter();
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: Boolean,
});

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

// form states
const form = ref({
  editToken: "",
});

// ---- Update Handlers ----

const { mutate, onDone, loading } = mutator(checkPrayerMutation, {});

const onSubmit = handleSubmit(() => {
  mutate({
    editToken: form.value.editToken,
  });
});

onDone(({ data }) => {



  if (data.check_prayer_request) {
    open.value = false;
    setTimeout(() => {
      prayerStore.openPrayerRequest(data.check_prayer_request?.id, form.value.editToken);
    }, 1000);

  }
});
</script>
