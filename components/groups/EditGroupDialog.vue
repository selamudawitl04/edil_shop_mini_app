<script setup>
import updateQuery from "@/graphql/groups/update_group.gql";
import { useToast } from "vue-toast-notification";

const { handleSubmit } = useForm();
const toast = useToast();

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  group: {
    type: Object,
    required: true,
  },
  myRoleForGroup: {
    type: Object,
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
const refetchGroup = inject("refetchGroup");
const refetchGroups = inject("refetchGroups");

const form = reactive({
  name: props.group.name || "",
  description: props.group.description || "",
  language: props.group.language_code || "en",
  categories: props.group.group_categories?.map(gc => gc.category_id) || [],
  visibility: props.group.invite_only ? "hidden" : props.group.is_private ? "private" : "public",
  settings: {
    allowMembersToInvite: props.group.allow_members_to_invite_other || false,
    autoApproveMembers: props.group.auto_approve_members || false,
    allowMembersToCreatePrayerRequest:
      props.group.allow_members_to_create_request || true,
    allowMembersToCreateDevotion: props.group.allow_members_to_create_devotion || false,
    allowMembersToCreateTestimony: props.group.allow_members_to_create_testimony || false,
  },
});

const hasChanges = computed(() => {
  // Get original category IDs
  const originalCategoryIds = props.group.group_categories?.map(gc => gc.category_id) || [];

  // Check if categories have changed
  const categoriesChanged = JSON.stringify(form.categories.sort()) !== JSON.stringify(originalCategoryIds.sort());

  return (
    form.name !== (props.group.name || "") ||
    form.description !== (props.group.description || "") ||
    form.language !== (props.group.language_code || "en") ||
    form.visibility !== (props.group.invite_only ? "hidden" : props.group.is_private ? "private" : "public") ||
    form.settings.allowMembersToInvite !==
    (props.group.allow_members_to_invite_other || false) ||
    form.settings.autoApproveMembers !==
    (props.group.auto_approve_members || false) ||
    form.settings.allowMembersToCreatePrayerRequest !==
    (props.group.allow_members_to_create_request || true) ||
    form.settings.allowMembersToCreateDevotion !==
    (props.group.allow_members_to_create_devotion || false) ||
    form.settings.allowMembersToCreateTestimony !==
    (props.group.allow_members_to_create_testimony || false) ||
    categoriesChanged
  );
});

// GraphQL: Update Group
const { mutate, onDone, loading } = mutator(updateQuery, {
  clientId: "auth",
  role: props.myRoleForGroup.role || "group:owner", // Assuming user will join as a regular members
});

const onSubmit = handleSubmit(async () => {
  const input = {
    name: form.name,
    description: form.description,
    language_code: form.language,
    is_private: form.visibility != "private", // both private and hidden group are private
    allow_members_to_create_request: form.settings.allowMembersToCreatePrayerRequest,
    allow_members_to_create_devotion: form.settings.allowMembersToCreateDevotion,
    allow_members_to_create_testimony: form.settings.allowMembersToCreateTestimony,
  };

  if (form.visibility == "private") {
    // private groups
    input.invite_only = false;
    input.allow_members_to_invite_other = form.settings.allowMembersToInvite;
    input.auto_approve_members = true;
    input.allow_members_to_invite_other = form.settings.allowMembersToInvite;
  } else if (form.visibility == "hidden") {
    input.invite_only = true; // hidden(invite_only && private)
    input.allow_members_to_invite_other = false; // hidden(invite_only && private)
  } else {
    // public groups
    input.auto_approve_members = true;
    input.allow_members_to_invite_other = true;
  }

  // Prepare category input for the single mutation
  const categoryInput = form.categories && form.categories.length > 0
    ? form.categories.map(categoryId => ({
      group_id: props.group.id,
      category_id: categoryId
    }))
    : []; // Empty array to ensure all categories are deleted

  // Single mutation that handles both group update and category changes
  await mutate({
    id: props.group.id,
    input,
    category_input: categoryInput
  });
});

onDone(({ data }) => {
  const newRequest = data?.update_prayer_groups_by_pk;
  if (newRequest) {
    toast.success("Prayer groups updated successfully!", {
      position: "top-right",
    });
    if (typeof refetchGroup === "function") {
      refetchGroup();
    }

    if (typeof refetchGroups === "function") {
      refetchGroups();
    }
  } else {
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });
  }

  open.value = false;
});
</script>

<template>
  <BaseDialog v-model="open" title="Edit Group" :loading="loading" @close="open = false">
    <template #content>
      <div class="max-w-3xl mx-auto">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <BaseInput id="name" name="name" label="Name" v-model="form.name" placeholder="Group name"
              rules="required" />
          </div>

          <!-- ----------------Language-------- -->
          <div>
            <SelectLanguage v-model="form.language" label="Language" rules="required" />
          </div>

          <!-- Description -->

          <div>
            <BaseTextInput id="description" name="description" label="Description" v-model="form.description"
              placeholder="Enter a short description for your prayer request" rules="required" />
          </div>



          <!-- Categories -->
          <div class="mb-6">
            <GroupsCreateCategories :show-navigation="false" v-model="form.categories" />
          </div>

          <!-- -------------------Group Settings---------- -->

          <div class="space-y-6">
            <!-- Group Visibility -->
            <div
              class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4">
              <div class="mb-4">
                <h3 class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                  🔒 Group Visibility & Privacy
                </h3>
                <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                  Choose how your prayer group will be visible and accessible to others
                </p>
              </div>

              <div class="space-y-3">
                <!-- Public Option -->
                <label
                  class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': form.visibility === 'public' }">
                  <input type="radio" value="public" v-model="form.visibility"
                    class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🌍
                        Public</span>
                      <span
                        class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">Recommended</span>
                    </div>
                    <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                      Visible to everyone. Anyone can find and join your group without approval. Great for open prayer
                      communities.
                    </p>
                  </div>
                </label>

                <!-- Private Option -->
                <label
                  class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': form.visibility === 'private' }">
                  <input type="radio" value="private" v-model="form.visibility"
                    class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🔐
                        Private</span>
                      <span
                        class="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">Controlled</span>
                    </div>
                    <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                      Visible to everyone but requires invitation or approval to join. Perfect for selective prayer
                      groups.
                    </p>
                  </div>
                </label>

                <!-- Hidden Option -->
                <label
                  class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': form.visibility === 'hidden' }">
                  <input type="radio" value="hidden" v-model="form.visibility"
                    class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🕵️
                        Hidden</span>
                      <span
                        class="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">Exclusive</span>
                    </div>
                    <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                      Not visible to non-members and excluded from search. Only invited users can find and join.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Group Settings -->
            <div v-if="
              form.visibility === 'private' || form.visibility === 'public'
            "
              class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4">
              <div class="mb-4">
                <h3 class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                  ⚙️ Group Settings & Permissions
                </h3>
                <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                  Configure how members can interact with your prayer group
                </p>
              </div>

              <div class="space-y-4">
                <!-- Left column: Private-only options -->
                <div v-if="form.visibility === 'private'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                    <label class="flex items-start space-x-3 cursor-pointer">
                      <input type="checkbox" v-model="form.settings.allowMembersToInvite"
                        class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                      <div>
                        <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                          👥 Allow member invitations
                        </span>
                        <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                          Let current members send invitations to others
                        </p>
                      </div>
                    </label>
                  </div>

                  <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                    <label class="flex items-start space-x-3 cursor-pointer">
                      <input type="checkbox" v-model="form.settings.autoApproveMembers"
                        class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                      <div>
                        <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                          ✅ Auto-approve members
                        </span>
                        <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                          Automatically approve join requests without admin review
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Right column: Shared options for all visibility types -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                    <label class="flex items-start space-x-3 cursor-pointer">
                      <input type="checkbox" v-model="form.settings.allowMembersToCreatePrayerRequest"
                        class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                      <div>
                        <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                          🙏 Allow prayer requests
                        </span>
                        <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                          Members can create and share prayer requests directly to this group
                        </p>
                      </div>
                    </label>
                  </div>

                  <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                    <label class="flex items-start space-x-3 cursor-pointer">
                      <input type="checkbox" v-model="form.settings.allowMembersToCreateDevotion"
                        class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                      <div>
                        <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                          🛐 Allow devotions
                        </span>
                        <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                          Members can create and share devotions directly to this group
                        </p>
                      </div>
                    </label>
                  </div>

                  <div class="p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg">
                    <label class="flex items-start space-x-3 cursor-pointer">
                      <input type="checkbox" v-model="form.settings.allowMembersToCreateTestimony"
                        class="mt-1 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                      <div>
                        <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                          ✍️ Allow testimonies
                        </span>
                        <p class="text-xs mt-1 text-textSecondary-light dark:text-textSecondary-dark">
                          Members can create and share testimonies directly to this group
                        </p>
                      </div>
                    </label>
                  </div>


                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <BaseButton :loading="loading" :disabled="loading || !hasChanges">
            <span class="text-white" v-if="!loading"> Submit</span>
            <span class="text-white" v-else>Loading...</span>
          </BaseButton>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>
