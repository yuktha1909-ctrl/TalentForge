'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Progress,
  Table,
  Tag,
  Button,
  Avatar,
  Typography,
  Space,
  Select,
  Tooltip,
  Switch,
  Alert,
} from 'antd';
import type { TableProps } from 'antd';
import {
  UsergroupAddOutlined,
  ClockCircleOutlined,
  ThunderboltFilled,
  StarFilled,
  RiseOutlined,
  CheckCircleFilled,
  SyncOutlined,
  RocketOutlined,
  ArrowUpOutlined,
  CheckOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface PipelineCandidate {
  id: string;
  name: string;
  avatar: string;
  targetRole: string;
  matchScore: number;
  stage: 'AI Sourced' | 'Screened' | 'Technical Round' | 'Offer Stage';
  timeInStage: string;
  source: string;
  skills: string[];
}

const initialCandidates: PipelineCandidate[] = [
  {
    id: 'c1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Staff AI Architect',
    matchScore: 98,
    stage: 'Technical Round',
    timeInStage: '1 day ago',
    source: 'Autonomous LinkedIn Sourcing',
    skills: ['LangChain', 'FastAPI', 'Next.js', 'PyTorch'],
  },
  {
    id: 'c2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Principal ML Engineer',
    matchScore: 95,
    stage: 'Offer Stage',
    timeInStage: '3 hours ago',
    source: 'GitHub Talent Discovery',
    skills: ['Vector DBs', 'Distributed AI', 'CUDA', 'Kubernetes'],
  },
  {
    id: 'c3',
    name: 'Sophia Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Lead Product Designer (AI UX)',
    matchScore: 92,
    stage: 'Screened',
    timeInStage: '5 hours ago',
    source: 'Inbound Applicant',
    skills: ['Design Systems', 'AI Co-pilots', 'Figma', 'UX Research'],
  },
  {
    id: 'c4',
    name: 'David Kalu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Staff DevOps & MLOps Architect',
    matchScore: 89,
    stage: 'AI Sourced',
    timeInStage: 'Just now',
    source: 'Autonomous Referral Engine',
    skills: ['AWS', 'Terraform', 'MLflow', 'Docker'],
  },
  {
    id: 'c5',
    name: 'Aisha Patel',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Senior NLP Research Scientist',
    matchScore: 96,
    stage: 'Screened',
    timeInStage: '20 mins ago',
    source: 'Autonomous arXiv Sourcing',
    skills: ['Transformers', 'RAG', 'Python', 'Evaluation'],
  },
];

const mockNewCandidatesPool: Omit<PipelineCandidate, 'id' | 'timeInStage'>[] = [
  {
    name: 'Julian Thorne',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Staff AI Architect',
    matchScore: 94,
    stage: 'AI Sourced',
    source: 'GitHub AI Indexer',
    skills: ['FastAPI', 'Redis', 'Python', 'Kubernetes'],
  },
  {
    name: 'Clara Wu',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Principal ML Engineer',
    matchScore: 97,
    stage: 'Screened',
    source: 'Autonomous Talent Discovery',
    skills: ['LLMs', 'Fine-Tuning', 'PyTorch', 'Vector Search'],
  },
  {
    name: 'Liam Gallagher',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Staff DevOps & MLOps Architect',
    matchScore: 88,
    stage: 'AI Sourced',
    source: 'Inbound Sourcing',
    skills: ['Terraform', 'CI/CD', 'GPU Clusters', 'Prometheus'],
  },
];

export default function RecruiterDashboard() {
  const [candidatesScreened, setCandidatesScreened] = useState(1284);
  const [timeToHire] = useState(12.4);
  const [candidates, setCandidates] = useState<PipelineCandidate[]>(initialCandidates);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [lastActivity, setLastActivity] = useState('Elena Rostova matched with 98% score');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

  // Real-time data simulation loop
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      // Simulate live candidates screened ticker
      setCandidatesScreened((prev) => prev + Math.floor(Math.random() * 2) + 1);

      // Randomly simulate a new candidate discovery or stage shift
      if (Math.random() > 0.4) {
        const randomPoolItem =
          mockNewCandidatesPool[Math.floor(Math.random() * mockNewCandidatesPool.length)];
        const newCandidate: PipelineCandidate = {
          ...randomPoolItem,
          id: `c_${Date.now()}`,
          timeInStage: 'Just now',
          matchScore: Math.floor(Math.random() * 12) + 87, // 87 - 99%
        };

        setLastActivity(
          `AI Agent evaluated ${newCandidate.name} (${newCandidate.matchScore}% fit for ${newCandidate.targetRole})`
        );

        setCandidates((prev) => [newCandidate, ...prev.slice(0, 5)]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  const filteredCandidates = candidates.filter((c) =>
    selectedRoleFilter === 'all' ? true : c.targetRole.includes(selectedRoleFilter)
  );

  const columns: TableProps<PipelineCandidate>['columns'] = [
    {
      title: 'Candidate Profile',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size={40} className="border border-slate-200" />
          <div>
            <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
              {record.name}
              {record.matchScore >= 95 && (
                <Tooltip title="Top 1% AI Compatibility Tier">
                  <StarFilled className="text-amber-400 text-xs" />
                </Tooltip>
              )}
            </div>
            <div className="text-[11px] text-slate-500">{record.source}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Target Requisition & Skills',
      dataIndex: 'targetRole',
      key: 'targetRole',
      render: (_, record) => (
        <div>
          <div className="text-xs font-semibold text-slate-800 mb-1">{record.targetRole}</div>
          <div className="flex flex-wrap gap-1">
            {record.skills.slice(0, 3).map((skill) => (
              <Tag key={skill} className="text-[10px] bg-slate-100 border-slate-200 text-slate-700 m-0 px-1.5 py-0">
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Match Compatibility',
      dataIndex: 'matchScore',
      key: 'matchScore',
      render: (score: number) => {
        const color = score >= 95 ? '#10B981' : score >= 90 ? '#4F46E5' : '#F59E0B';
        return (
          <div className="w-28">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-900">{score}%</span>
              <span className="text-[10px] text-slate-400">Score</span>
            </div>
            <Progress percent={score} showInfo={false} strokeColor={color} size={['100%', 5]} />
          </div>
        );
      },
    },
    {
      title: 'Pipeline Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => {
        let color = 'default';
        if (stage === 'AI Sourced') color = 'blue';
        if (stage === 'Screened') color = 'processing';
        if (stage === 'Technical Round') color = 'purple';
        if (stage === 'Offer Stage') color = 'success';
        return <Tag color={color} className="text-xs font-medium">{stage}</Tag>;
      },
    },
    {
      title: 'Active Time',
      dataIndex: 'timeInStage',
      key: 'timeInStage',
      render: (time: string) => <span className="text-xs text-slate-500">{time}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button size="small" type="primary" className="bg-indigo-600 hover:bg-indigo-500 text-xs">
            Interview
          </Button>
          <Button size="small" className="text-xs">
            Review
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Real-Time Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <Title level={3} className="!text-slate-900 !mb-0 !font-black tracking-tight">
              Recruitment Pipeline Performance
            </Title>
            <Tag color="indigo" className="font-bold text-xs">
              Recruiter Mode
            </Tag>
          </div>
          <Text className="text-slate-500 text-xs">
            Real-time candidate discovery, multi-dimensional score distributions, and time-to-hire velocity.
          </Text>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Data Simulation Switch */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200">
            <span className="relative flex h-2.5 w-2.5">
              {isLiveUpdating && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLiveUpdating ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
              ></span>
            </span>
            <span className="text-xs font-semibold text-slate-700">Live Agent Stream</span>
            <Switch
              size="small"
              checked={isLiveUpdating}
              onChange={setIsLiveUpdating}
              className={isLiveUpdating ? 'bg-emerald-500' : ''}
            />
          </div>

          <Button
            type="primary"
            icon={<RocketOutlined />}
            className="bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg shadow-sm"
          >
            Run Agent Batch
          </Button>
        </div>
      </div>

      {/* Real-Time Status Notification Alert */}
      {isLiveUpdating && (
        <Alert
          title={
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <SyncOutlined spin className="text-indigo-600" />
                <strong className="text-slate-900">Live Agent Stream:</strong> {lastActivity}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Synced seconds ago</span>
            </div>
          }
          type="info"
          className="bg-indigo-50/60 border-indigo-100 rounded-xl"
        />
      )}

      {/* Key Metric Statistics Cards */}
      <Row gutter={[16, 16]}>
        {/* Metric 1: Candidates Screened */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">
                  Candidates Screened
                </Text>
                <div className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
                  {candidatesScreened.toLocaleString()}
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <ArrowUpOutlined className="text-[10px]" /> +18 today
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
                  <ThunderboltFilled className="text-amber-500" /> 89.2% Autonomous Screen
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl shadow-xs">
                <UsergroupAddOutlined />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Target: 1,500/mo</span>
                <span className="font-semibold text-slate-700">85.6%</span>
              </div>
              <Progress percent={85.6} showInfo={false} strokeColor="#4F46E5" size={['100%', 4]} />
            </div>
          </Card>
        </Col>

        {/* Metric 2: Average Time-to-Hire */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">
                  Average Time-to-Hire
                </Text>
                <div className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
                  {timeToHire} <span className="text-base font-semibold text-slate-500">Days</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircleFilled /> -45% vs 22-day industry target
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl shadow-xs">
                <ClockCircleOutlined />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>AI Screening Stage</span>
                <span className="font-semibold text-emerald-600">1.4 Days Avg</span>
              </div>
              <Progress percent={92} showInfo={false} strokeColor="#10B981" size={['100%', 4]} />
            </div>
          </Card>
        </Col>

        {/* Metric 3: AI Sourcing Accuracy / Match Precision */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">
                  AI Match Precision
                </Text>
                <div className="text-3xl font-black text-slate-900 mt-1">94.2%</div>
                <div className="text-[11px] text-indigo-600 font-semibold mt-2 flex items-center gap-1">
                  <StarFilled className="text-amber-400" /> High Requisition Alignment
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl shadow-xs">
                <RiseOutlined />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>HM Interview Pass Rate</span>
                <span className="font-semibold text-purple-600">91.8%</span>
              </div>
              <Progress percent={91.8} showInfo={false} strokeColor="#9333EA" size={['100%', 4]} />
            </div>
          </Card>
        </Col>

        {/* Metric 4: Pipeline Conversion Rate */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">
                  Offer Acceptance Rate
                </Text>
                <div className="text-3xl font-black text-slate-900 mt-1">96.4%</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <CheckOutlined /> 27 of 28 offers accepted
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 text-xl shadow-xs">
                <FieldTimeOutlined />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Candidate Experience</span>
                <span className="font-semibold text-cyan-600">4.9 / 5.0</span>
              </div>
              <Progress percent={96.4} showInfo={false} strokeColor="#06B6D4" size={['100%', 4]} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Match Score Distribution & Pipeline Velocity Section */}
      <Row gutter={[20, 20]}>
        {/* Match Score Distribution Visual Chart Card */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <StarFilled className="text-amber-400" />
                  <span className="font-bold text-slate-900 text-base">Match Score Distribution</span>
                </div>
                <Tag color="green" className="text-xs font-semibold m-0">
                  80%+ High Fit: 80%
                </Tag>
              </div>
            }
            className="shadow-sm border-slate-200/80"
          >
            {/* Visual Stacked Score Bar */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-700 mb-2">Overall Score Band Composition</div>
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
                <div style={{ width: '38%' }} className="bg-emerald-500 h-full" title="90-100% Elite Match (38%)"></div>
                <div style={{ width: '42%' }} className="bg-indigo-500 h-full" title="80-89% Strong Match (42%)"></div>
                <div style={{ width: '15%' }} className="bg-amber-400 h-full" title="70-79% Moderate Match (15%)"></div>
                <div style={{ width: '5%' }} className="bg-slate-300 h-full" title="<70% Unmatched (5%)"></div>
              </div>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 90-100% Elite (38%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> 80-89% Strong (42%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 70-79% Moderate (15%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> &lt;70% Low Fit (5%)
                </span>
              </div>
            </div>

            {/* Score Band Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                <div className="text-[11px] font-bold text-emerald-800 uppercase">90% - 100%</div>
                <div className="text-xl font-black text-emerald-600 mt-0.5">48</div>
                <div className="text-[10px] text-emerald-700 font-medium">Auto-Interview Eligible</div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center">
                <div className="text-[11px] font-bold text-indigo-800 uppercase">80% - 89%</div>
                <div className="text-xl font-black text-indigo-600 mt-0.5">54</div>
                <div className="text-[10px] text-indigo-700 font-medium">Recruiter Review</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                <div className="text-[11px] font-bold text-amber-800 uppercase">70% - 79%</div>
                <div className="text-xl font-black text-amber-600 mt-0.5">19</div>
                <div className="text-[10px] text-amber-700 font-medium">Secondary Pool</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-center">
                <div className="text-[11px] font-bold text-slate-700 uppercase">&lt; 70%</div>
                <div className="text-xl font-black text-slate-600 mt-0.5">7</div>
                <div className="text-[10px] text-slate-500 font-medium">Auto-Archived</div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Active Pipelines Stage Breakdown */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <div className="flex items-center justify-between py-1">
                <span className="font-bold text-slate-900 text-base">Active Pipeline Stages</span>
                <span className="text-xs text-indigo-600 font-semibold">14 Roles</span>
              </div>
            }
            className="shadow-sm border-slate-200/80"
          >
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">1. AI Autonomous Sourcing</span>
                  <span className="font-bold text-indigo-600">342 Profiles</span>
                </div>
                <Progress percent={100} showInfo={false} strokeColor="#4F46E5" size="small" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">2. Vector Screening & Match Analysis</span>
                  <span className="font-bold text-purple-600">128 Candidates</span>
                </div>
                <Progress percent={72} showInfo={false} strokeColor="#9333EA" size="small" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">3. Technical & Architectural Interviews</span>
                  <span className="font-bold text-cyan-600">34 Candidates</span>
                </div>
                <Progress percent={45} showInfo={false} strokeColor="#06B6D4" size="small" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">4. Hiring Lead Decision & Offer</span>
                  <span className="font-bold text-emerald-600">12 Candidates</span>
                </div>
                <Progress percent={22} showInfo={false} strokeColor="#10B981" size="small" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Live Pipeline Candidate Match Stream Table */}
      <Card
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">Active Candidate Stream</span>
              <Tag color="indigo" className="text-xs font-semibold m-0">
                {filteredCandidates.length} Active in View
              </Tag>
            </div>

            <div className="flex items-center gap-2">
              <Select
                size="small"
                defaultValue="all"
                value={selectedRoleFilter}
                onChange={setSelectedRoleFilter}
                style={{ width: 190 }}
                options={[
                  { value: 'all', label: 'All Target Requisitions' },
                  { value: 'AI Architect', label: 'Staff AI Architect' },
                  { value: 'ML Engineer', label: 'Principal ML Engineer' },
                  { value: 'Product Designer', label: 'Lead Product Designer' },
                  { value: 'DevOps', label: 'DevOps & MLOps' },
                ]}
              />
            </div>
          </div>
        }
        className="shadow-sm border-slate-200/80"
      >
        <div className="overflow-x-auto">
          <Table
            dataSource={filteredCandidates}
            columns={columns}
            pagination={false}
            rowKey="id"
          />
        </div>
      </Card>
    </div>
  );
}
