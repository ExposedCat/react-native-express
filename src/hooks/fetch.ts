export type SuccessQueryState<T> = {
  state: 'success';
  data: T;
  message: string;
};

export type QueryState<T> =
  | {
      state: 'loading';
      data: null;
      message: null;
    }
  | SuccessQueryState<T>
  | {
      state: 'error';
      data: null;
      message: string;
    };

export type UseFetchResult<I, O> = {
  refetch: (body?: I) => void;
  isLoaded: boolean;
} & QueryState<O>;

export type APIResponse<T> = { message: string } & (
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      data: null;
    }
);
