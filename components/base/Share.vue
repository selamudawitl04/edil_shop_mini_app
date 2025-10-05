<script setup>
import { useClipboard } from "@vueuse/core";
import { Icon } from "@iconify/vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true,
  },
  url: {
    type: String,
    default: "",
    required: true,
  },
  text: {
    type: String,
    default: "",
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (value) => {
    props.modelValue = value;
  },
});

const emits = defineEmits(["update:modelValue"]);

const { copy, copied } = useClipboard();
const responseMessage = computed(() => (copied.value ? "Copied" : "."));
const pageUrl = ref("");

onMounted(() => {
  pageUrl.value = `${window.location.href}`.split("?")[0];
});

const openShareInGroupDialog = ref(false);
</script>

<template>
  <BaseDialog v-model="open" title="Share Prayer Request" body-class="max-w-xl">
    <template #content>
      <div class="p-4 md:p-7 dark:bg-secondary-dark-2 w-full max-w-md mx-auto">
        <!-- Social Links -->
        <div class="flex justify-around items-center mt-4">
          <a
            :href="`https://t.me/share/url?url=${pageUrl}${props.url}&text=${props.text}`"
            target="_blank"
            class="flex flex-col gap-2 cursor-pointer items-center text-center"
          >
            <Icon icon="logos:telegram" class="w-10 h-10" />
            <p
              class="text-textSecondary-light dark:text-textSecondary-dark text-xs md:text-sm"
            >
              Telegram
            </p>
          </a>

          <a
            :href="`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}${props.url}`"
            target="_blank"
            class="flex flex-col gap-2 cursor-pointer items-center text-center"
          >
            <Icon icon="logos:facebook" class="w-10 h-10" />
            <p
              class="text-textSecondary-light dark:text-textSecondary-dark text-xs md:text-sm"
            >
              Facebook
            </p>
          </a>

          <a
            :href="`https://twitter.com/intent/tweet?url=${pageUrl}${props.url}&text=${props.text}`"
            target="_blank"
            class="flex flex-col gap-2 cursor-pointer items-center text-center"
          >
            <Icon icon="akar-icons:x-fill" class="w-10 h-10 dark:text-white" />
            <p
              class="text-textSecondary-light dark:text-textSecondary-dark text-xs md:text-sm"
            >
              X
            </p>
          </a>

          <a
            :href="`https://api.whatsapp.com/send?text=${props.text}%20${pageUrl}${props.url}`"
            target="_blank"
            class="flex flex-col gap-2 cursor-pointer items-center text-center"
          >
            <Icon icon="logos:whatsapp-icon" class="w-10 h-10" />
            <p
              class="text-textSecondary-light dark:text-textSecondary-dark text-xs md:text-sm"
            >
              WhatsApp
            </p>
          </a>
        </div>

        <!-- Copy Link -->
        <div
          :title="pageUrl + props.url"
          @click="copy(`${pageUrl}${props.url}`)"
          class="cursor-pointer m-auto border border-secondary-6/10 dark:border-secondary-6 mt-8 md:mt-9 p-2 md:p-3 w-11/12 md:w-3/4 flex justify-between items-center rounded-md"
        >
          <p
            class="text-textSecondary-light truncate dark:text-textSecondary-dark text-sm md:text-base"
          >
            {{ pageUrl }}{{ props.url }}
          </p>
          <button
            class="hover:bg-primary-4 dark:hover:bg-primary-lite p-2 rounded-md"
          >
            <Icon
              icon="ant-design:copy-outlined"
              class="w-5 h-5 dark:text-white"
            />
          </button>
        </div>

        <!-- Copy Feedback -->
        <div class="w-full text-center mt-4">
          <p class="text-xs text-primary-light dark:text-primary-dark">
            {{ responseMessage }}
          </p>
        </div>

        <!-- ----------------------------Share in Group------------------------- -->

        <p
          class="text-base md:text-lg font-body text-primary-light dark:text-primary-dark"
        >
          Share In Group
        </p>
      </div>
    </template>
  </BaseDialog>
</template>
