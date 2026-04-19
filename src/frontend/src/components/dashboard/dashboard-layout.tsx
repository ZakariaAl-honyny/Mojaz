"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSurface } from "@/components/layout/dashboard-surface";
import type { UserRole } from "@/data/mock-data";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ChevronUp, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const ROLES: UserRole[] = ["applicant", "receptionist", "doctor", "examiner", "manager", "admin"];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("applicant");
  const [isLoading, setIsLoading] = useState(true);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const router = useRouter();
  const t = useTranslations("common");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("userRole") as UserRole;

    if (!isLoggedIn && process.env.NODE_ENV === "production") {
      router.push("/login");
      return;
    }

    if (userRole) {
      setRole(userRole);
    }
    setIsLoading(false);
  }, [router]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
    // Reload to ensure all components react to the new role if they read from localStorage
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 relative z-10"></div>
        </div>
      </div>
    );
  }

  return (
    <DashboardSurface className="min-h-screen">
      <div className="flex relative">
        <Sidebar
          role={role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader role={role} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-6 lg:p-12 transition-all duration-700">
            {children}
          </main>
        </div>

        {/* Dev Role Switcher - 100% Visual Verification Tool */}
        <div className="fixed bottom-8 end-8 z-[100]">
          <AnimatePresence>
            {showRoleSwitcher && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="mb-4 p-4 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl space-y-2 min-w-[200px]"
              >
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-2 mb-3">Switch Role Context</p>
                {ROLES.map((r) => (
                  <Button
                    key={r}
                    variant="ghost"
                    size="sm"
                    onClick={() => switchRole(r)}
                    className={cn(
                      "w-full justify-start gap-3 h-10 rounded-xl transition-all",
                      role === r ? "bg-primary-600/20 text-primary-400 border border-primary-500/20" : "text-neutral-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span className="font-bold capitalize">{r}</span>
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className={cn(
              "h-16 px-8 rounded-2xl shadow-2xl transition-all flex items-center gap-3 font-black tracking-widest",
              showRoleSwitcher ? "bg-primary-500 text-white" : "bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10"
            )}
          >
            <ShieldAlert className="w-6 h-6" />
            <span>{showRoleSwitcher ? "CLOSE SWITCHER" : "DEBUG ROLES"}</span>
            <ChevronUp className={cn("w-5 h-5 transition-transform", showRoleSwitcher && "rotate-180")} />
          </Button>
        </div>
      </div>
    </DashboardSurface>
  );
}
