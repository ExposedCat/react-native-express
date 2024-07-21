import { ToastAndroid } from 'react-native';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

import { TokenContext } from '../contexts/token.ts';
import { ENDPOINT } from '../constants.ts';
import type { QueryState, APIResponse, UseFetchResult, SuccessQueryState } from './fetch.ts';

type UseActionProps<O> = {
  path: string;
  uniqueKey?: string;
  onSuccess?: (data: SuccessQueryState<O>) => void;
  onError?: (message: string) => void;
};

type UseActionResult<I, O> = Omit<UseFetchResult<I, O>, 'refetch'> & {
  execute: (body: I) => void;
};

export function useAction<I, O>(props: UseActionProps<O>): UseActionResult<I, O> {
  const { path, onError, onSuccess, uniqueKey } = props;

  const token = React.useContext(TokenContext);

  const mutationFn = React.useMemo(
    () =>
      async (body: I): Promise<QueryState<O>> => {
        const headers: HeadersInit_ = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers.authorization = token;
        }
        const options: RequestInit = {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        };
        const response = await fetch(`${ENDPOINT}${path}`, options);
        const data: APIResponse<O> = await response.json();

        if (data.ok) {
          return {
            state: 'success',
            data: data.data,
            message: data.message,
          };
        }

        ToastAndroid.show(data.message, ToastAndroid.LONG);
        throw new Error(data.message);
      },
    [path, token],
  );

  const mutationKey: QueryKey = React.useMemo(
    () => ['api', path, token, uniqueKey ?? ''],
    [path, token, uniqueKey],
  );

  const query = useMutation<QueryState<O>, any, I>({
    mutationKey,
    mutationFn,
    onSuccess: data => onSuccess?.(data as SuccessQueryState<O>),
    onError: error => onError?.(error.message),
  });

  return {
    state: query.isPending ? 'loading' : query.isError ? 'error' : 'success',
    data: query.data?.data ?? null,
    message: query.data?.message ?? null,
    execute: query.mutate,
    isLoaded: !query.isPending,
  };
}
