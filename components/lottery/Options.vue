<script setup>
const props = defineProps({
  lottery: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["deleteDone"]);
const openDeleteLotteryDialog = ref(false);
const openSuspendLotteryDialog = ref(false);
const openCloseLotteryDialog = ref(false);
const openUpdateLotteryDialog = ref(false);
const openStartLotteryDialog = ref(false);
const openAddWinnerDialog = ref(false);
</script>

<template>
  <!-- <LotteryAddWinnerDialog :lottery="lottery" v-model="openAddWinnerDialog" /> -->

  <LotteryDeleteDialog
    v-if="lottery && openDeleteLotteryDialog"
    v-model="openDeleteLotteryDialog"
    :lottery="lottery"
    @deleteDone="emit('deleteDone')"
  />

  <LotteryUpdateDialog
    v-if="lottery && openUpdateLotteryDialog"
    v-model="openUpdateLotteryDialog"
    :lottery="lottery"
  />

  <LotteryStartLotteryDialog
    v-if="lottery && openStartLotteryDialog"
    v-model="openStartLotteryDialog"
    :lottery="lottery"
  />

  <HeadlessPopover class="relative inline-block text-left">
    <HeadlessPopoverButton
      class="p-2 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition"
    >
      <Icon
        name="mi:options-vertical"
        size="22"
        class="text-textPrimary-light dark:text-textPrimary-dark"
      />
    </HeadlessPopoverButton>

    <HeadlessPopoverPanel
      class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50"
    >
      <div
        class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark"
      >
        <!-- Update Lottery -->
        <button
          @click.stop="openUpdateLotteryDialog = true"
          v-if="lottery.status === 'pending'"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md text-blue-600 dark:text-blue-400"
        >
          <Icon name="mdi:pencil-outline" class="w-4 h-4" />
          ሎተሪ አሻሽል
        </button>

        <!-- Start Lottery -->

        <button
          v-if="lottery.status === 'pending'"
          @click.stop="openStartLotteryDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md text-green-600 dark:text-green-400"
        >
          <Icon name="mdi:play-circle-outline" class="w-4 h-4" />
          ሎተሪ አስጀምር
        </button>

        <!-- Delete Lottery -->
        <button
          v-if="lottery.status === 'pending'"
          @click.stop="openDeleteLotteryDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md text-red-600 dark:text-red-400"
        >
          <Icon name="mdi:delete-outline" class="w-4 h-4" />
          ሎተሪ አጥፋ
        </button>

        <!-- Suspend Lottery (Warning) -->
        <!-- <button
          v-if="lottery.status === 'active'"
          @click.stop="openSuspendLotteryDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-100 dark:hover:bg-red-800 transition rounded-md text-red-600 dark:text-red-400"
        >
          <Icon name="mdi:pause-circle-outline" class="w-4 h-4" />
          ሎተሪ አቁም
        </button> -->

        <!-- Close Lottery (Confirm) -->
        <!-- <button
          v-if="lottery.status === 'active'"
          @click.stop="openAddWinnerDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-green-100 dark:hover:bg-green-800 transition rounded-md text-green-600 dark:text-green-400"
        >
          <Icon name="mdi:close-outline" class="w-4 h-4" />
          ሎተሪ ዝጋ
        </button> -->
      </div>
    </HeadlessPopoverPanel>
  </HeadlessPopover>
</template>
