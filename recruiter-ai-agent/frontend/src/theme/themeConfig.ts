import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: '#4F46E5', // Indigo
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#06B6D4',
    borderRadius: 8,
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorBgBase: '#ffffff',
    colorTextBase: '#0f172a',
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
      siderBg: '#0f172a',
      bodyBg: '#f8fafc',
    },
    Menu: {
      darkItemBg: '#0f172a',
      darkItemSelectedBg: '#4f46e5',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
      darkItemColor: '#94a3b8',
      darkItemSelectedColor: '#ffffff',
      itemBorderRadius: 8,
      itemMarginInline: 10,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 38,
      primaryShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
    },
    Card: {
      borderRadiusLG: 12,
      headerBg: 'transparent',
    },
    Table: {
      borderRadius: 10,
      headerBg: '#f8fafc',
      headerColor: '#475569',
      rowHoverBg: '#f8fafc',
    },
    Tag: {
      borderRadiusSM: 6,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 38,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 38,
    },
  },
};

export default theme;
