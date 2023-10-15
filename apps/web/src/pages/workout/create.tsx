import { useRouter } from 'next/router';

import { PageHeader } from '../../components/PageHeader';
import { WorkoutAddForm } from '../../components/workout/WorkoutAddForm';
import { RootLayout } from '../../layouts/RootLayout';

const CreateWorkout = () => {
  const router = useRouter();

  const breadcrumbs = [
    {
      label: 'Treinos',
      onClick: () => {
        router.push('/workout/list');
      },
    },
    {
      label: 'Adicionar treino',
      onClick: () => {
        router.push('/workout/create');
      },
    },
  ];

  return (
    <RootLayout>
      <PageHeader title="Adicionar treino" breadcrumbs={breadcrumbs} />
      <WorkoutAddForm />
    </RootLayout>
  );
};

export default CreateWorkout;
