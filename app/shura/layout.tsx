"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BellRing,
  BriefcaseBusiness,
  Building2,
  Calendar,
  ChevronLeft,
  Clock3,
  Database,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Shield,
  Sun,
  ListTodo,
  UserPlus,
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

type ShuraSidebarItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  entityKey?: AdminEntityKey;
  alwaysVisible?: boolean;
};

const sidebarItems: ShuraSidebarItem[] = [
  { name: "Overview", href: "/shura", icon: Shield, alwaysVisible: true },
  {
    name: "Control Center",
    href: "/shura/control-center",
    icon: Database,
    alwaysVisible: true,
  },
  {
    name: "Mosque Network",
    href: "/shura/mosques",
    icon: Building2,
    entityKey: "mosques",
    alwaysVisible: true,
  },
  {
    name: "Operations Teams",
    href: "/shura/teams",
    icon: BriefcaseBusiness,
    entityKey: "management_teams",
    alwaysVisible: true,
  },
  {
    name: "Task Dispatch",
    href: "/shura/tasks",
    icon: ListTodo,
    entityKey: "mosque_tasks",
    alwaysVisible: true,
  },
  {
    name: "Imam Appointments",
    href: "/shura/imams",
    icon: UserPlus,
    entityKey: "imams",
    alwaysVisible: true,
  },
  {
    name: "Prayer Times",
    href: "/shura/prayer-times",
    icon: Clock3,
    entityKey: "prayer_times",
    alwaysVisible: true,
  },
  {
    name: "Events",
    href: "/shura/events",
    icon: Calendar,
    entityKey: "events",
    alwaysVisible: true,
  },
  {
    name: "Announcements",
    href: "/shura/announcements",
    icon: BellRing,
    entityKey: "announcements",
    alwaysVisible: true,
  },
  {
    name: "Community",
    href: "/shura/community",
    icon: MessageSquare,
    entityKey: "posts",
    alwaysVisible: true,
  },
];

function hasVisibleEntity(
  metadata: AdminEntitiesResponse | null,
  entityKey: AdminEntityKey
): boolean {
  return Boolean(metadata?.entities.some((entity) => entity.key === entityKey));
}

function getBadgeCount(
  metadata: AdminEntitiesResponse | null,
  entityKey?: AdminEntityKey
): number | null {
  if (!metadata || !entityKey) {
    return null;
  }

  const entity = metadata.entities.find((entry) => entry.key === entityKey);
  return typeof entity?.count === "number" ? entity.count : null;
}

function SidebarContent({ pathname }: { pathname: string }) {
  const { theme, setTheme } = useTheme();
  const { profile, signOut } = useAuth();
  const { data: metadata, loading: metadataLoading } = useAdminPanelMetadata();

  const filteredItems = useMemo(
    () =>
      sidebarItems.filter((item) => {
        if (!metadata || !item.entityKey) {
          return item.alwaysVisible ?? true;
        }

        return hasVisibleEntity(metadata, item.entityKey);
      }),
    [metadata]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header Section */}
      <div className="border-b border-sidebar-border/60 bg-gradient-to-b from-sidebar-primary/8 to-sidebar px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <Shield className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-base font-bold tracking-tight text-sidebar-foreground">
                Shura Panel
              </h1>
              <p className="text-xs text-sidebar-foreground/55 line-clamp-2">
                All-mosque oversight workspace
              </p>
            </div>
          </div>
          {metadataLoading ? (
            <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-sidebar-foreground/50" />
          ) : (
            <Badge
              variant="outline"
              className="shrink-0 border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300"
            >
              Network
            </Badge>
          )}
        </div>
        {metadata ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="border-sidebar-border/50 bg-sidebar-accent/50 text-sidebar-foreground/80 text-xs"
            >
              {metadata.entities.length} surfaces
            </Badge>
            <Badge
              variant="secondary"
              className="border-sidebar-border/50 bg-sidebar-accent/50 text-sidebar-foreground/80 text-xs"
            >
              Multi-mosque
            </Badge>
          </div>
        ) : null}
      </div>

      {/* Profile Section */}
      {profile ? (
        <div className="border-b border-sidebar-border/60 px-6 py-4">
          <p className="text-sm font-semibold text-sidebar-foreground truncate">
            {profile.full_name || profile.email}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-teal-500/30 bg-teal-500/10 text-xs font-medium text-teal-700 dark:text-teal-300"
            >
              {getRoleDisplayName(profile.role)}
            </Badge>
          </div>
        </div>
      ) : null}

      {/* Navigation Section */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/shura" && pathname.startsWith(item.href));
            const badgeCount = getBadgeCount(metadata, item.entityKey);
            const isOverview = item.href === "/shura";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-teal-500/15 text-teal-700 dark:text-teal-300 shadow-sm"
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
                    className="h-5 min-w-5 shrink-0 rounded-full bg-teal-500/20 px-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300"
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

export default function ShuraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requiredRoles={["shura", "admin", "super_admin"]}>
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
              <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span className="font-semibold">MosqueConnect Shura</span>
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
