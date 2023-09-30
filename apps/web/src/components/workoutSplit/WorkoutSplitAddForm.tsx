import { Stack } from '@chakra-ui/react';
import {
  WORKOUT_SPLIT_MODALITY,
  WORKOUT_SPLIT_MODALITY_LABEL,
} from '@gymang/enums';
import { SelectForm, TextForm } from '@gymang/form';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton } from '@gymang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { graphql, useFragment } from 'react-relay';
import { z } from 'zod';

import { WorkoutSplitAdd } from './mutations/WorkoutSplitAddMutation';
import type { WorkoutSplitAddForm_workout$key } from '../../../__generated__/WorkoutSplitAddForm_workout.graphql';
import type { WorkoutSplitAddMutation } from '../../../__generated__/WorkoutSplitAddMutation.graphql';

type WorkoutSplitAddFormProps = {
  workout: WorkoutSplitAddForm_workout$key;
};

const validationSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  modality: z.string().min(2, { message: 'Modalidade é obrigatório' }),
});

type Values = z.infer<typeof validationSchema>;

export const WorkoutSplitAddForm = (props: WorkoutSplitAddFormProps) => {
  const router = useRouter();

  const workout = useFragment<WorkoutSplitAddForm_workout$key>(
    graphql`
      fragment WorkoutSplitAddForm_workout on Workout {
        id
      }
    `,
    props.workout,
  );

  const defaultValues = {
    name: '',
  };

  const [workoutSplitAdd, isPending] =
    useMutationCallbacks<WorkoutSplitAddMutation>({
      name: 'WorkoutSplitAdd',
      mutation: WorkoutSplitAdd,
      afterCompleted: () => {
        router.push('/');
      },
    });

  const formBag = useForm<Values>({
    defaultValues,
    resolver: zodResolver(validationSchema),
    mode: 'all',
  });

  if (!workout) {
    return null;
  }

  const {
    handleSubmit,
    formState: { isValid },
  } = formBag;

  const onSubmit = handleSubmit(({ name, modality }: Values) => {
    const config = {
      variables: {
        input: {
          name,
          modality,
          workout: workout.id,
        },
      },
    };

    workoutSplitAdd(config);
  });

  const options = Object.keys(WORKOUT_SPLIT_MODALITY).map((key) => ({
    label: WORKOUT_SPLIT_MODALITY_LABEL[key],
    value: WORKOUT_SPLIT_MODALITY[key],
  }));

  const disabled = isPending || !isValid;

  return (
    <FormProvider {...formBag}>
      <Stack spacing={4}>
        <TextForm name="name" placeholder="Nome" />
        <SelectForm
          name="modality"
          options={options}
          placeholder="Selecione a modalidade"
        />
        <ActionButton
          isDisabled={disabled}
          onClick={onSubmit}
          w="full"
          data-testid={'button-workout-split-add'}
        >
          Adicionar
        </ActionButton>
      </Stack>
    </FormProvider>
  );
};
