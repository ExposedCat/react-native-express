import React from 'react';

type RouterContextType = {
  page: string;
  setPage: (page: string) => void;
};

export const RouterContext = React.createContext<RouterContextType>({
  page: 'home',
  setPage: () => {},
});
