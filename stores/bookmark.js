import { defineStore } from "pinia";
import getBookmarkedPrayersQuery from "@/graphql/prayers/bookmarked_prayer_request_list.gql";

export const useBookmarkStore = defineStore("bookmark", {
  state: () => ({
    prayer_requests: [],
  }),

  getters: {
    prayerRequests(state) {
      return state.prayer_requests;
    },
  },

  actions: {
    setBookmarkedPraye() {
      const { onResult } = queryList(getBookmarkedPrayersQuery, {
        clientId: "auth",
      });
      onResult(({ data }) => {
        if (data.bookmarked_prayers) {
          this.prayer_requests = data.bookmarked_prayers;
        }
      });
    },

    // book
    book(input) {
      this.prayer_requests.push(input);
    },

    // unbook
    unbook(id) {
      this.prayer_requests = this.prayer_requests.filter(
        (item) => item.id !== id
      );
    },
  },
});
