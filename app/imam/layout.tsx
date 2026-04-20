"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BellRing,
  BriefcaseBusiness,
  BookOpen,
  Building2,
  Calendar,
  ChevronLeft,
  Clock3,
  Database,
  DollarSign,
  LayoutDashboard,
  Loader2,
  LogOut,
  ListTodo,
  Menu,
  MessageSquare,
  Moon,
  Sun,
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

type ImamSidebarItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  entityKey?: AdminEntityKey;
  alwaysVisible?: boolean;
};

const sidebarItems: ImamSidebarItem[] = [
  { name: "Overview", href: "/imam", icon: LayoutDashboard, alwaysVisible: true },
  {
    name: "Control Center",
    href: "/imam/control-center",
    icon: Database,
    alwaysVisible: true,
  },
  {
    name: "Mosque Settings",
    href: "/imam/mosque",
    icon: Building2,
    entityKey: "mosques",
    alwaysVisible: true,
  },
  {
    name: "Prayer Times",
    href: "/imam/prayer-times",
    icon: Clock3,
    entityKey: "prayer_times",
    alwaysVisible: true,
  },
  {
    name: "Events",
    href: "/imam/events",
    icon: Calendar,
    entityKey: "events",
    alwaysVisible: true,
  },
  {
    name: "Announcements",
    href: "/imam/announcements",
    icon: BellRing,
    entityKey: "announcements",
    alwaysVisible: true,
  },
  {
    name: "Leadership",
    href: "/imam/imams",
    icon: Users,
    entityKey: "imams",
    alwaysVisible: true,
  },
  {
    name: "Operations Team",
    href: "/imam/team",
    icon: BriefcaseBusiness,
    entityKey: "management_teams",
    alwaysVisible: true,
  },
  {
    name: "Task Board",
    href: "/imam/tasks",
    icon: ListTodo,
    entityKey: "mosque_tasks",
    alwaysVisible: true,
  },
  {
    name: "Community",
    href: "/imam/community",
    icon: MessageSquare,
    entityKey: "posts",
    alwaysVisible: true,
  },
  {
    name: "Finance",
    href: "/imam/finance",
    icon: DollarSign,
    entityKey: "donations",
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
    <div className="flex h-full flex-col bg-sidebar">
      {/* Header Section - Premium gradient */}
      <div className="border-b border-sidebar-border/40 bg-gradient-to-b from-sidebar-accent/60 to-sidebar px-5 py-5 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/20 border border-sidebar-primary/30">
              <BookOpen className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <h1 className="text-sm font-bold tracking-tight text-sidebar-foreground truncate">
                Imam Panel
              </h1>
              <p className="text-xs text-sidebar-foreground/60 line-clamp-1">
                Mosque control workspace
              </p>
            </div>
          </div>
          {metadataLoading ? (
            <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-sidebar-foreground/40" />
          ) : (
            <Badge className="shrink-0 bg-sidebar-primary/25 text-sidebar-primary border-sidebar-primary/40 text-xs">
              Scoped
            </Badge>
          )}
        </div>
        {metadata ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="bg-sidebar-accent/40 text-sidebar-foreground/70 text-xs border-sidebar-border/30">
              {metadata.entities.length} surfaces
            </Badge>
          </div>
        ) : null}
      </div>

      {/* Profile Section */}
      {profile ? (
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
      ) : null}

      {/* Navigation Section */}
      <ScrollArea className="flex-1 min-h-0">
        <nav className="space-y-0.5 px-3 py-3">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/imam" && pathname.startsWith(item.href));
            const badgeCount = getBadgeCount(metadata, item.entityKey);

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
                {badgeCount != null ? (
                  <Badge className="h-5 min-w-5 shrink-0 rounded-full bg-sidebar-primary/30 px-1 text-xs font-semibold text-sidebar-primary border-sidebar-primary/40">
                    {badgeCount}
                  </Badge>
                ) : null}
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
  );
}

export default function ImamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requiredRoles={["imam"]}>
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
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold">MosqueConnect Imam</span>
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
