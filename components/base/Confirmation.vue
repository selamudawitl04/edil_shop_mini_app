<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ref, computed } from "vue";

const emits = defineEmits(["update:modelValue", "confirm", "finally"]);
const props = defineProps({
  modelValue: Boolean,
  autoClose: { type: Boolean, default: true },
  icon: { type: String, default: "ph:seal-check-fill" },
  iconWrapperClass: {
    type: String,
    default:
      "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-success-light text-success-dark sm:mx-0 sm:h-10 sm:w-10",
  },
  iconClass: { type: String, default: "h-8 w-8 text-success-dark" },
  title: String,
  sureQuestion: String,
  description: String,
  confirmButton: { type: String, default: "Confirm" },
  cancelButton: { type: String, default: "Cancel" },
  loading: Boolean,

  showResponse: { type: Boolean, default: false },
  confirmTitle: { type: String, default: "Confirmed" },
  confirmMsg: { type: String, default: "Your action was confirmed." },
  cancelTitle: { type: String, default: "Cancelled" },
  cancelMsg: { type: String, default: "Your action was cancelled." },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});

const unsubscribed = ref(false);
const cancelled = ref(false);

const handleConfirm = () => {
  emits("confirm", true);
  open.value = false;
  unsubscribed.value = true;
};

const handleCancel = () => {
  emits("confirm", false);
  open.value = false;
  cancelled.value = true;
};
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      class="relative z-[700]"
      @close="autoClose ? (open = false) : ''"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full max-w-md p-6 overflow-hidden text-left transition-all transform rounded-lg shadow-xl bg-card-light dark:bg-card-dark sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="flex flex-col space-y-4">
                <div class="flex items-center justify-between">
                  <div
                    class="flex items-center space-x-3 text-primary-light dark:text-primary-dark"
                  >
                    <Icon :name="icon" :class="iconClass" />
                    <DialogTitle
                      as="h3"
                      class="text-base font-semibold leading-6 text-textPrimary-light dark:text-textPrimary-dark"
                    >
                      {{ title }}
                    </DialogTitle>
                  </div>

                  <button
                    type="button"
                    class="text-textSecondary-light dark:text-textSecondary-dark hover:text-textPrimary-light dark:hover:text-textPrimary-dark focus:outline-none focus:ring-0"
                    @click.stop="open = false"
                  >
                    <Icon
                      name="ion:close-outline"
                      width="25"
                      height="25"
                      class="w-6 h-6"
                    />
                  </button>
                </div>

                <h3
                  v-if="sureQuestion"
                  class="font-medium text-textPrimary-light dark:text-textPrimary-dark"
                >
                  {{ sureQuestion }}
                </h3>

                <p
                  v-if="description"
                  class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >
                  {{ description }}
                </p>

                <div class="flex gap-4 mt-4 justify-end">
                  <button
                    @click.stop="handleCancel"
                    class="px-4 py-2 text-sm disabled:cursor-not-allowed font-medium text-white bg-primary-light dark:bg-primary-dark rounded-md shadow hover:shadow-md"
                    :disabled="loading"
                  >
                    {{ cancelButton }}
                  </button>
                  <button
                    @click.stop="handleConfirm"
                    :disabled="loading"
                    class="px-4 py-2 text-sm disabled:cursor-not-allowed font-medium border border-borderColor-light dark:border-borderColor-dark text-textPrimary-light dark:text-textPrimary-dark rounded-md shadow hover:shadow-md"
                  >
                    {{ confirmButton }}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Confirmed Dialog -->
  <TransitionRoot v-if="showResponse" as="template" :show="unsubscribed">
    <Dialog as="div" class="relative z-[700]" @close="unsubscribed = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full max-w-md p-6 overflow-hidden text-center transition-all transform rounded-lg shadow-xl bg-card-light dark:bg-card-dark"
            >
              <div class="flex flex-col items-center space-y-4">
                <Icon
                  name="ph:check-circle-fill"
                  class="w-12 h-12 text-success-dark"
                />
                <h3
                  class="text-xl font-semibold text-textPrimary-light dark:text-textPrimary-dark"
                >
                  {{ confirmTitle }}
                </h3>
                <p
                  class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >
                  {{ confirmMsg }}
                </p>
                <button
                  @click.stop="[(unsubscribed = false), emits('finally', true)]"
                  class="px-4 py-2 mt-2 text-sm font-medium text-white bg-success-light rounded-md shadow"
                >
                  Ok
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Cancelled Dialog -->
  <TransitionRoot v-if="showResponse" as="template" :show="cancelled">
    <Dialog as="div" class="relative z-[700]" @close="cancelled = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full max-w-md p-6 overflow-hidden text-center transition-all transform rounded-lg shadow-xl bg-card-light dark:bg-card-dark"
            >
              <div class="flex flex-col items-center space-y-4">
                <Icon
                  name="ph:x-circle-fill"
                  class="w-12 h-12 text-danger-dark"
                />
                <h3
                  class="text-xl font-semibold text-textPrimary-light dark:text-textPrimary-dark"
                >
                  {{ cancelTitle }}
                </h3>
                <p
                  class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >
                  {{ cancelMsg }}
                </p>
                <button
                  @click.stop="[(cancelled = false), emits('finally', true)]"
                  class="px-4 py-2 mt-2 text-sm font-medium text-white bg-danger-light rounded-md shadow"
                >
                  Ok
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
