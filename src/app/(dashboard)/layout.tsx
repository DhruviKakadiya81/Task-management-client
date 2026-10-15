"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Loader2,
  User as UserIcon,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUIStore } from "@/stores/ui-store";
import { authApi } from "@/services/auth-api";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

  // Redirect to login if unauthenticated once loading completes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully");
      queryClient.clear();
      router.push("/login");
    } catch {
      toast.error("Error logging out");
    }
  };

  const navLinks = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: ListTodo,
      active: pathname.startsWith("/tasks"),
    },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-border flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-bold text-lg tracking-tight"
          >
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span>TaskFlow</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & logout section */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "..."}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive/30"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-6 border-b border-border bg-card/50 backdrop-blur-xs flex items-center justify-between lg:justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Welcome, <strong className="text-foreground">{user?.name || "Guest"}</strong>
            </span>
          </div>
        </header>

        {/* Main page children: Always rendered so Next.js never drops child segments */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading TaskFlow...</p>
            </div>
          ) : !isAuthenticated ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : null}

          {/* Children is always rendered in DOM to satisfy Next.js route segment validation */}
          <div className={!isAuthenticated || isLoading ? "hidden" : "block"}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
