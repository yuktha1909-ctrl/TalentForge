'use client';

import React from 'react';
import { Card, Form, Switch, Button, Typography, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Title level={3} className="!text-slate-900 !mb-1 !font-bold">
          System & AI Agent Settings
        </Title>
        <Text className="text-slate-500 text-xs">
          Configure autonomous agent behavior, API keys, screening strictness, and notifications.
        </Text>
      </div>

      <Card title="AI Agent Configuration" className="shadow-sm border-slate-200/80">
        <Form layout="vertical" className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <div className="font-semibold text-slate-800 text-xs">Autonomous Candidate Sourcing</div>
              <div className="text-[11px] text-slate-500">Allow AI agent to discover and match passive profiles automatically.</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <div className="font-semibold text-slate-800 text-xs">Automated Technical Screening Debriefs</div>
              <div className="text-[11px] text-slate-500">Generate executive summary & vector compatibility cards on each resume upload.</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Form.Item label="Default LLM Reasoning Engine" className="mb-0">
              <Select
                defaultValue="gemini-3.7-thinking"
                options={[
                  { value: 'gemini-3.7-thinking', label: 'Gemini 3.7 Pro Reasoning (High Precision)' },
                  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Ultra Fast)' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Minimum Match Threshold for Auto-Interview" className="mb-0">
              <Select
                defaultValue="92"
                options={[
                  { value: '95', label: '95% Compatibility Score' },
                  { value: '92', label: '92% Compatibility Score' },
                  { value: '88', label: '88% Compatibility Score' },
                ]}
              />
            </Form.Item>
          </div>

          <div className="pt-4">
            <Button type="primary" icon={<SaveOutlined />} className="bg-indigo-600">
              Save Configuration
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
