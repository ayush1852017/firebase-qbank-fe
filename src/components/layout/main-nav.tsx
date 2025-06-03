
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, UserCircle, Trophy, BookOpenCheck, Edit3, BarChart3, ListOrdered, FileText } from 'lucide-react'; // Added FileText
import { useUserMode } from '@/contexts/user-mode-context';

const studentNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice Feed', icon: BookOpenCheck },
  { href: '/leaderboard', label: 'Leaderboard', icon: ListOrdered },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

const creatorNavItems = [
  { href: '/dashboard', label: 'Creator Dashboard', icon: BarChart3 },
  { href: '/mcq-creator', label: 'MCQ Hub', icon: Edit3 },
  { href: '/tests', label: 'My Tests', icon: FileText }, // New "My Tests" link
  { href: '/profile', label: 'Profile', icon: UserCircle },
];


export function MainNav() {
  const pathname = usePathname();
  const { mode } = useUserMode();
  const navItems = mode === 'student' ? studentNavItems : creatorNavItems;

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
              className={cn(
                "w-full justify-start",
                (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard' && item.href !== '/')) 
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                  : 'hover:bg-primary/10 hover:text-primary'
              )}
              tooltip={{ children: item.label, side: 'right', className: 'bg-card text-card-foreground border-border' }}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
