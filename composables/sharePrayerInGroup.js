import { useToast } from "vue-toast-notification";
import addQuery from "@/graphql/groups/share_prayer_in_group.gql";
import { useShareStore } from "@/stores/share";

const toast = useToast();
export default async function (prayer_request_id, selectedGroup, description) {
  const shareStore = useShareStore();
  const { mutate, onError, onDone } = useMutation(addQuery, () => ({
    fetchPolicy: "network-only",
    clientId: "auth",
    context: {
      headers: {
        "x-hasura-role": selectedGroup.value?.role || "user",
      },
    },
  }));

  const input = {
    prayer_request_id,
    group_id: selectedGroup.value.group.id,
    description: description.value, // Assuming description is part of the group selection
  };

  mutate({
    input,
  });

  onDone(({ data }) => {
    if (data.insert_group_prayer_shares_one) {
      toast.success("✅ Prayer request successfully shared!", {
        position: "top-right",
      });

      selectedGroup.value = null; // Reset the selected group after sharing
      description.value = ""; // Reset the description input

      shareStore.closeShareInGroupDialog();
      shareStore.closeShareDialog();
    }
  });

  // Handle errors
  onError((error) => {
    if (error.message?.includes("Uniqueness violation")) {
      toast.error("⚠️ This prayer request is already shared in the group.", {
        position: "top-right",
      });
    } else {
      toast.error("❌ Failed to share prayer request. Please try again.", {
        position: "top-right",
      });
    }
  });
}
