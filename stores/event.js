import { defineStore } from "pinia";

export const useEventStore = defineStore("event", {
  state: () => ({
    // Detail dialog
    showEvent: false,
    selectedEventId: null,
    create: {
      open: false,
      communityId: null,
      communityType: null,
      role: null,
      isPrivateGroup: false,
    },
  }),

  actions: {
    // Detail dialog actions
    openEvent(eventId) {
      this.selectedEventId = eventId;
      this.showEvent = true;
    },

    closeEvent() {
      this.showEvent = false;
      this.selectedEventId = null;
    },

    openCreate({ communityId = null, communityType = null, role = null, isPrivateGroup = false }) {
      this.create.open = true;
      this.create.communityId = communityId;
      this.create.communityType = communityType;
      this.create.role = role;
      this.create.isPrivateGroup = isPrivateGroup;
    },

    closeCreate() {
      this.create.open = false;
      this.create.communityId = null;
      this.create.communityType = null;
      this.create.role = null;
      this.create.isPrivateGroup = false;
    },
  },
});
