'use client';

import React from 'react';
import { Card, Row, Col, Button, Tag, Typography, Alert } from 'antd';
import { ThunderboltFilled, RobotOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AIScreeningPage() {
  return (
    <div className="space-y-6">
      <div>
        <Title level={3} className="!text-slate-900 !mb-1 !font-bold">
          AI Candidate Screening & Match Engine
        </Title>
        <Text className="text-slate-500 text-xs">
          Multi-dimensional semantic evaluation, resume parsing, and autonomous candidate competency scoring.
        </Text>
      </div>

      <Alert
        title="Forge AI Match Engine v2.4 Running"
        description="Autonomous screening agent evaluates candidates across 24 technical dimensions, career trajectory, project complexity, and cultural alignment."
        type="info"
        showIcon
        icon={<RobotOutlined className="text-indigo-600" />}
        className="border-indigo-100 bg-indigo-50/50"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Screening Dimensions" className="shadow-sm border-slate-200/80">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Core Technical Competency</span>
                <Tag color="green">96% Accuracy</Tag>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">System Design & Scale Experience</span>
                <Tag color="blue">94% Accuracy</Tag>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Cross-Functional Leadership</span>
                <Tag color="purple">91% Accuracy</Tag>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Code Quality & GitHub Verification</span>
                <Tag color="cyan">98% Accuracy</Tag>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="Live Evaluation Breakdown" className="shadow-sm border-slate-200/80">
            <div className="p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs space-y-2 mb-4">
              <div className="text-emerald-400">✓ [Agent] Resume parsed: Elena_Rostova_CV.pdf (Vector embedding generated)</div>
              <div className="text-indigo-300">➜ [Semantic Match] Staff AI Engineer profile match: 98.2% compatibility</div>
              <div className="text-slate-400">• Synthesizing 7 Github repositories (TypeScript, Python, PyTorch)</div>
              <div className="text-amber-300">★ [Recommendation] Auto-trigger technical interview scheduler</div>
            </div>
            <Button type="primary" icon={<ThunderboltFilled />} className="bg-indigo-600 hover:bg-indigo-500">
              Run Batch AI Evaluation
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
