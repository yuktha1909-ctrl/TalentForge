'use client';

import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Card,
  Typography,
  Divider,
  Tag,
  Alert,
  Space,
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  RobotOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  ThunderboltFilled,
  ArrowRightOutlined,
  CheckCircleFilled,
  StarFilled,
} from '@ant-design/icons';
import { useAuth, UserRole, DEMO_PROFILES } from '@/context/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState<UserRole>('recruiter');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEMO_PROFILES[role];
    if (demo) {
      form.setFieldsValue({
        email: demo.email,
        role: role,
      });
    }
  };

  const onFinish = async (values: { email: string; password?: string; role: UserRole }) => {
    setLoading(true);
    try {
      await login(values.email, values.password, values.role || selectedRole);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    const demo = DEMO_PROFILES[role];
    handleRoleChange(role);
    form.setFieldsValue({
      email: demo.email,
      password: 'demo-password-123',
      role: role,
    });
    login(demo.email, 'demo-password-123', role);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Column: AI Recruitment Showcase */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-r border-indigo-900/30">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold">
              <RobotOutlined className="text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  TALENT<span className="text-indigo-400">FORGE</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-widest">
                  AI AGENT
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Autonomous Talent Acquisition Platform</span>
            </div>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <ThunderboltFilled className="text-amber-400" />
            Next-Gen Autonomous Agent v2.4
          </div>

          <Title level={1} className="!text-white !font-black !text-4xl leading-tight tracking-tight">
            Supercharge hiring with role-specific AI intelligence.
          </Title>

          <Paragraph className="!text-slate-300 text-base leading-relaxed">
            Multi-dimensional resume vector scoring, automated candidate sourcing, structured scorecard debriefs, and enterprise security governance.
          </Paragraph>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-black text-indigo-400">89%</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Autonomous Screening</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-400">12.5 Days</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Average Time to Hire</div>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">All AI Inference Engines Online</span>
          </div>
          <span className="text-slate-500">SOC2 Type II & GDPR Compliant</span>
        </div>
      </div>

      {/* Right Column: Responsive Login Form & Role Selector */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-slate-900">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Branding Header */}
          <div className="lg:hidden flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <RobotOutlined className="text-lg" />
            </div>
            <span className="text-lg font-extrabold text-white">
              TALENT<span className="text-indigo-400">FORGE</span>
            </span>
          </div>

          <div>
            <Title level={2} className="!text-white !font-extrabold !mb-1 tracking-tight">
              Sign in to Talent Forge
            </Title>
            <Text className="text-slate-400 text-xs sm:text-sm">
              Select your role to access your dedicated recruitment workspace.
            </Text>
          </div>

          {/* Quick 1-Click Role Switchers */}
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              Quick 1-Click Demo Login
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('recruiter')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col items-start ${selectedRole === 'recruiter'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold mb-0.5">
                  <UsergroupAddOutlined /> Recruiter
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">Pipeline & Sourcing</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('hiring-manager')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col items-start ${selectedRole === 'hiring-manager'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold mb-0.5">
                  <TeamOutlined /> Hiring Lead
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">Approvals & Scores</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col items-start ${selectedRole === 'admin'
                  ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-0.5">
                  <SafetyCertificateOutlined /> Admin
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">AI & User Controls</span>
              </button>
            </div>
          </div>

          <Divider className="border-slate-800 !my-4">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">or sign in with email</span>
          </Divider>

          {/* Ant Design Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              email: DEMO_PROFILES.recruiter.email,
              password: 'password-talent-123',
              role: 'recruiter',
              remember: true,
            }}
            onFinish={onFinish}
            requiredMark={false}
          >
            {/* Role Dropdown */}
            <Form.Item
              name="role"
              label={<span className="text-slate-300 text-xs font-semibold">Active User Role</span>}
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select
                size="large"
                onChange={handleRoleChange}
                className="w-full text-slate-900"
                styles={{
                  popup: {
                    root: {
                      backgroundColor: '#1E293B',
                      color: '#fff',
                    },
                  },
                }}

              >
                <Option value="recruiter">
                  <div className="flex items-center gap-2 py-1">
                    <UsergroupAddOutlined className="text-indigo-400" />
                    <div>
                      <span className="font-semibold text-slate-900">Recruiter</span>
                      <span className="text-slate-500 text-xs ml-2">— Pipeline, Sourcing & AI Screening</span>
                    </div>
                  </div>
                </Option>
                <Option value="hiring-manager">
                  <div className="flex items-center gap-2 py-1">
                    <TeamOutlined className="text-purple-400" />
                    <div>
                      <span className="font-semibold text-slate-900">Hiring Manager</span>
                      <span className="text-slate-500 text-xs ml-2">— Shortlists, Debriefs & Scorecards</span>
                    </div>
                  </div>
                </Option>
                <Option value="admin">
                  <div className="flex items-center gap-2 py-1">
                    <SafetyCertificateOutlined className="text-cyan-400" />
                    <div>
                      <span className="font-semibold text-slate-900">Admin</span>
                      <span className="text-slate-500 text-xs ml-2">— LLM Models, Users & Security Audit</span>
                    </div>
                  </div>
                </Option>
              </Select>
            </Form.Item>

            {/* Email Field */}
            <Form.Item
              name="email"
              label={<span className="text-slate-300 text-xs font-semibold">Work Email</span>}
              rules={[
                { required: true, message: 'Please enter your work email' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined className="text-slate-400" />}
                placeholder="name@company.com"
                className="rounded-lg"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              label={
                <div className="flex items-center justify-between w-full">
                  <span className="text-slate-300 text-xs font-semibold">Password</span>
                  <a className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                </div>
              }
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="••••••••"
                className="rounded-lg"
              />
            </Form.Item>

            {/* Remember Me */}
            <Form.Item name="remember" valuePropName="checked" className="mb-4">
              <Checkbox className="text-slate-300 text-xs">
                Remember this workstation for 30 days
              </Checkbox>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<ArrowRightOutlined />}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 border-0 flex items-center justify-center gap-2"
              >
                Sign In as {selectedRole === 'recruiter' ? 'Recruiter' : selectedRole === 'hiring-manager' ? 'Hiring Manager' : 'Admin'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
