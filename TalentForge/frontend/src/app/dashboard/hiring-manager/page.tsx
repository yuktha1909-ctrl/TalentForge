'use client';

import React from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Avatar,
  Progress,
  Typography,
  Space,
  Badge,
  Tooltip,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarFilled,
  FileDoneOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
  ThunderboltFilled,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const pendingReviews = [
  {
    key: '1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Staff AI Architect',
    recruiterScore: 98,
    technicalVerdict: 'Strong Pass (5/5 Architecture & LLM Orchestration)',
    interviewer: 'David Vance (You)',
    interviewDate: 'Yesterday 2:00 PM',
    status: 'Decision Required',
  },
  {
    key: '2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Principal Machine Learning Engineer',
    recruiterScore: 95,
    technicalVerdict: 'Pass (4.8/5 Distributed Vector Pipelines)',
    interviewer: 'Sarah Jenkins (Recruiter Review)',
    interviewDate: '2 days ago',
    status: 'Ready for Offer',
  },
  {
    key: '3',
    name: 'Sophia Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Product Designer (AI UX)',
    recruiterScore: 92,
    technicalVerdict: 'Portfolio Screen Complete (4.5/5 Design Systems)',
    interviewer: 'Design Lead Panel',
    interviewDate: '3 days ago',
    status: 'Interview Pending',
  },
];

export default function HiringManagerDashboard() {
  const columns = [
    {
      title: 'Candidate Profile',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: (typeof pendingReviews)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size={40} className="border border-slate-200" />
          <div>
            <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1">
              {record.name}
              {record.recruiterScore >= 95 && <StarFilled className="text-amber-400 text-xs" />}
            </div>
            <div className="text-xs text-slate-500">{record.role}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'AI Match Score',
      dataIndex: 'recruiterScore',
      key: 'recruiterScore',
      render: (score: number) => (
        <Tag color="indigo" className="font-bold text-xs">
          <ThunderboltFilled className="mr-1 text-amber-400" /> {score}% Fit
        </Tag>
      ),
    },
    {
      title: 'Technical Debrief & Rating',
      dataIndex: 'technicalVerdict',
      key: 'technicalVerdict',
      render: (verdict: string) => (
        <div className="text-xs text-slate-700 font-medium max-w-xs">{verdict}</div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Decision Required') color = 'orange';
        if (status === 'Ready for Offer') color = 'green';
        if (status === 'Interview Pending') color = 'purple';
        return <Tag color={color} className="text-xs font-semibold">{status}</Tag>;
      },
    },
    {
      title: 'HM Action',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button size="small" type="primary" className="bg-emerald-600 hover:bg-emerald-500 text-xs">
            <CheckCircleOutlined /> Approve
          </Button>
          <Button size="small" danger className="text-xs">
            Pass
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 rounded-2xl border border-purple-900/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-medium mb-2">
              <TeamOutlined />
              <span>Hiring Manager Command Center</span>
            </div>
            <Title level={2} className="!text-white !mb-1 !font-extrabold tracking-tight">
              Engineering Department Requisitions
            </Title>
            <Paragraph className="!text-slate-300 text-xs sm:text-sm !mb-0">
              Welcome back, David. You have <strong className="text-white">2 candidates awaiting your final scorecard decision</strong> and 4 open requisitions on schedule.
            </Paragraph>
          </div>

          <Button
            type="primary"
            size="large"
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-md border-0 h-10 px-4"
          >
            Review All Debriefs
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80">
            <Text className="text-slate-500 text-xs font-semibold uppercase">Pending HM Decisions</Text>
            <div className="text-2xl font-black text-slate-900 mt-1">2</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Avg response time: 4 hours</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80">
            <Text className="text-slate-500 text-xs font-semibold uppercase">Active Team Slots</Text>
            <div className="text-2xl font-black text-slate-900 mt-1">4 Open</div>
            <div className="text-xs text-indigo-600 font-medium mt-1">Engineering & AI Platform</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80">
            <Text className="text-slate-500 text-xs font-semibold uppercase">AI Match Quality</Text>
            <div className="text-2xl font-black text-slate-900 mt-1">95.4%</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">+12% vs last quarter</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80">
            <Text className="text-slate-500 text-xs font-semibold uppercase">Time in HM Stage</Text>
            <div className="text-2xl font-black text-slate-900 mt-1">1.8 Days</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Below 3-day SLA</div>
          </Card>
        </Col>
      </Row>

      {/* Shortlisted Candidates Decision Table */}
      <Card
        title={
          <div className="flex items-center justify-between py-1">
            <span className="font-bold text-slate-900 text-base">Shortlisted Candidates Pending Decision</span>
            <Tag color="purple" className="text-xs font-semibold m-0">
              3 Candidates
            </Tag>
          </div>
        }
        className="shadow-sm border-slate-200/80"
      >
        <Table dataSource={pendingReviews} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
