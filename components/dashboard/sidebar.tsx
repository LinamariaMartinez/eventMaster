"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";
import {
  Calendar,
  Users,
  Mail,
  BarChart3,
  Bell,
  Home,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Eventos", href: "/events", icon: Calendar },
  { name: "Invitaciones", href: "/invitations", icon: Mail },
  { name: "Invitados", href: "/guests", icon: Users },
  { name: "Estadísticas", href: "/analytics", icon: BarChart3 },
  { name: "Notificaciones", href: "/notifications", icon: Bell },
  { name: "Configuración", href: "/settings", icon: Settings },
];

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export function Sidebar() {
  // Initialize with true (collapsed) for mobile, will be updated by useEffect
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Initialize sidebar state from localStorage and detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // On mobile, always start collapsed
        setCollapsed(true);
      } else {
        // On desktop, use stored preference
        const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        if (stored !== null) {
          setCollapsed(stored === "true");
        } else {
          setCollapsed(false); // Default to expanded on desktop
        }
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Toggle sidebar and persist state
  const handleToggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);

    // Only persist on desktop
    if (!isMobile) {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newCollapsed));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada correctamente");
      // signOut now handles the redirect automatically
    } catch {
      toast.error("Error al cerrar sesión");
      // Even if signOut fails, try to redirect
      router.push("/");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-gradient-to-b from-sidebar to-sidebar-primary border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-sidebar-foreground">
            EventMaster
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground",
                  isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground",
                  !isActive &&
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "px-2",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "px-2",
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  );
}
