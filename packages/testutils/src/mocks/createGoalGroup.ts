export const createGoalGroup = (args = {}) => ({
  GoalGroup: () => ({
    globalGoalsSettings: {
      canCreate: [],
      canEdit: [],
      canApprove: [],
      canExamine: [],
      canApproveResult: [],
      canSeeResult: [],
      canSeeGoalType: [],
    },
    individualGoalsSettings: {
      canCreate: [],
      canEdit: [],
      canApprove: [],
      canExamine: [],
      canApproveResult: [],
      canSeeResult: [],
      canSeeGoalType: [],
    },
    costRevenueCenterGoalsSettings: {
      canCreate: [],
      canEdit: [],
      canApprove: [],
      canExamine: [],
      canApproveResult: [],
      canSeeResult: [],
      canSeeGoalType: [],
    },
    commonIndividual: {
      settings: {
        canCreate: [],
        canEdit: [],
        canApprove: [],
        canExamine: [],
        canApproveResult: [],
        canSeeResult: [],
        canSeeGoalType: [],
      },
    },
    ...args,
  }),
});
