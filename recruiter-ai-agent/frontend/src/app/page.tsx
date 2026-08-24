'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spin } from 'antd';

export default function RootPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      router.replace(`/dashboard/${role || 'recruiter'}`);
    }
  }, [router, role, isAuthenticated]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Spin size="large" />
      <span className="text-xs text-slate-500 font-medium">Loading Talent Forge workspace...</span>
    </div>
  );
}
