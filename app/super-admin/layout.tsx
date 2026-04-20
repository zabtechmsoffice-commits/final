"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Building2,
  ChevronLeft,
  Crown,
  Database,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth, getRoleDisplayName } from "@/lib/auth";
import { useAdminPanelMetadata } from "@/lib/hooks/use-admin-panel";
import { cn } from "@/lib/utils";

type SuperAdminSidebarItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badgeKey?: "entities" | "profiles";
  alwaysVisible?: boolean;
};

const sidebarItems: SuperAdminSidebarItem[] = [
  { name: "Overview", href: "/super-admin", icon: LayoutDashboard, alwaysVisible: true },
  {
    name: "Control Center",
    href: "/super-admin/control-center",
    icon: Database,
    badgeKey: "entities",
    alwaysVisible: true,
  },
  {
    name: "User Governance",
    href: "/super-admin/users",
    icon: UserCog,
    badgeKey: "profiles",
    alwaysVisible: true,
  },
  {
    name: "Global Settings",
    href: "/super-admin/settings",
    icon: Settings,
    alwaysVisible: true,
  },
  {
    name: "Admin Panel",
    href: "/admin",
    icon: Building2,
    alwaysVisible: true,
  },
];

function SidebarContent({ pathname }: { pathname: string }) {
  const { theme, setTheme } = useTheme();
  const { profile, signOut } = useAuth();
  const { data: metadata, loading: metadataLoading } = useAdminPanelMetadata();

  const profileCount = useMemo(() => {
    const profileEntity = metadata?.entities.find((entity) => entity.key === "profiles");
    return typeof profileEntity?.count === "number" ? profileEntity.count : null;
  }, [metadata?.entities]);

  function getBadgeValue(item: SuperAdminSidebarItem) {
    if (item.badgeKey === "entities") {
      return metadata?.entities.length ?? null;
    }

    if (item.badgeKey === "profiles") {
      return profileCount;
    }

    return null;
  }

  return (
    <>
      {/* Dark Mode Sidebar */}
      <div className="hidden dark:flex dark:h-full dark:flex-col bg-sidebar">
        {/* Header Section - Premium gradient */}
        <div className="border-b border-sidebar-border/40 bg-gradient-to-b from-sidebar-accent/60 to-sidebar px-5 py-5 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/20 border border-sidebar-primary/30">
                <Crown className="h-5 w-5 text-sidebar-primary" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h1 className="text-sm font-bold tracking-tight text-sidebar-foreground truncate">
                  Super Admin
                </h1>
                <p className="text-xs text-sidebar-foreground/60 line-clamp-1">
                  Platform governance
                </p>
              </div>
            </div>
            {metadataLoading ? (
              <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-sidebar-foreground/40" />
            ) : (
              <Badge className="shrink-0 bg-sidebar-primary/25 text-sidebar-primary border-sidebar-primary/40 text-xs">
                Elevated
              </Badge>
            )}
          </div>
          {metadata ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="bg-sidebar-accent/40 text-sidebar-foreground/70 text-xs border-sidebar-border/30">
                {metadata.entities.length} surfaces
              </Badge>
              <Badge variant="secondary" className="bg-sidebar-accent/40 text-sidebar-foreground/70 text-xs border-sidebar-border/30">
                {Object.values(metadata.moduleSettings).filter(Boolean).length} modules
              </Badge>
            </div>
          ) : null}
        </div>

        {/* Profile Section */}
        {profile && (
          <div className="border-b border-sidebar-border/40 px-5 py-3.5 shrink-0 bg-sidebar-accent/30">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">
              {profile.full_name || profile.email}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge className="bg-sidebar-primary/20 text-sidebar-primary border-sidebar-primary/30 text-xs">
                {getRoleDisplayName(profile.role)}
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <ScrollArea className="flex-1 min-h-0">
          <nav className="space-y-0.5 px-3 py-3">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/super-admin" && pathname.startsWith(item.href));
              const badgeCount = getBadgeCount(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary/20 text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-xs">{item.name}</span>
                  </span>
                  {badgeCount != null && (
                    <Badge className="h-5 min-w-5 shrink-0 rounded-full bg-sidebar-primary/30 px-1 text-xs font-semibold text-sidebar-primary border-sidebar-primary/40">
                      {badgeCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer Section */}
        <div className="shrink-0 space-y-1 border-t border-sidebar-border/40 bg-sidebar-accent/40 p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-sidebar-foreground/70 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground transition-colors text-xs"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-3.5 w-3.5" />
            ) : (
              <Moon className="mr-2 h-3.5 w-3.5" />
            )}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </Button>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 text-sidebar-foreground/70 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground transition-colors text-xs"
            >
              <ChevronLeft className="mr-2 h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors text-xs"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Light Mode Sidebar - Premium Prayer Times Style */}
      <div className="flex dark:hidden h-full flex-col bg-white">
        {/* Header Section - Premium Card */}
        <div className="border-b border-teal-200/60 bg-gradient-to-br from-teal-50/90 to-cyan-50/40 px-5 py-4 shrink-0 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h1 className="text-sm font-bold tracking-tight text-slate-900 truncate">
                  Super Admin
                </h1>
                <p className="text-xs text-slate-500 line-clamp-1">
                  Platform governance
                </p>
              </div>
            </div>
            {metadataLoading ? (
              <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-slate-400" />
            ) : (
              <Badge className="shrink-0 bg-teal-100 text-teal-800 border border-teal-300 text-xs font-semibold">
                Elevated
              </Badge>
            )}
          </div>
          {metadata ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="bg-white/70 text-teal-700 text-xs border border-teal-200 font-medium shadow-xs">
                {metadata.entities.length} surfaces
              </Badge>
              <Badge variant="secondary" className="bg-white/70 text-teal-700 text-xs border border-teal-200 font-medium shadow-xs">
                {Object.values(metadata.moduleSettings).filter(Boolean).length} modules
              </Badge>
            </div>
          ) : null}
        </div>

        {/* Profile Section */}
        {profile && (
          <div className="border-b border-teal-200/40 px-5 py-3 shrink-0 bg-teal-50/50">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {profile.full_name || profile.email}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge className="bg-teal-100 text-teal-800 border border-teal-300 text-xs font-medium">
                {getRoleDisplayName(profile.role)}
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <ScrollArea className="flex-1 min-h-0 bg-gradient-to-b from-white to-slate-50/40">
          <nav className="space-y-1 px-3 py-3">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/super-admin" && pathname.startsWith(item.href));
              const badgeCount = getBadgeCount(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-teal-100/90 to-cyan-100/50 text-teal-900 border border-teal-300/70 shadow-sm"
                      : "text-slate-700 hover:bg-gradient-to-r hover:from-teal-50/80 hover:to-cyan-50/40 hover:text-slate-900 hover:border hover:border-teal-200/50 hover:shadow-xs"
                  )}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <item.icon className="h-4 w-4 shrink-0 text-teal-700" />
                    <span className="truncate text-xs font-medium">{item.name}</span>
                  </span>
                  {badgeCount != null && (
                    <Badge className="h-5 min-w-5 shrink-0 rounded-full bg-teal-600 text-white px-1 text-xs font-bold shadow-sm">
                      {badgeCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer Section */}
        <div className="shrink-0 space-y-1 border-t border-teal-200/40 bg-gradient-to-br from-teal-50/40 to-white p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-slate-700 hover:bg-teal-50/80 hover:text-slate-900 hover:border hover:border-teal-200/40 transition-all text-xs font-medium"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-3.5 w-3.5" />
            ) : (
              <Moon className="mr-2 h-3.5 w-3.5" />
            )}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </Button>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 text-slate-700 hover:bg-teal-50/80 hover:text-slate-900 hover:border hover:border-teal-200/40 transition-all text-xs font-medium"
            >
              <ChevronLeft className="mr-2 h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border hover:border-red-200/40 transition-all text-xs font-medium"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Section */}
      <div className="shrink-0 space-y-1 border-t border-sidebar-border/40 bg-sidebar-accent/40 p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-8 text-sidebar-foreground/70 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground transition-colors text-xs"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="mr-2 h-3.5 w-3.5" />
          ) : (
            <Moon className="mr-2 h-3.5 w-3.5" />
          )}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </Button>
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-sidebar-foreground/70 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground transition-colors text-xs"
          >
            <ChevronLeft className="mr-2 h-3.5 w-3.5" />
            <span>Back</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors text-xs"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requiredRoles={["super_admin"]}>
      <div className="flex min-h-screen bg-background">
        <aside className="fixed inset-y-0 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
          <SidebarContent pathname={pathname} />
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-64 bg-sidebar p-0 text-sidebar-foreground"
          >
            <SidebarContent pathname={pathname} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 border-l border-slate-200/50 dark:border-sidebar-border/20 lg:pl-64">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
            </Sheet>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="font-semibold">MosqueConnect Super Admin</span>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden">
            <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
