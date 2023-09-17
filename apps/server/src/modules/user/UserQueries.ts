import { meField, userConnectionField } from './UserFields';

const UserQueries = {
  ...meField(),
  ...userConnectionField(),
};

export default UserQueries;
