import { createClient } from '@/utils/supabase/server';
import { Product, Profile, Store } from '@/utils/definitions';
import { DataProvider } from './DataContext';
import Link from 'next/link';

export default async function TrinkkastenStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}) {
  const supabase = await createClient();

  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) console.log('Using application anomously');

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
      <div className="relative max-w-md mx-auto">
        <Link href={'/trinkkasten'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute left-2 top-2 size-8"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="text-4xl font-bold font-mono text-center">
          {store!.name}
        </h1>
      </div>
      <DataProvider
        user={user}
        store={store!}
        products={products || []}
        profiles={profiles || []}
      >
        {children}
      </DataProvider>
    </div>
  );
}
