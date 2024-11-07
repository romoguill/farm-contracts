'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarLinkProps {
  route: { label: string; href: string };
  className?: string;
}

export function NavbarLink({ route, className }: NavbarLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={route.href}
      className={cn(pathname === route.href && 'text-accent', className)}
    >
      {route.label}
    </Link>
  );
}
