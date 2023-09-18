import { useToast } from '@chakra-ui/react';
import type { UseMutationConfig } from 'react-relay';
import { useMutation } from 'react-relay';
import type { MutationParameters, PayloadError } from 'relay-runtime';

export const getError = (data: any) => {
  if (data?.error) {
    return data.error;
  }

  if (data?.errors) {
    return data.errors.join('\n');
  }

  return null;
};

export type UseMutationCallbacksArgs<TMutation extends MutationParameters> = {
  mutation: any;
  name: keyof TMutation['response'];
  success?: string | undefined;
  error?: string;
  shouldShowSnackbar?: boolean;
  afterCompleted?: (
    response: TMutation['response'],
    errors: Array<PayloadError> | null,
    safeValues?: any | null,
  ) => void | null;
  afterError?: (
    error: Error,
    safeValues?: any | null,
    response?: TMutation['response'],
  ) => void;
};
export const useMutationCallbacks = <TMutation extends MutationParameters>(
  args: UseMutationCallbacksArgs<TMutation>,
): [
  (
    executeConfig: UseMutationConfig<TMutation>,
    safeValues?: any | null,
  ) => void,
  boolean,
] => {
  const {
    mutation,
    name,
    // success,
    // error,
    afterCompleted,
    afterError,
    shouldShowSnackbar = true,
  } = args;

  const toast = useToast();
  const [execute, isPending] = useMutation(mutation);

  const onCompleted =
    (error = args.error, success = args.success, safeValues: any | null) =>
    (response: TMutation['response']) => {
      const data = response[name];

      if (!data || data.error || (data.errors && data.errors.length > 0)) {
        if (shouldShowSnackbar) {
          toast({
            title: getError(data) || error,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom-right',
          });
        }

        afterError &&
          afterError(getError(data) || error, safeValues || {}, response);

        return;
      }

      const successMessage = data.success || success;

      if (successMessage && shouldShowSnackbar) {
        toast({
          title: successMessage,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        });
      }

      afterCompleted && afterCompleted(response, safeValues);
    };

  const onError =
    (error = args.error, safeValues: any | null) =>
    (errorMutation: Error) => {
      if (error && shouldShowSnackbar) {
        toast({
          title: error,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        });
      }

      afterError && afterError(errorMutation, safeValues);
    };

  const executeFn = (
    executeConfig: UseMutationConfig<TMutation> = { variables: {} },
    safeValues?: any | null,
  ) => {
    return execute({
      onCompleted: onCompleted(
        executeConfig.error,
        executeConfig.success,
        safeValues,
      ),
      onError: onError(executeConfig.error, safeValues),
      ...executeConfig,
    });
  };

  return [executeFn, isPending];
};
