# Implementation Plan: Talent Forge Frontend Setup

Create the frontend web application in `/frontend` for **Talent Forge** — an AI-powered Talent Acquisition Platform using Next.js (App Router, TypeScript), Tailwind CSS, and Ant Design (`antd`).

## Proposed Architecture & Design

1. **Framework & Setup**:
   - Next.js 14/15 (App Router, TypeScript, ESLint, Tailwind CSS) initialized in `frontend/`.
   - Ant Design (`antd`), `@ant-design/icons`, `@ant-design/nextjs-registry` for zero-FOUC App Router integration.
   - Lucide React or Ant Design icons for modern iconography.

2. **Styling & Theme Configuration**:
   - **Ant Design `ConfigProvider`**: Custom modern theme tokens (Primary: `#6366F1` indigo / AI gradient accents, slate dark/light contrast, crisp border radiuses, typography).
   - **Tailwind CSS**: Integrated with custom font family (`Inter` / `Outfit` via `next/font/google`), utility classes, and glassmorphism support.

3. **Layout & Navigation Architecture**:
   - **Root Layout (`src/app/layout.tsx`)**: Next.js App Router RootLayout wrapping `@ant-design/nextjs-registry` and custom `AntdProvider` (ConfigProvider + Theme tokens).
   - **App Shell / Layout Component (`src/components/layout/AppShell.tsx`)**:
     - **Collapsible Sidebar**: Navigation links (Dashboard, Candidates, Requisitions / Jobs, AI Screenings, Interviews, Analytics, Settings), Collapse toggle, Talent Forge AI badge.
     - **Top Header**: Talent Forge brand logo & spark AI badge, global requisition search, notifications dropdown, AI Assistant status, user profile avatar.
     - **Content Area**: Dynamic page content with clean spacing, breadcrumbs, and responsive grid.

4. **Landing / Dashboard Preview (`src/app/page.tsx`)**:
   - High-impact AI Talent Acquisition overview:
     - Stat cards: Active Jobs, Candidates Screened, Top Match % Average, AI Interviews Scheduled.
     - "AI Candidate Matcher" quick preview / spotlight.
     - Recent Candidates table with Ant Design Tag badges and AI Match score gauges.
     - Recent Activity & Quick Action requisition creator.

## Proposed Changes

### Frontend Setup & Dependencies

#### [NEW] [frontend/package.json](file:///c:/Users/Yuktha/OneDrive/Desktop/recruiter-ai-agent/frontend/package.json)
- Initialize Next.js project with TypeScript, Tailwind CSS, `antd`, `@ant-design/nextjs-registry`, `@ant-design/icons`.

#### [NEW] [frontend/src/theme/themeConfig.ts](file:///c:/Users/Yuktha/OneDrive/Desktop/recruiter-ai-agent/frontend/src/theme/themeConfig.ts)
- Define Ant Design `ThemeConfig` token overrides matching Talent Forge's AI branding.

#### [NEW] [frontend/src/components/providers/AntdProvider.tsx](file:///c:/Users/Yuktha/OneDrive/Desktop/recruiter-ai-agent/frontend/src/components/providers/AntdProvider.tsx)
- ConfigProvider wrapper with `AntdRegistry` and custom theme.

#### [NEW] [frontend/src/components/layout/AppShell.tsx](file:///c:/Users/Yuktha/OneDrive/Desktop/recruiter-ai-agent/frontend/src/components/layout/AppShell.tsx)
- Ant Design `Layout`, `Header`, `Sider`, `Content` with Talent Forge branding and navigation.

#### [NEW] [frontend/src/app/layout.tsx](file:///c:/Users/Yuktha/OneDrive/Desktop/recruiter-ai-agent/frontend/src/app/layout.tsx)
- Next.js root layout with Google Inter font, AntdProvider, and metadata.

#### [NEW] [frontend/src/app/page.tsx](file:///c:/Users/Yuktha/OneDrive/Desktop/recruiter-ai-agent/frontend/src/app/page.tsx)
- Talent Forge Dashboard with stats, AI Candidate Matching highlights, and job pipelines.

## Verification Plan

### Automated / Build Verification
- Run `npm.cmd run build` inside `frontend/` to ensure zero TypeScript errors, lint errors, or SSR hydration issues with Ant Design.

### Dev Server & Browser Verification
- Start local dev server `npm.cmd run dev` on port 3000.
- Use `browser_subagent` to load `http://localhost:3000`, test sidebar collapse, verify header branding, Ant Design components, and responsive layout.
