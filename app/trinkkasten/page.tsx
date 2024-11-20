import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Trinkkasten() {
  const supabase = await createClient();
  const { data } = await supabase.from('groups').select('*');

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="description">Select a store to start shopping!</p>
      <div className="flex flex-col gap-2 w-[10em] text-center font-semibold">
        {data?.map((group) => (
          <Link
            className="bg-white text-background rounded-full py-3 bg-opacity-90 hover:bg-opacity-100 active:scale-x-105 duration-300"
            key={group.name}
            href={`/trinkkasten/${group.name}`}
          >
            {group.name}
          </Link>
        ))}
        WIP: Add new shop
      </div>
    </div>
  );
}
