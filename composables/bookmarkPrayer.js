import { useToast } from "vue-toast-notification";
import useError from "@/utils/error";
import bookQuery from "@/graphql/prayers/book_request.gql";
import unBookQuery from "@/graphql/prayers/un_book_request.gql";
import { useBookmarkStore } from "~/stores/bookmark";

const { extract } = useError();
const toast = useToast();

export default async function (prayer_request_id, isBookmarked = false) {
  const bookmarkStore = useBookmarkStore();

  const { mutate: bookMutate, onDone: bookDone } = useMutation(
    bookQuery,
    () => ({
      fetchPolicy: "network-only",
      clientId: "auth",
    })
  );

  const { mutate: unBookMutate, onDone: unBookDone } = useMutation(
    unBookQuery,
    () => ({
      fetchPolicy: "network-only",
      clientId: "auth",
    })
  );

  if (isBookmarked) {
    const id = bookmarkStore.prayerRequests.find(
      (x) => x.prayer_request_id === prayer_request_id
    )?.id;

    unBookMutate({ id });
  } else {
    const bookInput = {
      prayer_request_id,
    };

    bookMutate({
      input: bookInput,
    });
  }

  bookDone(({ data }) => {
    if (data.insert_bookmarked_prayers_one?.prayer_request_id) {
      bookmarkStore.book(data.insert_bookmarked_prayers_one);
    }
  });

  unBookDone(({ data }) => {
    if (data.delete_bookmarked_prayers_by_pk?.id) {
      bookmarkStore.unbook(data.delete_bookmarked_prayers_by_pk?.id);
    }
  });
}
