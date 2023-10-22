import { HStack, Stack } from '@chakra-ui/react';
import { MUSCLE_GROUP, MUSCLE_GROUP_LABEL } from '@gymang/enums';
import { SelectForm, TextForm } from '@gymang/form';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton, Modal } from '@gymang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { graphql, useFragment } from 'react-relay';
import { ROOT_ID, ConnectionHandler } from 'relay-runtime';
import { z } from 'zod';

import { ExerciseAdd } from './mutations/ExerciseAddMutation';
import type { ExerciseAddModalForm_workoutSplit$key } from '../../../__generated__/ExerciseAddModalForm_workoutSplit.graphql';
import type { ExerciseAddMutation } from '../../../__generated__/ExerciseAddMutation.graphql';

type ExerciseAddModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  workoutSplit: ExerciseAddModalForm_workoutSplit$key;
};

const validationSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  series: z
    .string()
    .min(1, { message: 'Séries deve ser maior que 0' })
    .max(200, { message: 'Séries deve ser menor que 200' }),
  repetitions: z
    .string()
    .min(1, { message: 'Repetições deve ser maior que 0' })
    .max(1000, { message: 'Repetições deve ser menor que 1000' }),
  weight: z.string().max(1000, { message: 'Peso deve ser menor que 1000' }),
  breakTime: z
    .string()
    .max(86400, { message: 'Tempo de descanso deve ser menor que um dia' }),
  muscleGroup: z
    .string()
    .min(2, { message: 'Grupo muscular deve ser informado' }),
});

type Values = z.infer<typeof validationSchema>;

export const ExerciseAddModalForm = (props: ExerciseAddModalFormProps) => {
  const workoutSplit = useFragment<ExerciseAddModalForm_workoutSplit$key>(
    graphql`
      fragment ExerciseAddModalForm_workoutSplit on WorkoutSplit {
        id
      }
    `,
    props.workoutSplit,
  );

  const defaultValues = {
    name: '',
    series: '',
    repetitions: '',
    weight: '',
    breakTime: '',
    muscleGroup: '',
  };

  const [exerciseAdd, isPending] = useMutationCallbacks<ExerciseAddMutation>({
    name: 'ExerciseAdd',
    mutation: ExerciseAdd,
    afterCompleted: () => {
      props.onClose();
    },
  });

  const formBag = useForm<Values>({
    defaultValues,
    resolver: zodResolver(validationSchema),
    mode: 'all',
  });

  if (!workoutSplit) {
    return null;
  }

  const {
    handleSubmit,
    formState: { isValid },
  } = formBag;

  const onSubmit = handleSubmit(
    ({ name, breakTime, muscleGroup, repetitions, series, weight }: Values) => {
      const connectionID = ConnectionHandler.getConnectionID(
        ROOT_ID,
        'ExerciseTable_exercises',
      );

      const config = {
        variables: {
          connections: [connectionID],
          input: {
            name,
            workoutSplit: workoutSplit.id,
            breakTime,
            muscleGroup,
            repetitions,
            series: series,
            weight: weight,
          },
        },
      };

      exerciseAdd(config);
    },
  );

  const disabled = isPending || !isValid;

  const actions = (
    <HStack>
      <ActionButton onClick={onSubmit} isDisabled={disabled}>
        Adicionar
      </ActionButton>
      <ActionButton onClick={props.onClose} bg={'error.main'}>
        Cancelar
      </ActionButton>
    </HStack>
  );

  const options = Object.keys(MUSCLE_GROUP).map((key) => ({
    label: MUSCLE_GROUP_LABEL[key],
    value: MUSCLE_GROUP[key],
  }));

  return (
    <FormProvider {...formBag}>
      <Modal
        title="Adicionar exercício"
        actions={actions}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <Stack spacing={4}>
          <TextForm name="name" placeholder="Nome" />
          <TextForm name="series" placeholder="Séries" />
          <TextForm name="repetitions" placeholder="Repetições" />
          <SelectForm
            name="muscleGroup"
            options={options}
            placeholder="Selecione o grupo muscular"
          />
          <TextForm name="weight" placeholder="Peso (opcional)" />
          <TextForm
            name="breakTime"
            placeholder="Tempo de descanso (opcional)"
          />
        </Stack>
      </Modal>
    </FormProvider>
  );
};
