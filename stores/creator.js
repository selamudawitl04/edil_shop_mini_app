import { defineStore } from "pinia";

export const useCreatorStore = defineStore("creator", {
  state: () => ({
    // Detail dialog
    showCreator: false,
    selectedCreatorId: null,
  }),

  actions: {
    // Detail dialog actions
    openCreator(creatorId) {
      this.selectedCreatorId = creatorId;
      this.showCreator = true;
    },

    closeCreator() {
      this.showCreator = false;
      this.selectedCreatorId = null;
    },
  },
});
