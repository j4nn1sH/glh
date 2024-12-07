'use client';

import { Profile, Product, Store } from '@/utils/definitions';
import { User } from '@supabase/supabase-js';

import { createContext, useContext, useState } from 'react';

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({
  user,
  store,
  products,
  profiles,
  children,
}: {
  user: User | null;
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
        user,
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
  user: User | null;
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
