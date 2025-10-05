import { useToast } from "vue-toast-notification";
import useError from "@/utils/error";

const { extract } = useError();
const toast = useToast();

let defaultClient = "auth";
let defaultRole = "user";

export default function (
  query,
  { clientId = defaultClient, role = defaultRole, showError = true }
) {
  const { mutate, onDone, loading, onError } = useMutation(query, () => ({
    fetchPolicy: "network-only",
    clientId: clientId,
    context: {
      headers: {
        "x-hasura-role": role || "user",
      },
    },
  }));

  onError((error) => {
    if (showError) {
      toast.error(extract(error) || "ችግር ተፈጥርዋል።", {
        position: "top-right",
        duration: 5000,
        pauseOnHover: true,
      });
    }
  });
  return {
    mutate,
    loading,
    onDone,
    onError,
  };
}
