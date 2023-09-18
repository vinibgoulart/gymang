import { Stack } from '@chakra-ui/react';
import { TextForm } from '@gymang/form';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton } from '@gymang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';

import { UserAdd } from './mutations/UserAddMutation';
import type { UserAddMutation } from '../../../__generated__/UserAddMutation.graphql';

const validationSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Nome é obrigatório' }),
    email: z.string().email({ message: 'Email inválido' }),
    password: z
      .string()
      .min(6, { message: 'Senha precisa ter pelo menos 6 caracteres' }),
    confirm: z
      .string()
      .min(6, { message: 'Senha precisa ter pelo menos 6 caracteres' }),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: 'Senhas não conferem',
    path: ['confirm'],
  });

type Values = z.infer<typeof validationSchema>;

export function UserRegisterForm() {
  const router = useRouter();

  const defaultValues = {
    firstName: '',
    email: '',
    password: '',
  };

  const [userRegister, isPending] = useMutationCallbacks<UserAddMutation>({
    name: 'UserAdd',
    mutation: UserAdd,
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

  const onSubmit = handleSubmit(({ email, password, firstName }: Values) => {
    const config = {
      variables: {
        input: {
          email,
          password,
          firstName,
        },
      },
    };

    userRegister(config);
  });

  const disabled = isPending || isValid;

  return (
    <FormProvider {...formBag}>
      <Stack spacing={4}>
        <TextForm name="firstName" placeholder="Nome" />
        <TextForm name="email" placeholder="Email" />
        <TextForm name="password" placeholder="Senha" type="password" />
        <TextForm
          name="confirm"
          placeholder="Confirme sua senha"
          type="password"
        />
        <ActionButton disabled={disabled} onClick={onSubmit} w="full">
          Cadastre-se
        </ActionButton>
      </Stack>
    </FormProvider>
  );
}
