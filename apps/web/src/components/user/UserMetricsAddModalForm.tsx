import { HStack, Stack } from '@chakra-ui/react';
import { TextForm } from '@gymang/form';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton, Modal } from '@gymang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { graphql, useFragment } from 'react-relay';
import { ROOT_ID, ConnectionHandler } from 'relay-runtime';
import { z } from 'zod';

import { UserMetricsAdd } from './mutations/UserMetricsAddMutation';
import type { UserMetricsAddModalForm_user$key } from '../../../__generated__/UserMetricsAddModalForm_user.graphql';
import type { UserMetricsAddMutation } from '../../../__generated__/UserMetricsAddMutation.graphql';

type UserMetricsAddModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserMetricsAddModalForm_user$key;
};

const validationSchema = z.object({
  weight: z
    .string()
    .max(1000, { message: 'Peso deve ser menor que 1000' })
    .min(1, { message: 'Peso deve ser maior que 0' }),
  height: z
    .string()
    .max(1000, { message: 'Altura deve ser menor que 1000' })
    .min(1, { message: 'Altura deve ser maior que 0' }),
  age: z
    .string()
    .max(1000, { message: 'Idade deve ser menor que 1000' })
    .min(1, { message: 'Idade deve ser maior que 0' }),
  fat: z.string().max(1000, { message: 'Gordura deve ser menor que 1000' }),
});

type Values = z.infer<typeof validationSchema>;

export const UserMetricsAddModalForm = (
  props: UserMetricsAddModalFormProps,
) => {
  const defaultValues = {
    weight: '',
    height: '',
    age: '',
    fat: '',
  };

  const [userMetricsAdd, isPending] =
    useMutationCallbacks<UserMetricsAddMutation>({
      name: 'UserMetricsAdd',
      mutation: UserMetricsAdd,
      afterCompleted: () => {
        props.onClose();
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

  const onSubmit = handleSubmit(({ age, fat, height, weight }: Values) => {
    const connectionID = ConnectionHandler.getConnectionID(
      ROOT_ID,
      'UserProfile_metrics',
    );

    const getFat = () => {
      if (fat) {
        return {
          fat,
        };
      }

      return {};
    };

    const config = {
      variables: {
        connections: [connectionID],
        input: {
          height: parseInt(height, 10),
          weight: parseInt(weight, 10),
          age: parseInt(age, 10),
          ...getFat(),
        },
      },
    };

    userMetricsAdd(config);
  });

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

  return (
    <FormProvider {...formBag}>
      <Modal
        title="Adicionar métrica"
        actions={actions}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <Stack spacing={4}>
          <TextForm name="weight" placeholder="Peso" />
          <TextForm name="height" placeholder="Altura" />
          <TextForm name="age" placeholder="Idade" />
          <TextForm name="fat" placeholder="Gordura (opcional)" />
        </Stack>
      </Modal>
    </FormProvider>
  );
};
