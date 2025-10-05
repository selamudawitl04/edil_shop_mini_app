import { useToast } from "vue-toast-notification";
import updateQuery from "@/graphql/prayers/update_prayer_request_engagement.gql";

export default async function (prayer_request_id, selectedGroup, description) {
  const toast = useToast();
  const { mutate, onError, onDone } = useMutation(updateQuery, () => ({
    fetchPolicy: "network-only",
    clientId: "default",
  }));

  const input = {
    prayer_request_id,
  };

  mutate({
    input,
  });

  onDone(({ data }) => {
    toast.success("✅ Prayer request successfully shared!", {
      position: "top-right",
    });
  });

  // Handle errors
  onError((error) => {
    console.log("There is error on updatePrayerRequestEngagement.js");
  });
}
