'use client';

import React from 'react';
import {
  ConfigProvider,
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Typography,
  Space,
  Badge,
  Tabs,
} from 'antd';

import {
  SafetyCertificateOutlined,
  UserOutlined,
  LockOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const mockUsers = [
  {
    key: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@talentforge.ai',
    role: 'Recruiter',
    department: 'People & Talent',
    lastActive: '2 mins ago',
    status: 'Active',
  },
  {
    key: '2',
    name: 'David Vance',
    email: 'david.vance@talentforge.ai',
    role: 'Hiring Manager',
    department: 'Engineering',
    lastActive: '1 hour ago',
    status: 'Active',
  },
  {
    key: '3',
    name: 'Alex Rivera',
    email: 'alex.rivera@talentforge.ai',
    role: 'Admin',
    department: 'Security & Operations',
    lastActive: 'Just now',
    status: 'Active',
  },
  {
    key: '4',
    name: 'Rachel Kim',
    email: 'rachel.kim@talentforge.ai',
    role: 'Recruiter',
    department: 'People & Talent',
    lastActive: 'Yesterday',
    status: 'Active',
  },
];

const auditLogs = [
  {
    key: '1',
    timestamp: '2026-08-20 12:45:12',
    user: 'Sarah Jenkins (Recruiter)',
    action: 'Triggered Autonomous Batch Resume Screen',
    details: '48 resumes vector parsed for Staff AI Engineer',
    severity: 'Info',
  },
  {
    key: '2',
    timestamp: '2026-08-20 11:20:04',
    user: 'David Vance (Hiring Manager)',
    action: 'Approved Candidate Final Offer',
    details: 'Elena Rostova marked Approved for Staff AI Architect',
    severity: 'Success',
  },
  {
    key: '3',
    timestamp: '2026-08-20 09:15:30',
    user: 'Alex Rivera (Admin)',
    action: 'Switched LLM Engine',
    details: 'Default reasoning set to Gemini 3.7 Pro Thinking',
    severity: 'Warning',
  },
];

export default function AdminDashboard() {
  const userColumns = [
    {
      title: 'User Profile',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: (typeof mockUsers)[0]) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs">
            {record.name}
          </div>

          <div className="text-[11px] text-slate-500">
            {record.email}
          </div>
        </div>
      ),
    },

    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'cyan';

        if (role === 'Hiring Manager') {
          color = 'blue';
        }

        if (role === 'Admin') {
          color = 'green';
        }

        return (
          <Tag color={color} className="text-xs font-semibold">
            {role}
          </Tag>
        );
      },
    },

    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => (
        <span className="text-xs text-slate-600">
          {dept}
        </span>
      ),
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status="success"
          text={
            <span className="text-xs text-slate-700">
              {status}
            </span>
          }
        />
      ),
    },

    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button size="small" className="text-xs">
            Edit Role
          </Button>
        </Space>
      ),
    },
  ];

  const logColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (t: string) => (
        <span className="text-xs font-mono text-slate-500">
          {t}
        </span>
      ),
    },

    {
      title: 'Actor',
      dataIndex: 'user',
      key: 'user',
      render: (u: string) => (
        <span className="text-xs font-medium text-slate-800">
          {u}
        </span>
      ),
    },

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (a: string) => (
        <span className="text-xs font-semibold text-slate-900">
          {a}
        </span>
      ),
    },

    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (d: string) => (
        <span className="text-xs text-slate-600">
          {d}
        </span>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#06B6D4',
          colorInfo: '#06B6D4',
          colorLink: '#0891B2',
          borderRadius: 10,
        },
      }}
    >
      <div className="space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-medium mb-2">

                <SafetyCertificateOutlined />

                <span>
                  Platform Administration & AI Infrastructure
                </span>

              </div>

              <Title
                level={2}
                className="!text-white !mb-1 !font-extrabold tracking-tight"
              >
                Talent Forge System Console
              </Title>

              <Paragraph className="!text-slate-300 text-xs sm:text-sm !mb-0">
                Manage enterprise RBAC permissions, monitor LLM inference
                token throughput, and review compliance audit logs.
              </Paragraph>

            </div>

            <Button
              type="primary"
              icon={<ReloadOutlined />}
              className="!bg-cyan-600 hover:!bg-cyan-500 !text-white !border-cyan-600 font-semibold text-xs rounded-xl shadow-md h-10 px-4"
            >
              Refresh Health Metrics
            </Button>

          </div>
        </div>

        {/* METRICS */}
        <Row gutter={[16, 16]}>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm border-slate-200/80">

              <Text className="text-slate-500 text-xs font-semibold uppercase">
                Total Active Users
              </Text>

              <div className="text-2xl font-black text-slate-900 mt-1">
                42 Seats
              </div>

              <div className="text-xs text-emerald-600 font-medium mt-1">
                100% License Utilization
              </div>

            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm border-slate-200/80">

              <Text className="text-slate-500 text-xs font-semibold uppercase">
                AI Token Ingestion
              </Text>

              <div className="text-2xl font-black text-slate-900 mt-1">
                2.4M / Day
              </div>

              <div className="text-xs text-cyan-600 font-medium mt-1">
                Gemini 3.7 Pro Reasoning
              </div>

            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm border-slate-200/80">

              <Text className="text-slate-500 text-xs font-semibold uppercase">
                Vector Ingestion SLA
              </Text>

              <div className="text-2xl font-black text-slate-900 mt-1">
                180 ms
              </div>

              <div className="text-xs text-emerald-600 font-medium mt-1">
                Zero Latency Spikes
              </div>

            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm border-slate-200/80">

              <Text className="text-slate-500 text-xs font-semibold uppercase">
                System Uptime
              </Text>

              <div className="text-2xl font-black text-slate-900 mt-1">
                99.99%
              </div>

              <div className="text-xs text-emerald-600 font-medium mt-1">
                All Microservices Healthy
              </div>

            </Card>
          </Col>

        </Row>

        {/* TABS */}
        <Tabs
          defaultActiveKey="users"
          items={[
            {
              key: 'users',

              label: (
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  <UserOutlined />
                  User & Role Management
                </span>
              ),

              children: (
                <Card className="shadow-sm border-slate-200/80">

                  <div className="flex justify-between items-center mb-4">

                    <span className="font-bold text-slate-900 text-sm">
                      Active Workspace Members
                    </span>

                    <Button
                      type="primary"
                      size="small"
                      className="!bg-cyan-600 hover:!bg-cyan-500 !border-cyan-600"
                    >
                      + Invite User
                    </Button>

                  </div>

                  <Table
                    dataSource={mockUsers}
                    columns={userColumns}
                    pagination={false}
                  />

                </Card>
              ),
            },

            {
              key: 'audit',

              label: (
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  <LockOutlined />
                  Security & Audit Trail
                </span>
              ),

              children: (
                <Card className="shadow-sm border-slate-200/80">

                  <Table
                    dataSource={auditLogs}
                    columns={logColumns}
                    pagination={false}
                  />

                </Card>
              ),
            },
          ]}
        />

      </div>
    </ConfigProvider>
  );
}