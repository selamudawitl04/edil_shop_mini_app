<script setup>
import { onClickOutside } from "@vueuse/core";
import { useField } from "vee-validate";

const props = defineProps({
  modelValue: {
    type: [String, Array, Object],
  },
  name: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: [],
  },
  returnBy: {
    type: String,
  },
  showBy: {
    type: String,
  },
  chipsStyle: {
    type: String,
    required: false,
  },
  init: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Search",
  },
  loading: {
    type: Boolean,
    default: false,
    required: false,
  },
  value: {
    type: String,
    default: "id",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  trailingIcon: {
    type: Function,
    default: "ion:chevron-down-outline",
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  listClass: {
    type: String,
  },
  deletedItem: {
    type: String,
  },
  showError: {
    type: Boolean,
    default: true,
  },
});

const chips = ref([]);
const show = ref(false);
const search = ref(undefined);
const selected = ref({});
const set = ref(true);
const list_select = ref(null);

const emit = defineEmits(["update:modelValue", "update:selected", "search"]);

//=================== functions ============================

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const select = (val) => {
  selected.value[val[props.value]] = !selected.value[val[props.value]];
  if (!Object.values(selected.value).includes(false)) {
    chips.value.push(val);
    inputValue.value = chips.value.map((chip) => chip.id);
  } else {
    delete selected.value[val.id];
    chips.value = chips.value.filter((e) => e.id != val.id);
    inputValue.value = chips.value.map((chip) => chip.id);
  }
  if (chips.value && chips.value.length) {
    emit(
      "update:modelValue",
      chips.value.map((chip) => chip.id)
    );
  } else {
    emit("update:modelValue", undefined);
    inputValue.value = undefined;
  }
};

const queryList = () => {
  emit("search", search.value);
};

if (props.init && props.init[0]) {
  chips.value = [
    ...new Map(props.init.map((item) => [item[props.value], item])).values(),
  ];
  for (const val of chips.value) {
    selected.value[val[props.value]] = !selected.value[val[props.value]];
  }

  if (chips.value && chips.value.length) {
    emit(
      "update:modelValue",
      chips.value.map((chip) => chip.id)
    );
  } else {
    emit("update:modelValue", undefined);
  }
}

const deleteChip = (index) => {
  let id = chips.value[index].id;
  chips.value.splice(index, 1);
  delete selected.value[id];
  if (chips.value?.length < 1) {
    inputValue.value = chips.value;
  }
  if (chips.value && chips.value.length) {
    emit(
      "update:modelValue",
      chips.value.map((chip) => chip.id)
    );
  } else {
    emit("update:modelValue", undefined);
    inputValue.value = undefined;
  }
};

onClickOutside(list_select, (e) => (show.value = false));
</script>

<template>
  <div class="w-full relative">
    <div
      :class="[
        errorMessage
          ? 'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500'
          : 'focus:ring-primary  focus:border-primary hover:border-primary border-primarySb-lite-1 border-1 ',
        'flex flex-wrap items-center bg-white relative pr-7 rounded-md py-1 px-2 gap-1 border-[1px]',
        chips.length ? '' : 'h-10',
      ]"
      @click="show = true"
    >
      <div
        class="flex justify-center items-center break-words"
        :class="[chipsStyle || 'px-1 bg-gray-200']"
        v-for="(chip, i) of chips"
        :key="chip.label"
      >
        <span
          class="break-words whitespace-pre-wrap w-full flex flex-wrap overflow-hidden text-sm"
        >
          {{ chip.name }}
        </span>
        <Icon
          name="ion:close-outline"
          class="ml-1 w-4 h-4 hover:cursor-pointer hover:text-primary"
          @click="deleteChip(i)"
          >clear</Icon
        >
      </div>
      <h1 v-if="!chips.length" class="text-sm text-gray-400">
        {{ placeholder }}
      </h1>
      <div
        v-if="trailingIcon"
        class="absolute inset-y-0 right-0 pr-1 flex items-center pointer-events-none ml-2"
        @click="show = true"
      >
        <Icon :name="trailingIcon" class="h-5 w-5 text-gray-400 ml-2" />
      </div>
    </div>
    <ul
      ref="list_select"
      v-show="show"
      class="absolute z-10 w-full bg-white border border-primary shadow max-h-56 rounded-b-md text-base overflow-auto"
      :class="[listClass || '']"
    >
      <li class="h-1">
        <h-progress
          v-if="loading"
          class="rounded-xl w-full"
          color1="bg-primary-lite"
          color2="bg-primary"
          color3="bg-primary-dark"
          height="h-1"
        ></h-progress>
      </li>
      <li class="px-2 border-b pb-2">
        <input
          class="flex-1 focus:ring-0 focus:outline-none flex min-w-20 rounded-md border-primary border-2 w-full p-1"
          name="select"
          @click="show = true"
          v-model="search"
          @input="queryList"
          @blur="outside"
          :placeholder="placeholder"
          :disabled="false"
        />
      </li>
      <li
        v-for="item in items"
        @click="select(item)"
        :class="[multiple && selected[item[value]] ? 'bg-primary/20' : '']"
        class="border-b select-none relative py-3 px-3 hover:bg-primary/30 text-gray-600 cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <span class="text-gray-600 font-semibold block truncate">
            {{ item[showBy] }}
          </span>
          <Icon
            name="ic:round-check"
            v-if="multiple && selected[item[value]]"
            class="w-5 h-5 text-gray-600"
          />
        </div>
      </li>
    </ul>
    <p
      :visible="errorMessage"
      class="mt-2 text-sm text-red-600"
      v-if="showError"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
<style scoped>
/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px white;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #002f6c;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #002f6c;
}
</style>
