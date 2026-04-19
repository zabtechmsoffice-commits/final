"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Building2,
  Calendar,
  Clock3,
  ChevronLeft,
  Database,
  DollarSign,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  Menu,
  Moon,
  Settings,
  Sun,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { AdminEntitiesResponse, AdminEntityKey } from "@/lib/admin/types";
import { useAuth, getRoleDisplayName } from "@/lib/auth";
import { useAdminPanelMetadata } from "@/lib/hooks/use-admin-panel";
import { cn } from "@/lib/utils";

type AdminSidebarItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  entityKey?: AdminEntityKey;
  entityKeys?: AdminEntityKey[];
  moduleKey?: string;
  superAdminOnly?: boolean;
  alwaysVisible?: boolean;
};

const sidebarItems: AdminSidebarItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, alwaysVisible: true },
  {
    name: "Control Center",
    href: "/admin/control-center",
    icon: Database,
    moduleKey: "adminControlCenter",
    alwaysVisible: true,
  },
  {
    name: "Mosques",
    href: "/admin/mosques",
    icon: Building2,
    entityKey: "mosques",
    moduleKey: "mosques",
  },
  {
    name: "Prayer Times",
    href: "/admin/prayer-times",
    icon: Clock3,
    entityKey: "prayer_times",
  },
  {
    name: "Events",
    href: "/admin/events",
    icon: Calendar,
    entityKey: "events",
    moduleKey: "events",
  },
  {
    name: "Finance",
    href: "/admin/finance",
    icon: DollarSign,
    entityKey: "donations",
    moduleKey: "donations",
  },
  {
    name: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
    entityKey: "announcements",
    moduleKey: "announcements",
  },
  {
    name: "Community",
    href: "/admin/community",
    icon: Users,
    entityKeys: ["profiles", "posts"],
    moduleKey: "community",
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: UserCog,
    entityKey: "profiles",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    alwaysVisible: true,
  },
];

function hasVisibleEntity(
  metadata: AdminEntitiesResponse | null,
  entityKey: AdminEntityKey
): boolean {
  return Boolean(metadata?.entities.some((entity) => entity.key === entityKey));
}

function getSidebarBadgeCount(
  metadata: AdminEntitiesResponse | null,
  item: AdminSidebarItem
): number | null {
  if (!metadata) {
    return null;
  }

  if (item.entityKey) {
    const entity = metadata.entities.find((entry) => entry.key === item.entityKey);
    return typeof entity?.count === "number" ? entity.count : null;
  }

  if (!item.entityKeys?.length) {
    return null;
  }

  const counts = item.entityKeys
    .map((entityKey) => metadata.entities.find((entry) => entry.key === entityKey))
    .map((entity) => entity?.count)
    .filter((count): count is number => typeof count === "number");

  return counts.length > 0 ? counts.reduce((sum, count) => sum + count, 0) : null;
}

function SidebarContent({
  pathname,
  isSuperAdmin,
}: {
  pathname: string;
  isSuperAdmin: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const { profile, signOut } = useAuth();
  const { data: metadata, loading: metadataLoading } = useAdminPanelMetadata();

  const filteredItems = useMemo(
    () =>
      sidebarItems.filter((item) => {
        if (item.superAdminOnly && !isSuperAdmin) {
          return false;
        }

        if (!metadata) {
          return true;
        }

        if (item.moduleKey && metadata.moduleSettings[item.moduleKey] === false) {
          return false;
        }

        if (item.entityKey && !hasVisibleEntity(metadata, item.entityKey)) {
          return false;
        }

        if (
          item.entityKeys &&
          !item.entityKeys.some((entityKey) => hasVisibleEntity(metadata, entityKey))
        ) {
          return false;
        }

        return item.alwaysVisible ?? true;
      }),
    [isSuperAdmin, metadata]
  );

  const enabledModuleCount = Object.values(metadata?.moduleSettings ?? {}).filter(Boolean)
    .length;

  return (
    <div className="flex h-full flex-col">
      {/* Header Section */}
      <div className="border-b border-sidebar-border/60 bg-gradient-to-b from-sidebar-primary/8 to-sidebar px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-base font-bold tracking-tight text-sidebar-foreground">
                Admin Panel
              </h1>
              <p className="text-xs text-sidebar-foreground/55 line-clamp-2">
                Live control plane
              </p>
            </div>
          </div>
          {metadataLoading ? (
            <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-sidebar-foreground/50" />
          ) : (
            <Badge
              variant="outline"
              className="shrink-0 border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
            >
              Live
            </Badge>
          )}
        </div>
        {metadata && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="border-sidebar-border/50 bg-sidebar-accent/50 text-sidebar-foreground/80 text-xs"
            >
              {enabledModuleCount} modules
            </Badge>
            <Badge
              variant="secondary"
              className="border-sidebar-border/50 bg-sidebar-accent/50 text-sidebar-foreground/80 text-xs"
            >
              {metadata.entities.length} surfaces
            </Badge>
          </div>
        )}
      </div>

      {/* Profile Section */}
      {profile && (
        <div className="border-b border-sidebar-border/60 px-6 py-4">
          <p className="text-sm font-semibold text-sidebar-foreground truncate">
            {profile.full_name || profile.email}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-700 dark:text-blue-300"
            >
              {getRoleDisplayName(profile.role)}
            </Badge>
            {metadata?.realtimeFeed ? (
              <span className="text-xs text-sidebar-foreground/55">
                Feed: {metadata.realtimeFeed}
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* Navigation Section */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const badgeCount = getSidebarBadgeCount(metadata, item);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                )}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </span>
                {badgeCount != null && (
                  <Badge
                    variant="secondary"
                    className="h-5 min-w-5 shrink-0 rounded-full bg-blue-500/20 px-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300"
                  >
                    {badgeCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Section */}
      <div className="space-y-1.5 border-t border-sidebar-border/60 bg-gradient-to-t from-sidebar-primary/5 to-sidebar p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-8 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          <span className="text-xs">{theme === "dark" ? "Light" : "Dark"}</span>
        </Button>
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            <span className="text-xs">Back</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="text-xs">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isSuperAdmin } = useAuth();

  return (
    <ProtectedRoute requiredRoles={["admin", "super_admin"]}>
      <div className="flex min-h-screen bg-background">
        <aside className="fixed inset-y-0 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
          <SidebarContent pathname={pathname} isSuperAdmin={isSuperAdmin} />
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-64 bg-sidebar p-0 text-sidebar-foreground"
          >
            <SidebarContent pathname={pathname} isSuperAdmin={isSuperAdmin} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 lg:pl-64">
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
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">MosqueConnect Admin</span>
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
