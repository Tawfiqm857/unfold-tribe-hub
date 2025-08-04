import { useState } from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  Bell,
  Settings,
  Shield
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Feed', url: '/feed', icon: MessageSquare },
  { title: 'Community', url: '/community', icon: Users },
  { title: 'Events', url: '/events', icon: Calendar },
  { title: 'Forums', url: '/forums', icon: MessageSquare },
  { title: 'Learning', url: '/learning', icon: GraduationCap },
  { title: 'Magazines', url: '/magazines', icon: BookOpen },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <SidebarContainer className="w-64" collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UT</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Unfold Tribe</h2>
              <p className="text-xs text-muted-foreground">Connect & Grow</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive(item.url) 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {user?.isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/admin" 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive('/admin') 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent"
                      )}
                    >
                      <Shield className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;