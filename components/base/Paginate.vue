<script setup>
import { usePagination } from "vue-composable";
const route = useRoute();

const props = defineProps({
  modelValue: { type: Number, default: () => 1 },
  length: Number,
  disabled: Boolean,
  itemsPerPage: Number,
  totalData: Number,
  offset: Number,
});

const emit = defineEmits(["update:modelValue", "update:offset"]);

const setEvents = () => {
  emit("update:modelValue", pageTracker.value);
  emit("update:offset", offset.value);
};

const totalPages = computed(() => {
  if (props.totalData !== undefined && props.itemsPerPage !== undefined) {
    return Math.ceil(props.totalData / props.itemsPerPage);
  }
  return 0;
});

let pageTracker = ref(
  props.offset === 0
    ? 1
    : props.offset !== undefined
    ? Math.floor(props.offset / props.itemsPerPage) + 1
    : props.modelValue
);

watch(
  () => props.offset,
  () => {
    pageTracker.value = Math.floor(props.offset / props.itemsPerPage) + 1;
  }
);

watch(
  () => props.modelValue,
  () => {
    pageTracker.value = props.modelValue;
  }
);

const offset = computed(() => (pageTracker.value - 1) * props.itemsPerPage);

const pageL1 = computed(() => pageTracker.value === 1);
const page3OR4 = computed(() => [3, 4].includes(pageTracker.value));
const pageBTN = computed(
  () => pageTracker.value >= 5 && pageTracker.value < totalPages.value - 2
);
const pageLASTS = computed(() => pageTracker.value >= totalPages.value - 2);

const firsThree = computed(() => (pageL1.value ? 3 : page3OR4.value ? 5 : 1));
const lasThree = computed(() =>
  pageL1.value
    ? totalPages.value - 2
    : page3OR4.value || pageBTN.value
    ? totalPages.value
    : pageLASTS.value
    ? totalPages.value - 4
    : totalPages.value - 2
);

const middleStart = computed(() => (pageBTN.value ? pageTracker.value - 1 : 0));
const middleEnd = computed(() => (pageBTN.value ? pageTracker.value + 1 : 0));
const middleChecker = computed(() => pageBTN.value);

const toggle = (n) => {
  pageTracker.value = n;
  setEvents();
};

const backward = () => {
  if (pageTracker.value > 1) {
    pageTracker.value--;
    setEvents();
  }
};

const forward = () => {
  if (pageTracker.value < totalPages.value) {
    pageTracker.value++;
    setEvents();
  }
};

const { prev, next } = usePagination({
  currentPage: pageTracker.value,
  pageSize: totalPages.value,
});

const range = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
};

function getLink(page) {
  return "#";
}
</script>

<template>
  <div class="w-full">
    <div
      v-if="totalPages > 0"
      class="flex flex-wrap justify-between pb-2 mx-2 border-t-2 border-borderColor-light dark:border-borderColor-dark"
    >
      <div>
        <a
          :href="getLink(pageTracker - 1)"
          class="relative inline-flex items-center sm:px-2 py-2 text-sm font-medium text-textSecondary-light dark:text-textSecondary-dark hover:text-primary-light dark:hover:text-primary-dark"
          :class="
            pageTracker === 1 || disabled
              ? 'opacity-30 pointer-events-none'
              : ''
          "
          @click.prevent="
            prev();
            backward();
          "
        >
          <Icon name="bi:arrow-left" />
          <span class="ml-5 hidden sm:block">ያለፈ</span>
        </a>
      </div>

      <div
        class="relative z-0 inline-flex -space-x-px -top-0.5"
        aria-label="Pagination"
      >
        <!-- Full pagination if totalPages <= 7 -->
        <a
          v-for="n in totalPages"
          v-show="totalPages <= 7"
          :key="n"
          :href="getLink(n)"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium"
          :class="[
            n === pageTracker
              ? 'z-10 text-primary-light dark:text-primary-dark border-t-2 border-primary-light dark:border-primary-dark'
              : 'text-textSecondary-light dark:text-textSecondary-dark',
            disabled ? 'pointer-events-none opacity-30' : '',
          ]"
          @click.prevent="toggle(n)"
        >
          {{ n }}
        </a>

        <!-- Smart pagination when totalPages > 7 -->
        <template v-if="totalPages > 7">
          <a
            v-for="n in range(1, firsThree)"
            :key="n"
            :href="getLink(n)"
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium"
            :class="[
              n === pageTracker
                ? 'z-10 text-primary-light dark:text-primary-dark border-t-2 border-primary-light dark:border-primary-dark'
                : 'text-textSecondary-light dark:text-textSecondary-dark',
              disabled ? 'pointer-events-none opacity-30' : '',
            ]"
            @click.prevent="toggle(n)"
          >
            {{ n }}
          </a>

          <span
            v-if="middleChecker"
            class="px-2 text-textSecondary-light dark:text-textSecondary-dark"
            >...</span
          >

          <a
            v-for="n in range(middleStart, middleEnd)"
            v-show="pageTracker > 4 && pageTracker < totalPages - 2"
            :key="n"
            :href="getLink(n)"
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium"
            :class="[
              n === pageTracker
                ? 'z-10 text-primary-light dark:text-primary-dark border-t-2 border-primary-light dark:border-primary-dark'
                : 'text-textSecondary-light dark:text-textSecondary-dark',
              disabled ? 'pointer-events-none opacity-30' : '',
            ]"
            @click.prevent="toggle(n)"
          >
            {{ n }}
          </a>

          <span
            class="px-2 text-textSecondary-light dark:text-textSecondary-dark"
            >...</span
          >

          <a
            v-for="n in range(lasThree, totalPages)"
            :key="n"
            :href="getLink(n)"
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium"
            :class="[
              n === pageTracker
                ? 'z-10 text-primary-light dark:text-primary-dark border-t-2 border-primary-light dark:border-primary-dark'
                : 'text-textSecondary-light dark:text-textSecondary-dark',
              disabled ? 'pointer-events-none opacity-30' : '',
            ]"
            @click.prevent="toggle(n)"
          >
            {{ n }}
          </a>
        </template>
      </div>

      <div>
        <a
          :href="getLink(pageTracker + 1)"
          class="relative inline-flex items-center sm:px-2 py-2 text-sm font-medium text-textSecondary-light dark:text-textSecondary-dark hover:text-primary-light dark:hover:text-primary-dark"
          :class="
            pageTracker === totalPages || disabled
              ? 'opacity-30 pointer-events-none'
              : ''
          "
          @click.prevent="
            next();
            forward();
          "
        >
          <span class="mr-5 hidden sm:block">ቀጣይ</span>
          <Icon name="bi:arrow-right" />
        </a>
      </div>
    </div>
  </div>
</template>
