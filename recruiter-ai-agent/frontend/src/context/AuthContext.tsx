'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'recruiter' | 'hiring-manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  department: string;
}

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  recruiter: {
    id: 'usr_recruiter_01',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@talentforge.ai',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Talent Acquisition Partner',
    department: 'People & Talent',
  },
  'hiring-manager': {
    id: 'usr_hm_02',
    name: 'David Vance',
    email: 'david.vance@talentforge.ai',
    role: 'hiring-manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'VP of Engineering & Hiring Lead',
    department: 'Engineering & Platform',
  },
  admin: {
    id: 'usr_admin_03',
    name: 'Alex Rivera',
    email: 'alex.rivera@talentforge.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Information & AI Systems Admin',
    department: 'Security & Operations',
  },
};

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email?: string, password?: string, selectedRole?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedRole = localStorage.getItem('talent_forge_role') as UserRole | null;
        const storedAuth = localStorage.getItem('talent_forge_auth');

        if (storedAuth === 'true' && storedRole && DEMO_PROFILES[storedRole]) {
          return DEMO_PROFILES[storedRole];
        }
        if (storedAuth === 'false') {
          return null;
        }
      } catch {
        // localStorage fallback
      }
    }
    return DEMO_PROFILES.recruiter;
  });
  const router = useRouter();

  const login = async (
    email?: string,
    _password?: string,
    selectedRole: UserRole = 'recruiter'
  ): Promise<boolean> => {
    const demo = DEMO_PROFILES[selectedRole];
    const profile: UserProfile = demo
      ? demo
      : {
          id: `usr_${Date.now()}`,
          name: email?.split('@')[0] || 'Talent User',
          email: email || `${selectedRole}@talentforge.ai`,
          role: selectedRole,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          title: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Specialist`,
          department: 'Talent Acquisition',
        };

    setUser(profile);
    try {
      localStorage.setItem('talent_forge_auth', 'true');
      localStorage.setItem('talent_forge_role', selectedRole);
    } catch {}

    const targetRoute = `/dashboard/${selectedRole}`;
    router.push(targetRoute);
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.setItem('talent_forge_auth', 'false');
      localStorage.removeItem('talent_forge_role');
    } catch {}
    router.push('/login');
  };

  const switchRole = (newRole: UserRole) => {
    if (DEMO_PROFILES[newRole]) {
      setUser(DEMO_PROFILES[newRole]);
      try {
        localStorage.setItem('talent_forge_auth', 'true');
        localStorage.setItem('talent_forge_role', newRole);
      } catch {}
      router.push(`/dashboard/${newRole}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'recruiter',
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
