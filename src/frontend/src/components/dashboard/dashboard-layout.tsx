"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";


type UserRole = string;
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Get initial role from localStorage
const getInitialRole = (): UserRole => {
  if (typeof window === 'undefined') return 'applicant';
  return (localStorage.getItem("userRole") as UserRole) || 'applicant';
};

// Check if logged in
const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem("isLoggedIn") === 'true';
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role] = useState<UserRole>(getInitialRole());
  const [isLoading, setIsLoading] = useState(!isLoggedIn());
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden" dir="rtl">
      <div className="flex h-screen w-full relative">
        <Sidebar
          role={role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <DashboardHeader role={role} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background animate-fadeIn">{children}</main>
        </div>
      </div>
    </div>
  );
}
