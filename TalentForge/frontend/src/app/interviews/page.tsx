'use client';

import React from 'react';
import { Card, Table, Tag, Button, Typography, Avatar } from 'antd';
import { CalendarOutlined, VideoCameraOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const interviews = [
  {
    key: '1',
    candidate: 'Elena Rostova',
    role: 'Senior Full Stack AI Engineer',
    interviewer: 'Sarah Jenkins + David Vance',
    time: 'Tomorrow, 2:00 PM - 3:00 PM EST',
    type: 'Technical AI Architecture Round',
    status: 'Confirmed',
  },
  {
    key: '2',
    candidate: 'Marcus Vance',
    role: 'Principal Machine Learning Engineer',
    interviewer: 'Alex Rivera (VP of AI)',
    time: 'Friday, 10:00 AM - 11:00 AM EST',
    type: 'Leadership & Distributed ML Systems',
    status: 'Awaiting Confirmation',
  },
];

export default function InterviewsPage() {
  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'candidate',
      key: 'candidate',
      render: (name: string, record: (typeof interviews)[0]) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs">{name}</div>
          <div className="text-[11px] text-slate-500">{record.role}</div>
        </div>
      ),
    },
    {
      title: 'Interview Time',
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => (
        <span className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
          <CalendarOutlined className="text-indigo-600" /> {time}
        </span>
      ),
    },
    {
      title: 'Interview Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <span className="text-xs text-slate-600">{type}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Confirmed' ? 'green' : 'orange'} className="text-xs">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button size="small" icon={<VideoCameraOutlined />} type="primary" className="bg-indigo-600 text-xs">
          Join Room
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={3} className="!text-slate-900 !mb-1 !font-bold">
            Interview Schedule
          </Title>
          <Text className="text-slate-500 text-xs">
            Automated calendar scheduling, AI debrief synthesis, and video room coordination.
          </Text>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <Table dataSource={interviews} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
