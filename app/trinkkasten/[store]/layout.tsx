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
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('sold_at', (await params).store)
    .eq('active', true)
    .returns<Product[]>();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .returns<Profile[]>();

  return (
    <div>
      <h1 className="text-4xl font-bold font-mono text-center my-6">
        {(await params).store}
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
