import { Stack } from '@chakra-ui/react';
import { TextForm } from '@gymang/form';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton } from '@gymang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { WorkoutAdd } from './mutations/WorkoutAddMutation';
import type { WorkoutAddMutation } from '../../../__generated__/WorkoutAddMutation.graphql';

const validationSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  description: z.string().max(20, { message: 'Descrição deve ter no máximo 20 caracteres' }),
});

type Values = z.infer<typeof validationSchema>;

export const WorkoutAddForm = () => {
  const router = useRouter();

  const defaultValues = {
    name: '',
    description: '',
  };

  const [workoutAdd, isPending] = useMutationCallbacks<WorkoutAddMutation>({
    name: 'WorkoutAdd',
    mutation: WorkoutAdd,
    afterCompleted: () => {
      router.push('/');
    },
  });

  const formBag = useForm<Values>({
    defaultValues,
    resolver: zodResolver(validationSchema),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = formBag;

  const onSubmit = handleSubmit(({ name, description }: Values) => {
    const config = {
      variables: {
        input: {
          name,
          description,
        },
      },
    };

    workoutAdd(config);
  });

  const disabled = isPending || !isValid;

  return (
    <FormProvider {...formBag}>
      <Stack spacing={4}>
        <TextForm name="name" placeholder="Nome" />
        <TextForm name="description" placeholder="Descrição (opcional)" />
        <ActionButton isDisabled={disabled} onClick={onSubmit} w="full" data-testid={'button-workout-add'}>
          Adicionar
        </ActionButton>
      </Stack>
    </FormProvider>
  );
};
