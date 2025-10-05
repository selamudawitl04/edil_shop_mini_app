<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ref, computed } from "vue";

const emits = defineEmits(["update:modelValue", "ok"]);
const props = defineProps({
  modelValue: Boolean,

  autoClose: Boolean,

  resultType: {
    type: String,
    default: "success",
  },

  confirmTitle: { type: String, default: "Confirmed" },
  confirmMsg: { type: String, default: "Your action was confirmed." },
  cancelTitle: { type: String, default: "Cancelled" },
  cancelMsg: { type: String, default: "Your action was cancelled." },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});
</script>

<template>
  <!-- Confirmed Dialog -->
  <TransitionRoot v-if="resultType == 'success'" as="template" :show="open">
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
                  @click="emits('ok')"
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
  <TransitionRoot v-if="resultType == 'error'" as="template" :show="open">
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
                  @click="emits('ok')"
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
