import { createClient } from '@/utils/supabase/server';
import { Product, Profile, Store } from '@/utils/definitions';
import { DataProvider } from './DataContext';

export default async function TrinkkastenStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}) {
  const supabase = await createClient();

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('name', (await params).store)
    .single<Store>();

  if (!store) console.error('Error fetching store');

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('sold_at', store!.name)
    .eq('active', true)
    .returns<Product[]>();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .returns<Profile[]>();

  return (
    <div>
      <h1 className="text-4xl font-bold font-mono text-center">
        {store!.name}
      </h1>
      <DataProvider
        store={store!}
        products={products || []}
        profiles={profiles || []}
      >
        {children}
      </DataProvider>
    </div>
  );
}
