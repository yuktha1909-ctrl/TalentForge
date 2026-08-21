'use client';

import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Badge,
  Input,
  Dropdown,
  Tag,
  Tooltip,
  Space,
  Typography,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  RobotOutlined,
  UserOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  TeamOutlined,
  SwapOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, role, logout, switchRole } = useAuth();

  // If on login page, render full screen login UI without AppShell wrapper
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Define role-specific navigation menu items
  const getNavItems = (currentRole: UserRole): MenuProps['items'] => {
    switch (currentRole) {
      case 'hiring-manager':
        return [
          {
            key: '/dashboard/hiring-manager',
            icon: <DashboardOutlined className="text-base" />,
            label: <Link href="/dashboard/hiring-manager">HM Dashboard</Link>,
          },
          {
            key: '/jobs',
            icon: <FileTextOutlined className="text-base" />,
            label: <Link href="/jobs">Team Requisitions</Link>,
          },
          {
            key: '/candidates',
            icon: <UsergroupAddOutlined className="text-base" />,
            label: <Link href="/candidates">Shortlisted Candidates</Link>,
          },
          {
            key: '/interviews',
            icon: <CalendarOutlined className="text-base" />,
            label: <Link href="/interviews">Debriefs & Scorecards</Link>,
          },
          {
            key: '/analytics',
            icon: <BarChartOutlined className="text-base" />,
            label: <Link href="/analytics">Hiring Velocity</Link>,
          },
          {
            type: 'divider',
            className: 'my-3 bg-slate-800',
          },
          {
            key: '/settings',
            icon: <SettingOutlined className="text-base" />,
            label: <Link href="/settings">Preferences</Link>,
          },
        ];

      case 'admin':
        return [
          {
            key: '/dashboard/admin',
            icon: <SafetyCertificateOutlined className="text-base text-cyan-400" />,
            label: <Link href="/dashboard/admin">Admin Console</Link>,
          },
          {
            key: '/dashboard/recruiter',
            icon: <DashboardOutlined className="text-base" />,
            label: <Link href="/dashboard/recruiter">Recruiter Overview</Link>,
          },
          {
            key: '/dashboard/hiring-manager',
            icon: <TeamOutlined className="text-base" />,
            label: <Link href="/dashboard/hiring-manager">HM Workflows</Link>,
          },
          {
            key: '/jobs',
            icon: <FileTextOutlined className="text-base" />,
            label: <Link href="/jobs">All Requisitions</Link>,
          },
          {
            key: '/analytics',
            icon: <BarChartOutlined className="text-base" />,
            label: <Link href="/analytics">Platform Analytics</Link>,
          },
          {
            type: 'divider',
            className: 'my-3 bg-slate-800',
          },
          {
            key: '/settings',
            icon: <SettingOutlined className="text-base" />,
            label: <Link href="/settings">AI Agent & Security</Link>,
          },
        ];

      case 'recruiter':
      default:
        return [
          {
            key: '/dashboard/recruiter',
            icon: <DashboardOutlined className="text-base" />,
            label: <Link href="/dashboard/recruiter">Pipeline Dashboard</Link>,
          },
          {
            key: '/candidates',
            icon: <UsergroupAddOutlined className="text-base" />,
            label: <Link href="/candidates">Candidates</Link>,
          },
          {
            key: '/jobs',
            icon: <FileTextOutlined className="text-base" />,
            label: <Link href="/jobs">Requisitions</Link>,
          },
          {
            key: '/ai-screening',
            icon: <ThunderboltOutlined className="text-base text-amber-400" />,
            label: (
              <span className="flex items-center justify-between">
                <Link href="/ai-screening">AI Match Engine</Link>
                <Tag color="purple" className="text-[10px] uppercase font-bold px-1.5 py-0 border-0 ml-1">
                  AI
                </Tag>
              </span>
            ),
          },
          {
            key: '/interviews',
            icon: <CalendarOutlined className="text-base" />,
            label: <Link href="/interviews">Interviews</Link>,
          },
          {
            key: '/analytics',
            icon: <BarChartOutlined className="text-base" />,
            label: <Link href="/analytics">Analytics & ROI</Link>,
          },
          {
            type: 'divider',
            className: 'my-3 bg-slate-800',
          },
          {
            key: '/settings',
            icon: <SettingOutlined className="text-base" />,
            label: <Link href="/settings">Settings</Link>,
          },
        ];
    }
  };

  const roleLabelMap: Record<UserRole, { label: string; color: string }> = {
    recruiter: { label: 'Recruiter', color: 'indigo' },
    'hiring-manager': { label: 'Hiring Manager', color: 'purple' },
    admin: { label: 'System Admin', color: 'cyan' },
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div className="py-1">
          <div className="font-semibold text-slate-800 text-sm">{user?.name || 'Talent User'}</div>
          <div className="text-xs text-slate-500">{user?.email}</div>
          <Tag color={roleLabelMap[role]?.color || 'blue'} className="mt-1.5 text-[10px] font-semibold">
            {roleLabelMap[role]?.label || role}
          </Tag>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'switch-header',
      label: <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch Role Preview</span>,
      disabled: true,
    },
    {
      key: 'switch-recruiter',
      icon: <DashboardOutlined className="text-indigo-500" />,
      label: 'Recruiter View',
      onClick: () => switchRole('recruiter'),
    },
    {
      key: 'switch-hm',
      icon: <TeamOutlined className="text-purple-500" />,
      label: 'Hiring Manager View',
      onClick: () => switchRole('hiring-manager'),
    },
    {
      key: 'switch-admin',
      icon: <SafetyCertificateOutlined className="text-cyan-500" />,
      label: 'System Admin View',
      onClick: () => switchRole('admin'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-rose-500" />,
      danger: true,
      label: 'Sign Out',
      onClick: logout,
    },
  ];

  const notificationItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="py-1 max-w-xs">
          <div className="font-medium text-slate-800 text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            AI Sourcing Complete
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-0">
            Found 14 top-tier candidates for &apos;Staff AI Engineer&apos; (94%+ match).
          </p>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className="py-1 max-w-xs">
          <div className="font-medium text-slate-800 text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Interview Confirmed
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-0">
            Elena Rostova confirmed architecture round for tomorrow 2:00 PM.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen bg-slate-50">
      {/* Root Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={80}
        className="fixed left-0 top-0 bottom-0 z-30 shadow-xl border-r border-slate-800/60 transition-all duration-300"
        style={{
          background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800/80">
          <div className="w-9 h-9 min-w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-lg">
            <RobotOutlined className="text-xl" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white font-sans">
                  TALENT<span className="text-indigo-400">FORGE</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Next-Gen Recruiting
              </span>
            </div>
          )}
        </div>

        {/* Current Active Role Badge */}
        {!collapsed && (
          <div className="mx-3 my-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {role === 'recruiter' ? 'Recruiter' : role === 'hiring-manager' ? 'Hiring Lead' : 'Admin'} Mode
              </span>
            </div>
            <Tag color={role === 'admin' ? 'cyan' : role === 'hiring-manager' ? 'purple' : 'indigo'} className="m-0 text-[10px] font-medium border-0">
              Active
            </Tag>
          </div>
        )}

        {/* Dynamic Role Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname || `/dashboard/${role}`]}
          items={getNavItems(role)}
          className="border-r-0 mt-1 px-1 bg-transparent"
        />

        {/* Bottom Workspace Info */}
        {!collapsed && (
          <div className="absolute bottom-4 left-3 right-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
            <Text className="text-slate-400 text-xs block mb-1">Autonomous Sourcing</Text>
            <div className="text-[11px] font-semibold text-indigo-300 flex items-center justify-center gap-1">
              <CheckCircleFilled className="text-emerald-400" /> 18 Active Workflows
            </div>
          </div>
        )}
      </Sider>

      {/* Main Layout Area */}
      <Layout
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: collapsed ? 80 : 260 }}
      >
        {/* Header with Talent Forge Brand & Recruiter Tools */}
        <Header className="sticky top-0 z-20 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-600 hover:text-indigo-600 hover:bg-slate-100 h-9 w-9 flex items-center justify-center rounded-lg"
              aria-label="Toggle sidebar"
            />

            {/* Global Search */}
            <div className="hidden sm:block w-72 md:w-80">
              <Input
                prefix={<SearchOutlined className="text-slate-400" />}
                placeholder="Search candidates, skills, requisitions..."
                className="bg-slate-100/80 border-slate-200 hover:bg-white focus:bg-white rounded-lg text-xs"
                allowClear
              />
            </div>
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Action Button */}
            {role === 'recruiter' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="hidden sm:inline-flex items-center bg-indigo-600 hover:bg-indigo-500 font-medium text-xs shadow-md shadow-indigo-600/20 rounded-lg"
              >
                New Job Opening
              </Button>
            )}

            {role === 'hiring-manager' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="hidden sm:inline-flex items-center bg-purple-600 hover:bg-purple-500 font-medium text-xs shadow-md shadow-purple-600/20 rounded-lg"
              >
                Request Requisition
              </Button>
            )}

            {role === 'admin' && (
              <Tag color="cyan" className="font-semibold text-xs py-0.5 px-2">
                <SafetyCertificateOutlined className="mr-1" /> Root Admin Privileges
              </Tag>
            )}

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Notifications Dropdown */}
            <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']}>
              <Badge count={2} size="small" offset={[-2, 4]} color="#4F46E5">
                <Button
                  type="text"
                  icon={<BellOutlined className="text-lg text-slate-600" />}
                  className="rounded-lg h-9 w-9 flex items-center justify-center hover:bg-slate-100"
                />
              </Badge>
            </Dropdown>

            {/* User Profile & Role Switcher */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <button className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer border-0 bg-transparent text-left">
                <Avatar
                  size={34}
                  src={user?.avatar}
                  className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-semibold shadow-sm"
                >
                  {user?.name?.slice(0, 2).toUpperCase() || 'TF'}
                </Avatar>
                <div className="hidden lg:flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name || 'Talent User'}
                    </span>
                    <Tag color={roleLabelMap[role]?.color} className="text-[9px] px-1 py-0 m-0 font-bold uppercase">
                      {role === 'hiring-manager' ? 'HM' : role}
                    </Tag>
                  </div>
                  <span className="text-[10px] text-slate-500">{user?.title || 'Recruiter'}</span>
                </div>
              </button>
            </Dropdown>
          </div>
        </Header>

        {/* Page Content */}
        <Content className="p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </Content>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/50">
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
            <span>© {new Date().getFullYear()} Talent Forge Inc. Role-Based AI Recruitment Platform.</span>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="hover:text-indigo-600 cursor-pointer">Security & Compliance</span>
              <span>•</span>
              <span className="hover:text-indigo-600 cursor-pointer">API Status</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">All AI Engines Operational</span>
            </div>
          </div>
        </footer>
      </Layout>
    </Layout>
  );
}
