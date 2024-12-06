'use client';

import { Profile, Product, Store } from '@/utils/definitions';

import { createContext, useContext, useState } from 'react';

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({
  store,
  products,
  profiles,
  children,
}: {
  store: Store;
  products: Product[];
  profiles: Profile[];
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<{
    store: string;
    products: Product[];
    user: Profile | null;
  }>({
    store: store.name,
    products: [],
    user: null,
  });

  return (
    <DataContext.Provider
      value={{
        store,
        products,
        profiles,
        cart,
        setCart,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

export type DataContextType = {
  store: Store;
  products: Product[];
  profiles: Profile[];
  cart: {
    store: string;
    products: Product[];
    user: Profile | null;
  };
  setCart: React.Dispatch<
    React.SetStateAction<{
      store: string;
      products: Product[];
      user: Profile | null;
    }>
  >;
};
