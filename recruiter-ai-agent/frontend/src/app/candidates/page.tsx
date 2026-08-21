'use client';

import React from 'react';
import { Card, Input, Button, Table, Tag, Avatar, Space, Typography, Select } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  UserAddOutlined,
  ThunderboltFilled,
  StarFilled,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const candidateData = [
  {
    key: '1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Full Stack AI Engineer',
    location: 'San Francisco, CA (Remote)',
    experience: '7 Years',
    score: 98,
    status: 'AI Screened',
    source: 'Autonomous LinkedIn Sourcing',
  },
  {
    key: '2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Principal Machine Learning Engineer',
    location: 'New York, NY (Hybrid)',
    experience: '9 Years',
    score: 95,
    status: 'Interview Scheduled',
    source: 'Inbound Applicant',
  },
  {
    key: '3',
    name: 'Sophia Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Product Designer (AI UX)',
    location: 'Seattle, WA (Remote)',
    experience: '6 Years',
    score: 92,
    status: 'Shortlisted',
    source: 'GitHub Talent Discovery',
  },
  {
    key: '4',
    name: 'David Kalu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Staff DevOps & MLOps Architect',
    location: 'Austin, TX (Remote)',
    experience: '8 Years',
    score: 89,
    status: 'AI Screened',
    source: 'Autonomous Referral Engine',
  },
];

export default function CandidatesPage() {
  const columns = [
    {
      title: 'Candidate Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: (typeof candidateData)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size={40} />
          <div>
            <div className="font-semibold text-slate-900 text-sm flex items-center gap-1">
              {record.name}
              {record.score >= 95 && <StarFilled className="text-amber-400 text-xs" />}
            </div>
            <div className="text-xs text-slate-500">{record.location}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Title & Experience',
      dataIndex: 'title',
      key: 'title',
      render: (_: string, record: (typeof candidateData)[0]) => (
        <div>
          <div className="text-xs font-semibold text-slate-800">{record.title}</div>
          <div className="text-[11px] text-slate-500">{record.experience}</div>
        </div>
      ),
    },
    {
      title: 'AI Fit Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Tag color={score >= 95 ? 'green' : score >= 90 ? 'indigo' : 'gold'} className="font-bold text-xs">
          <ThunderboltFilled className="mr-1" /> {score}% Match
        </Tag>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => <span className="text-xs text-slate-600">{source}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Interview Scheduled' ? 'purple' : 'blue'} className="text-xs">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button size="small" type="primary" className="bg-indigo-600 hover:bg-indigo-500 text-xs">
            Review
          </Button>
          <Button size="small" className="text-xs">
            Message
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={3} className="!text-slate-900 !mb-1 !font-bold">
            Candidate Pipeline
          </Title>
          <Text className="text-slate-500 text-xs">
            Manage, filter, and review AI-sourced candidates across all active job openings.
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={<FilterOutlined />} className="text-xs">
            Filter
          </Button>
          <Button type="primary" icon={<UserAddOutlined />} className="bg-indigo-600 hover:bg-indigo-500 text-xs">
            Add Candidate
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search by name, role, skill, or location..."
            className="flex-1"
          />
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            options={[
              { value: 'all', label: 'All Match Scores' },
              { value: '95+', label: 'Top 95%+ Fit' },
              { value: '90+', label: '90%+ Fit' },
            ]}
          />
          <Select
            defaultValue="all_status"
            style={{ width: 180 }}
            options={[
              { value: 'all_status', label: 'All Statuses' },
              { value: 'screened', label: 'AI Screened' },
              { value: 'interview', label: 'Interview Scheduled' },
            ]}
          />
        </div>

        <Table dataSource={candidateData} columns={columns} pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
}
