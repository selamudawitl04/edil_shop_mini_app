<template>
  <!-- እጣ አጠቃላይ መረጃ -->
  <div class="">
    <!-- -----------------Medias Section----------------- -->

    <LotteryDetailMedias :lottery="lottery" />

    <!-- ----------------Lottery Info Section----------------- -->

    <div class="space-y-4 mb-6 mt-4">
      <div
        class="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-4 lg:p-6 border border-borderColor-light dark:border-borderColor-dark"
      >
        <!-- Card Title -->
        <h2
          class="text-xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-5"
        >
          የእጣ መረጃ
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- ስታቲስቲክስ Section -->
          <div class="space-y-4">
            <div class="flex justify-between">
              <span
                class="text-textSecondary-light dark:text-textSecondary-dark"
              >
                ጠቅላላ ትኬቶች
              </span>
              <span
                class="font-semibold text-textPrimary-light dark:text-textPrimary-dark"
              >
                {{ lottery.total_tickets?.toLocaleString() }}
              </span>
            </div>
            <div class="flex justify-between">
              <span
                class="text-textSecondary-light dark:text-textSecondary-dark"
              >
                የተሸጡ ትኬቶች
              </span>
              <span
                class="font-semibold text-textPrimary-light dark:text-textPrimary-dark"
              >
                {{ lottery.total_sold_tickets?.toLocaleString() }}
              </span>
            </div>
            <div class="flex justify-between">
              <span
                class="text-textSecondary-light dark:text-textSecondary-dark"
              >
                የልተሸጡ ትኬቶች
              </span>
              <span
                class="font-semibold text-textPrimary-light dark:text-textPrimary-dark"
              >
                {{
                  (
                    lottery.total_tickets - lottery.total_sold_tickets
                  )?.toLocaleString()
                }}
              </span>
            </div>
            <div class="flex justify-between">
              <span
                class="text-textSecondary-light dark:text-textSecondary-dark"
              >
                የአንድ የትኬት ዋጋ
              </span>
              <span
                class="font-semibold text-textPrimary-light dark:text-textPrimary-dark"
              >
                {{ lottery?.price_per_ticket }} ብር
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span
                class="text-textSecondary-light dark:text-textSecondary-dark"
              >
                የእጣ ሁኔታ
              </span>
              <span
                :class="statusColorAndName?.color"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ statusColorAndName?.name }}
              </span>
            </div>
            <div class="flex justify-between">
              <span
                class="text-textSecondary-light dark:text-textSecondary-dark"
              >
                እጣው የሚዎጣበት
              </span>
              <span
                class="font-semibold text-textPrimary-light dark:text-textPrimary-dark"
              >
                {{ getLotteryFinalTimeText(lottery?.final_time) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ------------------But tickect button----------------------- -->

      <BaseButton
        v-if="
          lottery.status === 'active' &&
          lottery.total_tickets - lottery.total_sold_tickets > 0
        "
        @click="emit('buyTicket')"
      >
        ትኬት ለመግዛት ይንኩ
      </BaseButton>

      <LotteryDetailWinners :lottery="lottery" />

      <!-- እቃዎች እና እጣ ውሎች -->

      <!-- ማብራሪያ -->
      <div
        v-if="lottery.description"
        class="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-4 lg:p-6 border border-borderColor-light dark:border-borderColor-dark"
      >
        <h2
          class="text-xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-4"
        >
          የእጣ ማብራሪያ
        </h2>
        <div v-html="lottery?.description"></div>
      </div>

      <!-- የእጣ ባለቤት መረጃ -->

      <LotteryDetailCreator :user="lottery.user" />

      <!-- የእጣ መረጃ -->

      <LotteryDetailSocialMedias :lottery="lottery" />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["buyTicket"]);
const props = defineProps({
  lottery: { type: Object, required: true },
});

const statusColorAndName = computed(() => {
  switch (props.lottery.status) {
    case "active":
      return { color: "text-green-500/90 ", name: "አልውጣም" }; // running
    case "pending":
      return { color: "text-yellow-500/90 ", name: "ያልተጀመረ" }; // not started
    case "closed":
      return { color: "text-red-500/90 ", name: "ዎቱዋል" }; // completed
    case "finished":
      return {
        color: "text-blue-600/90 ",
        name: "ተጠናቀቀ - ማረጋገጫ በመጠባበቅ ላይ",
      }; // submitted, awaiting approval
    case "suspended":
      return { color: "text-orange-500/90 ", name: "ቆሟል" }; // paused
    default:
      return { color: "text-gray-500/90 ", name: "ያልታወቀ" }; // unknown
  }
});

function getLotteryFinalTimeText(finalTime) {
  if (!finalTime) {
    return "የእጣው ሁሉም ትኬቶች ሲሸጡ";
  }

  // Ensure finalTime is a Date object
  const targetTime = new Date(finalTime);
  if (isNaN(targetTime)) {
    return "የተሳሳተ ቀን ተሰጥቷል"; // Invalid date
  }

  const now = new Date();
  const difference = targetTime - now; // milliseconds

  if (difference <= 0) {
    return "የእጣው ሁሉም ትኬቶች ሲሸጡ"; // Already passed
  }

  const differenceInMinutes = Math.floor(difference / 1000 / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 1) {
    return `ቀሪ ደቂቃ: ${differenceInMinutes} ደቂቃ`;
  }

  // Format as "day/month/year hour:minute"
  const day = targetTime.getDate().toString().padStart(2, "0");
  const month = (targetTime.getMonth() + 1).toString().padStart(2, "0");
  const year = targetTime.getFullYear();
  const hour = targetTime.getHours().toString().padStart(2, "0");
  const minute = targetTime.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minute}`;
}
</script>
