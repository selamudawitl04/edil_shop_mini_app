import { defineStore } from "pinia";

export const useTestimonyStore = defineStore("testimony", {
  state: () => ({
    // Detail dialog
    showTestimony: false,
    selectedTestimonyId: null,

    create: {
      open: false,
      prayerRequestId: null,
      communityId: null,
      communityType: null,
      role: null,
      isPrivateGroup: false,
    },
  }),

  actions: {
    // Detail dialog actions
    openTestimony(testimonyId) {
      this.selectedTestimonyId = testimonyId;
      this.showTestimony = true;
    },

    closeTestimony() {
      this.showTestimony = false;
      this.selectedTestimonyId = null;
    },

    openCreate({
      prayerRequestId = null,
      communityId = null,
      communityType = null,
      role = null,
      isPrivateGroup = false,
    }) {
      this.create.open = true;
      this.create.prayerRequestId = prayerRequestId;
      this.create.communityId = communityId;
      this.create.communityType = communityType;
      this.create.role = role;
      this.create.isPrivateGroup = isPrivateGroup;
    },

    closeCreate() {
      this.create.open = false;
      this.create.prayerRequestId = null;
      this.create.communityId = null;
      this.create.communityType = null;
      this.create.role = null;
      this.create.isPrivateGroup = false;
    },
  },
});
