import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AIChatFab from './AIChatFab';

export default function DashboardLayout() {
  const location = useLocation();
  const showFab = !location.pathname.startsWith('/ai-tutor');

  return (
    <div className="min-h-screen bg-gradient-app">
      <Sidebar />
      <TopBar />
      <main className="mt-16 min-h-[calc(100vh-4rem)] px-4 py-5 pb-24 sm:px-5 lg:ml-64 lg:p-6">
        <Outlet />
      </main>
      {showFab && <AIChatFab />}
    </div>
  );
}
