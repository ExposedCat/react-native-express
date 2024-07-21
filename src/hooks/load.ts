import { ToastAndroid } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

import { TokenContext } from '../contexts/token.ts';
import { ENDPOINT } from '../constants.ts';
import type { QueryState, APIResponse, UseFetchResult } from './fetch.ts';

type UseLoadProps<T> = {
  path: string;
  uniqueKey?: string;
  pause?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (message: string) => void;
};

export function useLoad<I, O>(props: UseLoadProps<O>) {
  const { path, pause, onError, onSuccess, uniqueKey } = props;

  const token = React.useContext(TokenContext);

  const queryFn: () => Promise<QueryState<O>> = React.useMemo(
    () => async () => {
      const headers: HeadersInit_ = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.authorization = token;
      }
      const options: RequestInit = {
        method: 'GET',
        headers,
      };
      try {
        const response = await fetch(`${ENDPOINT}${path}`, options);
        const data: APIResponse<O> = await response.json();

        if (data.ok) {
          onSuccess?.(data.data);
          return {
            state: 'success',
            data: data.data,
            message: data.message,
          };
        }

        if (data.message !== 'Unauthorized') {
          ToastAndroid.show(data.message, ToastAndroid.LONG);
        }
        onError?.(data.message);
        return {
          state: 'error',
          data: null,
          message: data.message,
        };
      } catch (error) {
        const message = (error as Error).message;
        onError?.(message);
        return {
          state: 'error',
          data: null,
          message,
        };
      }
    },
    [onError, onSuccess, path, token],
  );

  const queryKey: QueryKey = React.useMemo(
    () => ['api', path, token, uniqueKey ?? ''],
    [path, token, uniqueKey],
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      void query.refetch();
    }, 5_000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const query = useQuery<QueryState<O>>({
    queryKey,
    queryFn,
    enabled: !pause,
  });

  return {
    state: query.isPending ? 'loading' : query.isError ? 'error' : 'success',
    data: query.data?.data ?? null,
    message: query.data?.message ?? null,
    refetch: query.refetch,
    isLoaded: !query.isPending,
  } as UseFetchResult<I, O>;
}
