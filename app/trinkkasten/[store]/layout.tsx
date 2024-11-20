import { createClient } from '@/utils/supabase/server';
import { Product, Profile } from '@/utils/definitions';
import { DataProvider } from './DataContext';

export default async function TrinkkastenStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}) {
  const store = (await params).store;

  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('soldAt', store)
    .eq('active', true)
    .returns<Product[]>();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .returns<Profile[]>();

  return (
    <div>
      <h1 className="text-4xl font-bold font-mono text-center mt-6">
        {store}
      </h1>
      <DataProvider
        products={products || []}
        profiles={profiles || []}
      >
        {children}
      </DataProvider>
    </div>
  );
}
