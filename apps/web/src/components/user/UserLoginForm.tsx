import { Stack } from '@chakra-ui/react';
import { TextForm } from '@gymang/form';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton } from '@gymang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';

import { UserLogin } from './mutations/UserLoginMutation';
import type { UserLoginMutation } from '../../../__generated__/UserLoginMutation.graphql';

const validationSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(6, { message: 'Senha precisa ter pelo menos 6 caracteres' }),
});

type Values = z.infer<typeof validationSchema>;

export const UserLoginForm = () => {
  const router = useRouter();

  const defaultValues = {
    email: '',
    password: '',
  };

  const [userLogin, isPending] = useMutationCallbacks<UserLoginMutation>({
    name: 'UserLogin',
    mutation: UserLogin,
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

  const onSubmit = handleSubmit(({ email, password }: Values) => {
    const config = {
      variables: {
        input: {
          email,
          password,
        },
      },
    };

    userLogin(config);
  });

  const disabled = isPending || isValid;

  return (
    <FormProvider {...formBag}>
      <Stack spacing={4}>
        <TextForm name="email" placeholder="Email" />
        <TextForm name="password" placeholder="Senha" type="password" />
        <ActionButton disabled={disabled} onClick={onSubmit} w="full">
          Entrar
        </ActionButton>
      </Stack>
    </FormProvider>
  );
};
