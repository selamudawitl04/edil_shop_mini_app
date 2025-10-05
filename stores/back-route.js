import { defineStore } from "pinia";

export const useBackStore = defineStore({
  id: "backRoute",
  state: () => {
    return {
      path: null,
      query: null,
      name: " Selamu dawit selemon",
    };
  },

  getters: {
    getPath() {
      return this.path;
    },
    getQuery() {
      return this.query;
    },
  },

  actions: {
    setRoute(path, query = null) {
      this.path = path;
      this.query = query;
    },

    resetRoute() {
      this.path = null;
      this.query = null;
    },
  },
  persist: true,
});
