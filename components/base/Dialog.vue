<template>
  <HeadlessTransitionRoot as="template" :show="open" v-if="open">
    <HeadlessDialog
      as="div"
      class="relative z-[300]"
      @close="autoClose ? (open = false) : ''"
    >
      <!-- Overlay -->
      <HeadlessTransitionChild
        v-if="blockOutside"
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-70 transition-opacity" />
      </HeadlessTransitionChild>

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
            class="relative w-full sm:rounded-lg rounded-t-lg bg-card-light dark:bg-card-dark shadow-xl text-left sm:h-auto max-h-screen sm:max-h-[90vh] flex flex-col"
            :class="[props.bodyClass, fullHeight ? 'h-full' : 'h-auto']"
          >
            <!-- Header -->
            <div
              class="sticky top-0 z-[9999] flex items-center justify-between bg-card-light dark:bg-card-dark px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg"
            >
              <HeadlessDialogTitle
                as="h3"
                class="text-base font-semibold text-textPrimary-light dark:text-textPrimary-dark sm:text-xl w-full"
              >
                <slot name="heading">
                  <div class="flex items-center gap-3 justify-between">
                    {{ truncateTitle }}
                    <button
                      type="button"
                      class="flex items-center justify-center text-textSecondary-light dark:text-textSecondary-dark hover:text-textPrimary-light dark:hover:text-textPrimary-dark focus:outline-none focus:ring-0 sm:hidden"
                      @click="open = false"
                    >
                      <Icon
                        name="ion:close-outline"
                        class="w-6 h-6 text-black dark:text-white"
                      />
                    </button>
                  </div>
                </slot>
              </HeadlessDialogTitle>

              <button
                type="button"
                class="sm:flex items-center justify-center text-textSecondary-light dark:text-textSecondary-dark hover:text-textPrimary-light dark:hover:text-textPrimary-dark focus:outline-none focus:ring-0 hidden"
                @click="open = false"
              >
                <span class="sr-only">Close</span>
                <Icon name="ion:close-outline" class="w-5 h-5" />
              </button>
            </div>

            <!-- Scrollable Content -->
            <div
              class="px-3 sm:px-6 my-2 sm:my-4 overflow-y-auto flex-1"
              :style="{
                maxHeight:
                  windowWidth >= 640
                    ? 'calc(90vh - 56px - env(safe-area-inset-bottom, 1rem))'
                    : 'calc(100vh - 56px - env(safe-area-inset-bottom, 1rem))',
              }"
            >
              <slot name="content" />
            </div>
          </HeadlessDialogPanel>
        </HeadlessTransitionChild>
      </div>
    </HeadlessDialog>
  </HeadlessTransitionRoot>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const emits = defineEmits(["update:modelValue", "close"]);
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "" },
  autoClose: { type: Boolean, default: true },
  bodyClass: { type: String, default: "max-w-3xl" },
  blockOutside: { type: Boolean, default: true },
  fullHeight: { type: Boolean, default: false },
  noBack: { type: Boolean, default: false },
});

const open = computed({
  get: () => props.modelValue,
  set(val) {
    emits("update:modelValue", val);
    if (!val) emits("close");
  },
});

const windowWidth = ref(window.innerWidth);
const handleResize = () => (windowWidth.value = window.innerWidth);
onMounted(() => window.addEventListener("resize", handleResize));
onBeforeUnmount(() => window.removeEventListener("resize", handleResize));

const truncateTitle = computed(() =>
  props.title.length > 35 ? props.title.slice(0, 35) + "..." : props.title
);

// --- Modal History Handling ---
let hasPushedState = false;

const handlePopState = (event) => {
  // Only close modal if state matches the one we pushed
  if (hasPushedState) {
    open.value = false;
    hasPushedState = false;
  }
};

const closeDialog = () => {
  if (!open.value) return;
  open.value = false;

  if (hasPushedState) {
    // Remove our dummy state without leaving the page
    history.back();
    hasPushedState = false;
  }
};

// Watch modal open state to manage history
watch(
  () => open.value,
  (val) => {
    if (props.noBack) return;

    if (val && !hasPushedState) {
      // Modal just opened
      history.pushState({ modalOpen: true }, document.title);
      hasPushedState = true;
      window.addEventListener("popstate", handlePopState);
    } else if (!val && hasPushedState) {
      // Modal just closed programmatically
      window.removeEventListener("popstate", handlePopState);
      hasPushedState = false;
    }
  },
  { immediate: true }
);
</script>
