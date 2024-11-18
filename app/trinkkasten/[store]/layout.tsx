import { createClient } from '@/utils/supabase/server';
import { Product, Profile } from '@/utils/definitions';
import { DataProvider } from './DataContext';

export default async function TrinkkastenStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { store: string };
}) {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('soldAt', params.store)
    .eq('active', true)
    .returns<Product[]>();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .returns<Profile[]>();

  const data = { products: products || [], profiles: profiles || [] };

  return (
    <div>
      <h1 className="text-4xl font-bold font-mono text-center mt-6">
        {params.store}
      </h1>
      <DataProvider data={data}>{children}</DataProvider>
    </div>
  );
}
