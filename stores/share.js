import { defineStore } from "pinia";

export const useShareStore = defineStore("share", {
  state: () => ({
    openShareDialog: false,
    openShareInGroupDialog: false,
    feed: null,
  }),

  actions: {
    shareFeed(feed) {
      this.feed = feed;
      this.openShareDialog = true;
    },

    shareFeedInGroup(feed) {
      this.feed = feed;
      this.openShareDialog = false;
      this.openShareInGroupDialog = true;
    },

    closeShareDialog() {
      this.openShareDialog = false;
      this.feed = null;
    },
    closeShareInGroupDialog() {
      this.openShareInGroupDialog = false;
      this.openShareDialog = true;
      this.feed = null;
    },
  },
});
