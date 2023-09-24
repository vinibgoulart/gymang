import { PageHeader } from '../../components/PageHeader';
import { WorkoutAddForm } from '../../components/workout/WorkoutAddForm';
import { RootLayout } from '../../layouts/RootLayout';

const CreateWorkout = () => {
  return (
    <RootLayout>
      <PageHeader title="Adicionar treino" />
      <WorkoutAddForm />
    </RootLayout>
  );
};

export default CreateWorkout;
