'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const navbarItems = [
    {
      name: 'Trinkkasten',
      link: '/trinkkasten',
    },
  ];

  const pathname = usePathname();

  return (
    <div className="flex flex-col pb-6">
      <nav className="flex h-12 items-center justify-evenly">
        {navbarItems.map((item) => (
          <Link
            className={`group relative cursor-pointer font-thin ${
              pathname.startsWith(item.link) ? 'font-normal' : ''
            }`}
            key={item.name}
            href={item.link}
          >
            <p>{item.name}</p>
            <div className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-foreground transition-all group-hover:left-0 group-hover:w-full"></div>
          </Link>
        ))}
      </nav>
      <div className="flex justify-center -translate-y-2 rotate-2">
        <Link href="/">
          <Image
            src="/glh-logo.svg"
            alt="GLH Logo"
            width={120}
            height={120}
            className="hidden dark:block"
            priority
          />
          <Image
            src="/glh-logo-black.svg"
            alt="GLH Logo"
            width={120}
            height={120}
            className="dark:hidden"
            priority
          />
        </Link>
      </div>
    </div>
  );
}
