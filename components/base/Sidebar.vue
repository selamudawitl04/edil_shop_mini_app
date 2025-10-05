<script setup>
const emits = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
});

const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});
</script>

<template>
  <HeadlessTransitionRoot as="template" :show="open">
    <HeadlessDialog
      as="div"
      class="relative z-[9999]"
      @close="autoClose ? (open = false) : ''"
    >
      <!-- Full-screen transparent overlay for click-outside support -->
      <div class="fixed inset-0" />

      <!-- Panel wrapper -->
      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
          >
            <HeadlessTransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <HeadlessDialogPanel
                class="pointer-events-auto w-screen max-w-md"
              >
                <div
                  class="flex h-full flex-col overflow-y-scroll bg-card-light dark:bg-card-dark py-6 shadow-xl"
                >
                  <!-- Top -->
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-between">
                      <!-- Heading -->
                      <HeadlessDialogTitle
                        as="h3"
                        class="flex-1 text-base font-semibold leading-6 text-textPrimary-light dark:text-textPrimary-dark"
                      >
                        <slot name="Heading" />
                      </HeadlessDialogTitle>

                      <!-- Close -->
                      <div class="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          class="relative rounded-md text-textSecondary-light dark:text-textSecondary-dark hover:text-textPrimary-light dark:hover:text-textPrimary-dark focus:outline-none focus:ring-2 focus:ring-borderColor-light dark:focus:ring-borderColor-dark focus:ring-offset-2"
                          @click="open = false"
                        >
                          <span class="absolute -inset-2.5" />
                          <span class="sr-only">Close panel</span>
                          <Icon
                            name="iconamoon:close-light"
                            width="30"
                            height="30"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="relative mt-6 flex-1 px-4 sm:px-6 text-textPrimary-light dark:text-textPrimary-dark"
                  >
                    <slot name="Content" />
                  </div>
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </div>
    </HeadlessDialog>
  </HeadlessTransitionRoot>
</template>
