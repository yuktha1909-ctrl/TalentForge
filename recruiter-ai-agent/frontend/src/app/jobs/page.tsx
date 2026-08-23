'use client';

import React from 'react';
import { Card, Row, Col, Button, Tag, Typography, Progress } from 'antd';
import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const jobsList = [
  {
    id: '1',
    title: 'Staff AI Architect',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    openings: 1,
    candidates: 34,
    aiMatched: 12,
    progress: 75,
    status: 'Active',
  },
  {
    id: '2',
    title: 'Principal ML Engineer (Foundational Models)',
    department: 'AI Research',
    location: 'San Francisco, CA',
    type: 'Full-time',
    openings: 2,
    candidates: 58,
    aiMatched: 22,
    progress: 90,
    status: 'Active',
  },
  {
    id: '3',
    title: 'Lead Product Designer (AI Systems)',
    department: 'Product Design',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    openings: 1,
    candidates: 19,
    aiMatched: 6,
    progress: 45,
    status: 'Active',
  },
  {
    id: '4',
    title: 'Senior Distributed Systems Engineer',
    department: 'Platform Infra',
    location: 'Remote',
    type: 'Full-time',
    openings: 2,
    candidates: 41,
    aiMatched: 15,
    progress: 60,
    status: 'Active',
  },
];

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={3} className="!text-slate-900 !mb-1 !font-bold">
            Requisitions & Job Openings
          </Title>
          <Text className="text-slate-500 text-xs">
            Manage open roles, monitor sourcing velocity, and track candidate pipeline conversion.
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="bg-indigo-600 hover:bg-indigo-500 text-xs">
          Create New Requisition
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {jobsList.map((job) => (
          <Col xs={24} md={12} key={job.id}>
            <Card className="shadow-sm border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-base">{job.title}</span>
                    <Tag color="green" className="text-[10px] m-0">{job.status}</Tag>
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    {job.department} • {job.location} • {job.type}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-center">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Slots</div>
                  <div className="text-sm font-bold text-slate-800">{job.openings}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Candidates</div>
                  <div className="text-sm font-bold text-slate-800">{job.candidates}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">AI Matches</div>
                  <div className="text-sm font-bold text-indigo-600">{job.aiMatched}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Pipeline Conversion</span>
                  <span className="font-bold text-indigo-600">{job.progress}%</span>
                </div>
                <Progress percent={job.progress} strokeColor="#4F46E5" size="small" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Button size="small" type="link" className="text-indigo-600 p-0 text-xs font-semibold">
                  <ThunderboltOutlined /> Auto-Source Talent
                </Button>
                <Button size="small" className="text-xs">
                  View Pipeline
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
