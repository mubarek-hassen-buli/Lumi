'use client';

import { useSession } from '@/lib/auth-client';
import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error } = useSession();
  const { setUser } = useUserStore();
  const router = useRouter();

  // Sync Better Auth session with Zustand user store
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || undefined,
      });
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  // Session is automatically managed by Better Auth
  // The useSession hook handles cookie-based persistence
  
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
