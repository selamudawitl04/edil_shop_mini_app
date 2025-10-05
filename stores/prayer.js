import { defineStore } from "pinia";

export const usePrayerStore = defineStore("prayer", {
  state: () => ({
    filter: {},
    prayerRequestId: null,
    showPrayerRequest: false,
    prayerEditToken: null,
  }),

  actions: {
    openPrayerRequest(prayerRequestId, editToken = null) {
      this.prayerRequestId = prayerRequestId;
      this.prayerEditToken = editToken;
      this.showPrayerRequest = true;
    },
    closePrayerRequest() {
      this.showPrayerRequest = false;
      this.prayerRequestId = null;
      this.prayerEditToken = null;
    },
  },
});
