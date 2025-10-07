import { defineStore } from "pinia";

export const useBackStore = defineStore({
  id: "backRoute",
  state: () => {
    return {
      route: null,
    };
  },

  getters: {
    getRoute() {
      return this.route;
    },
  },

  actions: {
    setRoute(route) {
      this.route = route;
    },

    resetRoute() {
      this.route = null;
    },
  },
  persist: true,
});
