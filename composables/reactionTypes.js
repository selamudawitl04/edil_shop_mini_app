export const useReactionTypes = () => {
  const devotionReactions = [
    { name: "love", iconText: "❤️" },
    { name: "amen", iconText: "🙏" },
    { name: "blessed", iconText: "✨" },
    { name: "prayed", iconText: "🛐" },
  ];

  const prayerRequestReactions = [
    { name: "love", iconText: "❤️" },
    { name: "shalom", iconText: "🤲" },
    { name: "will pray", iconText: "📅" },
    { name: "prayed", iconText: "🛐" },
  ];

  const testimonyReactions = [
    { name: "love", iconText: "❤️" },
    { name: "shalom", iconText: "🤲" },
    { name: "will pray", iconText: "📅" },
    { name: "prayed", iconText: "🛐" },
  ];

  const getReactionTypes = (contentType) => {
    switch (contentType) {
      case "devotion":
        return devotionReactions;
      case "prayer_request":
        return prayerRequestReactions;
      case "testimony":
        return testimonyReactions;
      default:
        return devotionReactions; // fallback to devotion reactions
    }
  };

  return {
    devotionReactions,
    prayerRequestReactions,
    testimonyReactions,
    getReactionTypes,
  };
};
