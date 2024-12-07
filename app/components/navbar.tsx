import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative flex items-center justify-between max-w-xl mx-auto py-5 mb-2 px-3">
      {/* Left Content */}
      <div className="text-center invisible md:visible">
        <Link
          href="/trinkkasten"
          className="group link-underline-group"
        >
          <div className="cursor-pointer">Trinkkasten</div>
          <div className="link-underline"></div>
        </Link>
      </div>

      {/* Center Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href="/">
          <Image
            src="/glh-logo.svg"
            alt="GLH Logo"
            width={100}
            height={100}
            className="hidden dark:block"
            priority
          />
          <Image
            src="/glh-logo-black.svg"
            alt="GLH Logo"
            width={100}
            height={100}
            className="dark:hidden"
            priority
          />
        </Link>
      </div>

      {/* Right Content */}
      <div className="text-center">
        <Link href={user ? '/profile' : '/auth'} className="group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
