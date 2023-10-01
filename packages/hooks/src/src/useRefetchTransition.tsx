import { useTransition } from 'react';
import type { RefetchFnDynamic } from 'react-relay';

type UseRefetchTransitionReturn = [boolean, RefetchFnDynamic<any, any>];

export const useRefetchTransition = (
  refetch: RefetchFnDynamic<any, any>,
): UseRefetchTransitionReturn => {
  const [isPending, startTransition] = useTransition();

  const handleRefetch = (variables, _, callback) => {
    const refetchFn = () => {
      const normalizedVariables =
        typeof variables === 'function' ? variables() : variables;

      refetch(normalizedVariables, { fetchPolicy: 'network-only' });
      callback && callback();
    };

    startTransition(refetchFn);
  };

  return [isPending, handleRefetch];
};
