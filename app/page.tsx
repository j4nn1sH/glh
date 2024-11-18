import { createClient } from '@/utils/supabase/server';

import { logout } from './auth/actions';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center">
        Hey {data.user?.user_metadata.first_name} 👋
      </p>
      <button
        className="btn-secondary mx-auto mt-16"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
