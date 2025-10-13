<template>
  <HeadlessTransitionRoot as="template" :show="open" v-if="open">
    <HeadlessDialog
      as="div"
      class="relative z-[300]"
      @close="autoClose ? (open = false) : ''"
    >
      <!-- Content Wrapper -->
      <div
        class="fixed inset-0 z-[9999] flex justify-center p-0 text-center sm:p-6 items-end sm:items-center"
      >
        <HeadlessTransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <HeadlessDialogPanel
            class="relative w-full sm:rounded-lg rounded-t-lg bg-card-light dark:bg-card-dark shadow-xl text-left h-screen flex flex-col"
            :class="[props.bodyClass]"
          >
            <!-- Scrollable Content -->
            <div class="overflow-y-auto flex-1" ref="contentContainer">
              <slot name="content" />
            </div>
          </HeadlessDialogPanel>
        </HeadlessTransitionChild>
      </div>
    </HeadlessDialog>
  </HeadlessTransitionRoot>
</template>

<script setup>
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  autoClose: { type: Boolean, default: true },
  bodyClass: { type: String, default: "max-w-3xl" },
});

const open = computed({
  get: () => props.modelValue,
  set(val) {
    emits("update:modelValue", val);
  },
});
</script>
