import React from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Calendar,
  Bot,
  Trophy,
  Shield,
  GraduationCap,
  LogOut,
} from 'lucide-react';

const navItems = [
  { key: 'dashboard' as const, path: '/dashboard', icon: LayoutDashboard },
  { key: 'courses' as const, path: '/courses', icon: BookOpen },
  { key: 'myNfts' as const, path: '/nfts', icon: Award },
  { key: 'workshops' as const, path: '/workshops', icon: Calendar },
  { key: 'aiTutor' as const, path: '/ai-tutor', icon: Bot },
  { key: 'leaderboard' as const, path: '/leaderboard', icon: Trophy },
  { key: 'admin' as const, path: '/admin', icon: Shield },
];

export default function Sidebar() {
  const { t, locale } = useI18n();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-gradient-hero">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
          <GraduationCap className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-accent-foreground">BESTEAMHN</h1>
          <p className="text-[10px] font-medium text-sidebar-foreground/60">AI Tutor</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-base ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-theme-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span>{t.nav[item.key]}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info & sign out */}
      <div className="border-t border-sidebar-border p-3">
        {user && (
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-sidebar-accent-foreground">
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-accent-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              title={locale === 'es' ? 'Cerrar Sesi\u00f3n' : 'Sign Out'}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/50 transition-base hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}