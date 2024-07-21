import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const ProvideQueryClient = (props: { children: React.ReactNode }) => {
  const client = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // Data is always stale for refetch to never be ignored
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true, // If internet connection was lost, realtime changes may be lost - need to refetch
            retry: false,
          },
        },
      }),
    [],
  );
  return <QueryClientProvider client={client}>{props.children}</QueryClientProvider>;
};
