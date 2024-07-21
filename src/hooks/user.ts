import React from 'react';

import type { User } from '../types/user.ts';
import { useLoad } from './load.ts';
import type { UseFetchResult } from './fetch.ts';
import { useAction } from './action.ts';

export function useFetchUser(): UseFetchResult<void, User> {
  return useLoad<void, User>({
    path: '/user',
    onError: message => console.error(message),
  });
}

export function useUpdateUser() {
  const { refetch } = useFetchUser();

  const query = useAction<Partial<User>, { ok: boolean }>({
    path: '/update',
    onSuccess: () => refetch(),
  });

  return React.useCallback(
    (data: Partial<User>) => {
      query.execute(data);
    },
    [query],
  );
}

export function useCreateUser() {
  const { refetch } = useFetchUser();

  const query = useAction<Partial<User>, { ok: boolean }>({
    path: '/register',
    onSuccess: () => refetch(),
  });

  return React.useCallback(
    (data: Partial<User>) => {
      query.execute(data);
    },
    [query],
  );
}
