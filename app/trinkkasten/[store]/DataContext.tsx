'use client';

import { Profile, Product } from '@/utils/definitions';

import { useParams } from 'next/dist/client/components/navigation';
import { createContext, useContext, useState } from 'react';

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({
  products,
  profiles,
  children,
}: {
  products: Product[];
  profiles: Profile[];
  children: React.ReactNode;
}) {
  const { store } = useParams();
  const [cart, setCart] = useState<{
    store: string;
    products: Product[];
    user: Profile | null;
  }>({
    store: store as string,
    products: [],
    user: null,
  });

  return (
    <DataContext.Provider
      value={{
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
