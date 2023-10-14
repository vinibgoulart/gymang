import {
  meWorkoutConnectionField,
  workoutConnectionField,
} from './WorkoutFields';

const WorkoutQueries = {
  ...meWorkoutConnectionField(),
  ...workoutConnectionField(),
};

export default WorkoutQueries;
