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
  ClipboardList,
} from 'lucide-react';

const navItems = [
  { key: 'dashboard'       as const, path: '/dashboard',       icon: LayoutDashboard },
  { key: 'courses'         as const, path: '/courses',         icon: BookOpen        },
  { key: 'educatorCourses' as const, path: '/educator/courses',icon: ClipboardList   },
  { key: 'myNfts'          as const, path: '/nfts',            icon: Award           },
  { key: 'workshops'       as const, path: '/workshops',       icon: Calendar        },
  { key: 'aiTutor'         as const, path: '/ai-tutor',        icon: Bot             },
  { key: 'leaderboard'     as const, path: '/leaderboard',     icon: Trophy          },
  { key: 'admin'           as const, path: '/admin',           icon: Shield          },
];

export default function Sidebar() {
  const { t, locale } = useI18n();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed inset-x-3 bottom-3 top-auto z-40 flex h-16 flex-row items-center rounded-2xl glass-strong border border-pink-100/60 shadow-xl shadow-pink-100/30 lg:left-0 lg:top-0 lg:bottom-auto lg:h-screen lg:w-64 lg:flex-col lg:items-stretch lg:rounded-none lg:border-r">
      {/* Logo */}
      <div className="hidden h-16 items-center gap-3 border-b border-pink-100/50 px-5 lg:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-md shadow-pink-200">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 tracking-tight">BESTEAMHN</h1>
          <p className="text-[10px] font-medium text-pink-400">AI Tutor</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 items-center gap-1 overflow-x-auto px-2 py-2 lg:block lg:space-y-1 lg:overflow-y-auto lg:px-3 lg:py-4">
        {navItems.filter(item => {
          if (item.key === 'admin')           return user?.role === 'admin';
          if (item.key === 'educatorCourses') return user?.role === 'educator' || user?.role === 'admin';
          return true;
        }).map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) =>
              `flex min-w-[3.25rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-semibold transition-base lg:min-w-0 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200/60'
                  : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-base ${
                  isActive ? 'bg-white/20' : 'bg-pink-50'
                }`}>
                  <item.icon className="h-[16px] w-[16px]" />
                </span>
                <span className="max-w-14 truncate lg:max-w-none">{t.nav[item.key]}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info & sign out */}
      <div className="hidden border-t border-pink-100/50 p-3 lg:block">
        {user && (
          <div className="flex items-center gap-3 rounded-2xl bg-pink-50/80 border border-pink-100 p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-xs font-bold text-white shadow-sm">
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              title={locale === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-base hover:bg-red-50 hover:text-red-500"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
