import { defineStore } from "pinia";

export const useDevotionStore = defineStore("devotion", {
  state: () => ({
    devotionId: null,
    showDevotion: false,
    devotionSeriesId: null,
    showDevotionSeries: false,
    showSeriesOnDevotionDetail: true,
  }),

  actions: {
    openDevotion(devotionId, showSeriesOnDevotionDetail = true) {
      this.devotionId = devotionId;
      this.showDevotion = true;
      this.showSeriesOnDevotionDetail = showSeriesOnDevotionDetail;
    },
    closeDevotion() {
      this.showDevotion = false;
      this.devotionId = null;
    },
    openDevotionSeries(devotionSeriesId) {
      this.devotionSeriesId = devotionSeriesId;
      this.showDevotionSeries = true;

      console.log("devotionSeriesId", devotionSeriesId);
    },
    closeDevotionSeries() {
      this.showDevotionSeries = false;
      this.devotionSeriesId = null;
    },
  },
});
