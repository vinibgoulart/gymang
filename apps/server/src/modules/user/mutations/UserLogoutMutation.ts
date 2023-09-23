import { successField, errorField } from '@gymang/graphql';
import { USER_SESSION_COOKIE, setSessionTokenCookie } from '@gymang/session';
import { mutationWithClientMutationId } from 'graphql-relay';

const mutation = mutationWithClientMutationId({
  name: 'UserLogout',
  inputFields: {},
  mutateAndGetPayload: async (_, context) => {
    const { t } = context;

    await setSessionTokenCookie(context, USER_SESSION_COOKIE, null);

    return {
      error: null,
      success: t('Logout successful'),
    };
  },
  outputFields: {
    ...successField,
    ...errorField,
  },
});

export default {
  ...mutation,
};
