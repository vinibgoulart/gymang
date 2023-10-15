import { Stack } from '@chakra-ui/react';
import { RadioForm, TextForm } from '@gymang/form';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton } from '@gymang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { ConnectionHandler, ROOT_ID } from 'relay-runtime';
import { z } from 'zod';

import { WorkoutAdd } from './mutations/WorkoutAddMutation';
import type {
  WorkoutAddMutation,
  WorkoutAddMutation$data,
} from '../../../__generated__/WorkoutAddMutation.graphql';

const validationSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  isPublic: z.string().refine(
    (value) => {
      return ['true', 'false'].includes(value);
    },
    { message: 'Deve ser público ou privado' },
  ),
});

type Values = z.infer<typeof validationSchema>;

export const WorkoutAddForm = () => {
  const router = useRouter();

  const defaultValues = {
    name: '',
    isPublic: 'true',
  };

  const [workoutAdd, isPending] = useMutationCallbacks<WorkoutAddMutation>({
    name: 'WorkoutAdd',
    mutation: WorkoutAdd,
    afterCompleted: ({ WorkoutAdd }: WorkoutAddMutation$data) => {
      router.push(`/workout/${WorkoutAdd?.workout?.id}`);
    },
  });

  const formBag = useForm<Values>({
    defaultValues,
    resolver: zodResolver(validationSchema),
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = formBag;

  const onSubmit = handleSubmit(({ name, isPublic }: Values) => {
    const connectionIDMeWorkouts = ConnectionHandler.getConnectionID(
      ROOT_ID,
      'WorkoutList_meWorkouts',
    );

    const connectionIDWorkouts = ConnectionHandler.getConnectionID(
      ROOT_ID,
      'WorkoutList_workouts',
    );

    const config = {
      variables: {
        connections: [connectionIDMeWorkouts, connectionIDWorkouts],
        input: {
          name,
          isPublic: isPublic === 'true',
        },
      },
    };

    workoutAdd(config);
  });

  const disabled = isPending || !isValid;

  const options = [
    {
      label: 'Público',
      value: 'true',
    },
    {
      label: 'Privado',
      value: 'false',
    },
  ];

  return (
    <FormProvider {...formBag}>
      <Stack spacing={4}>
        <TextForm name="name" placeholder="Nome" />
        <RadioForm name="isPublic" options={options} />
        <ActionButton
          isDisabled={disabled}
          onClick={onSubmit}
          w="full"
          data-testid={'button-workout-add'}
        >
          Adicionar
        </ActionButton>
      </Stack>
    </FormProvider>
  );
};
