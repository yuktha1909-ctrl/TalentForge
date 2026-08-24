'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiLogin } from '@/lib/api';

export type UserRole = 'recruiter' | 'hiring-manager' | 'admin';

function normalizeRole(raw: string): UserRole {
  if (raw === 'hiring_manager' || raw === 'hiring-manager') return 'hiring-manager';
  if (raw === 'admin') return 'admin';
  return 'recruiter';
}

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
  token: string | null;
  isDemoMode: boolean;
  login: (email?: string, password?: string, selectedRole?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'talent_forge_auth',
  ROLE: 'talent_forge_role',
  TOKEN: 'talent_forge_token',
  DEMO: 'talent_forge_demo',
};

function safeGetItem(key: string): string | null {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined') localStorage.setItem(key, value);
  } catch {}
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined') localStorage.removeItem(key);
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(() => {
    const storedAuth = safeGetItem(STORAGE_KEYS.AUTH);
    const storedRole = safeGetItem(STORAGE_KEYS.ROLE) as UserRole | null;
    if (storedAuth === 'true' && storedRole && DEMO_PROFILES[storedRole]) {
      return DEMO_PROFILES[storedRole];
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => safeGetItem(STORAGE_KEYS.TOKEN));
  const [isDemoMode, setIsDemoMode] = useState<boolean>(
    () => safeGetItem(STORAGE_KEYS.DEMO) === 'true'
  );

  const login = async (
    email?: string,
    password?: string,
    selectedRole: UserRole = 'recruiter'
  ): Promise<boolean> => {
    if (email && password) {
      try {
        const authData = await apiLogin({ email, password });
        const backendRole = normalizeRole(authData.user.role);

        const profile: UserProfile = {
          id: String(authData.user.id),
          name: authData.user.full_name || authData.user.email,
          email: authData.user.email,
          role: backendRole,
          avatar: DEMO_PROFILES[backendRole]?.avatar || DEMO_PROFILES.recruiter.avatar,
          title: `${authData.user.role.replace('_', ' ')} at TalentForge`,
          department: 'TalentForge',
        };

        setUser(profile);
        setToken(authData.access_token);
        setIsDemoMode(false);

        safeSetItem(STORAGE_KEYS.AUTH, 'true');
        safeSetItem(STORAGE_KEYS.ROLE, backendRole);
        safeSetItem(STORAGE_KEYS.TOKEN, authData.access_token);
        safeSetItem(STORAGE_KEYS.DEMO, 'false');

        router.push(`/dashboard/${backendRole}`);
        return true;
      } catch (err) {
        if (err instanceof Error) {
          const isNetworkError =
            err.message.includes('fetch') ||
            err.message.includes('Failed to fetch') ||
            err.message.includes('NetworkError') ||
            err.message.includes('ECONNREFUSED');

          if (!isNetworkError) {
            throw err;
          }
          console.warn('[AuthContext] Backend unreachable — activating demo mode.');
        }
      }
    }

    const demo = DEMO_PROFILES[selectedRole];
    const profile: UserProfile = demo || {
      id: `usr_${Date.now()}`,
      name: email?.split('@')[0] || 'Talent User',
      email: email || `${selectedRole}@talentforge.ai`,
      role: selectedRole,
      avatar: DEMO_PROFILES.recruiter.avatar,
      title: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Specialist`,
      department: 'Talent Acquisition',
    };

    setUser(profile);
    setToken(null);
    setIsDemoMode(true);

    safeSetItem(STORAGE_KEYS.AUTH, 'true');
    safeSetItem(STORAGE_KEYS.ROLE, selectedRole);
    safeRemoveItem(STORAGE_KEYS.TOKEN);
    safeSetItem(STORAGE_KEYS.DEMO, 'true');

    router.push(`/dashboard/${selectedRole}`);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsDemoMode(false);
    safeSetItem(STORAGE_KEYS.AUTH, 'false');
    safeRemoveItem(STORAGE_KEYS.ROLE);
    safeRemoveItem(STORAGE_KEYS.TOKEN);
    safeRemoveItem(STORAGE_KEYS.DEMO);
    router.push('/login');
  };

  const switchRole = (newRole: UserRole) => {
    if (DEMO_PROFILES[newRole]) {
      setUser(DEMO_PROFILES[newRole]);
      setIsDemoMode(true);
      safeSetItem(STORAGE_KEYS.AUTH, 'true');
      safeSetItem(STORAGE_KEYS.ROLE, newRole);
      safeSetItem(STORAGE_KEYS.DEMO, 'true');
      router.push(`/dashboard/${newRole}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'recruiter',
        isAuthenticated: !!user,
        token,
        isDemoMode,
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
