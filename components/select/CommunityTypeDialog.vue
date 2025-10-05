<template>
  <BaseDialog v-model="open" title="Create Community" body-class="max-w-2xl">
    <template #content>
      <div class="space-y-4">
        <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark">
          What would you like to create?
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Group Option -->
          <div @click="selectType('group')"
            class="cursor-pointer border rounded-xl p-4 flex items-center gap-4 hover:border-primary-light dark:hover:border-primary-dark transition"
            :class="selected === 'group'
              ? 'border-primary-light dark:border-primary-dark'
              : 'border-borderColor-light dark:border-borderColor-dark'
              ">
            <div class="bg-primary-light/10 text-primary-light dark:text-primary-dark p-3 rounded-full">
              <Icon name="mdi:account-group" width="24" height="24" class="text-xl" />
            </div>
            <div>
              <h3 class="font-semibold text-sm text-textPrimary-light dark:text-textPrimary-dark">
                Group
              </h3>
              <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                For prayer communities, friends, and church members. Users who
                join become <strong>members</strong>.
              </p>
            </div>
          </div>

          <!-- Page Option -->
          <div @click="selectType('page')"
            class="cursor-pointer border rounded-xl p-4 flex items-center gap-4 hover:border-primary-light dark:hover:border-primary-dark transition"
            :class="selected === 'page'
              ? 'border-primary-light dark:border-primary-dark'
              : 'border-borderColor-light dark:border-borderColor-dark'
              ">
            <div class="bg-primary-light/10 text-primary-light dark:text-primary-dark p-3 rounded-full">
              <Icon name="mdi:bullhorn" width="24" height="24" class="text-xl" />
            </div>
            <div>
              <h3 class="font-semibold text-sm text-textPrimary-light dark:text-textPrimary-dark">
                Page
              </h3>
              <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                For churches, ministries, and public figures. Users who follow
                become <strong>followers</strong> of the page.
              </p>
            </div>
          </div>
        </div>


        <!-- Continue Button -->
        <div class="pt-4">
          <BaseButton :disabled="!selected" class="w-full" @click="goToCreate">
            Continue
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const selected = ref(null);
const router = useRouter();

function selectType(type) {
  selected.value = type;
}

function goToCreate() {
  open.value = false;

  // wait for 1 second
  setTimeout(() => {

    if (selected.value === "group") {
      router.push("/user/communities/group/create");
    } else if (selected.value === "page") {
      router.push("/user/communities/page/create");
    }

    selected.value = null;

  }, 1000);
}
</script>
