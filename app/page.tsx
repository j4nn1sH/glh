import Image from 'next/image';

import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();

  let user = null;
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    user = null;
  } else {
    user = data.user;
  }

  return (
    <div className="flex flex-col items-center p-2 text-center">
      <Image
        src="/surprised.png"
        alt="Surprised Memoji"
        width={200}
        height={1}
        priority
      />
      {user && <p>Hey {user?.user_metadata.first_name} 👋</p>}
      <p>
        Looking for the Trinkkasten?{' '}
        <Link href={'/trinkkasten'} className="underline">
          Click me
        </Link>
      </p>
    </div>
  );
}
