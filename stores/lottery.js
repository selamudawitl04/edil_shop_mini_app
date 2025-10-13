import { defineStore } from "pinia";

export const useLotteryStore = defineStore("lottery", {
  state: () => ({
    // Detail dialog
    showLottery: false,
    selectedLotteryId: null,
    selectedLotteryTab: "tickets",
  }),

  actions: {
    // Detail dialog actions
    openLottery(lotteryId, tab = "tickets") {
      this.selectedLotteryId = lotteryId;
      this.showLottery = true;
      this.selectedLotteryTab = tab;
    },

    closeLottery() {
      this.showLottery = false;
      this.selectedLotteryId = null;
      this.selectedLotteryTab = "tickets";
    },
  },
});
