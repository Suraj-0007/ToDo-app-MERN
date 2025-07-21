'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  return (
    <nav className="bg-white shadow p-4 mb-6">
      <div className="flex justify-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          📝 ToDo App
        </Link>
      </div>
    </nav>

  );
}
