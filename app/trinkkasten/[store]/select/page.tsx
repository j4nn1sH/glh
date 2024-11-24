'use client';

import { Profile } from '@/utils/definitions';
import { DataContextType, useData } from '../DataContext';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TrinkkastenStoreSelectPage() {
  const { profiles, cart, setCart } = useData() as DataContextType;
  const router = useRouter();

  // Redirect on invalid state
  if (!cart.products.length) {
    router.push(`/trinkkasten/${cart.store}`);
  }

  const handleSelect = (profile: Profile) => {
    setCart({ ...cart, user: profile });
    router.push(`/trinkkasten/${cart.store}/checkout`);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <p className="description">Who is paying?</p>
      <div className="max-w-lg flex flex-wrap justify-center gap-4 -h-[50vh] overflow-y-auto">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => handleSelect(profile)}
            className={`product-card ${
              cart.user == profile ? 'selected' : ''
            }`}
          >
            {profile.first_name} {profile.last_name}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Link href={`/trinkkasten/${cart.store}`}>
          <button className="secondary">Back</button>
        </Link>
        {/* WIP */}
        {/* <button className="bg-transparent text-blue-500 border border-blue-500 ">
          Divide
        </button> */}
        <Link href={`/trinkkasten/${cart.store}/checkout`}>
          <button
            className={`${cart.user === null ? 'disabled' : ''}`}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}
