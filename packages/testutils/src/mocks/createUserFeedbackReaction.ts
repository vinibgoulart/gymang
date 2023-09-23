export const createUserFeedbackReaction = () => ({
  UserFeedbackReaction: (_, generateId) => ({
    id: `UserFeedbackReaction:${generateId()}`,
  }),
});
