'use client';

import React from 'react';
import { Card, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Title level={3} className="!text-slate-900 !mb-1 !font-bold">
          Recruitment Analytics & ROI
        </Title>
        <Text className="text-slate-500 text-xs">
          Cost-per-hire reductions, candidate conversion rates, and AI model performance metrics.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80">
            <Text className="text-slate-400 text-xs font-semibold uppercase">Cost Per Hire Saved</Text>
            <div className="text-2xl font-black text-slate-900 mt-1">$4,850</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">62% below agency fees</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80">
            <Text className="text-slate-400 text-xs font-semibold uppercase">Offer Acceptance Rate</Text>
            <div className="text-2xl font-black text-slate-900 mt-1">94.8%</div>
            <div className="text-xs text-indigo-600 font-semibold mt-1">+18% with AI matching</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80">
            <Text className="text-slate-400 text-xs font-semibold uppercase">Avg Screening Time</Text>
            <div className="text-2xl font-black text-slate-900 mt-1">1.4 Mins</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">Down from 4.2 hours</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200/80">
            <Text className="text-slate-400 text-xs font-semibold uppercase">Candidate Satisfaction</Text>
            <div className="text-2xl font-black text-slate-900 mt-1">4.9 / 5.0</div>
            <div className="text-xs text-amber-500 font-semibold mt-1">Instant feedback loop</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
