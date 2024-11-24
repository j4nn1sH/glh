import Image from 'next/image';

import { createClient } from '@/utils/supabase/server';
import { logout } from './auth/actions';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching user: ', error);
    return;
  }
  const user = data.user;

  return (
    <div className="flex flex-col items-center p-2 text-center">
      <Image
        src="/surprised.png"
        alt="Surprised Memoji"
        width={200}
        height={1}
        priority
      />
      <p>Hey {user?.user_metadata.first_name} 👋</p>
      <p>
        Looking for the Trinkkasten?{' '}
        <Link href={'/trinkkasten'} className="underline">
          Click me
        </Link>
      </p>
      <button className="secondary mx-auto mt-16" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
