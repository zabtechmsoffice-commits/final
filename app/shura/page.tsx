"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BellRing,
  BriefcaseBusiness,
  Building2,
  Calendar,
  Clock3,
  Database,
  ListTodo,
  Loader2,
  Shield,
  UserPlus,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard, PanelCard, ActivityPanel } from "@/components/panels";
import type { AdminActivityEntry, AdminActivityResponse } from "@/lib/admin/types";
import { useAdminPanelMetadata } from "@/lib/hooks/use-admin-panel";

function formatEntityLabel(entityKey: string): string {
  return entityKey
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatActivityLabel(item: AdminActivityEntry): string {
  const verb = item.eventType.split(".").at(-1) ?? "updated";
  return `${item.actorName ?? item.actorUserId} ${verb} ${formatEntityLabel(
    item.entityType
  )}`;
}

export default function ShuraDashboardPage() {
  const { data, loading, refresh } = useAdminPanelMetadata();
  const [activity, setActivity] = useState<AdminActivityEntry[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [activityUnavailable, setActivityUnavailable] = useState(false);

  const entityCount = useMemo(
    () => Object.fromEntries((data?.entities ?? []).map((entity) => [entity.key, entity.count ?? 0])),
    [data?.entities]
  ) as Record<string, number>;

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      setLoadingActivity(true);
      try {
        const response = await fetch("/api/admin/activity?limit=8", {
          cache: "no-store",
        }).catch(() => null);

        const payload =
          response != null
            ? ((await response.json().catch(() => ({}))) as
                | AdminActivityResponse
                | { error?: string })
            : null;

        if (!cancelled) {
          if (response?.ok && payload && "items" in payload) {
            setActivity(payload.items);
            setActivityUnavailable(false);
          } else {
            setActivity([]);
            setActivityUnavailable(true);
          }
        }
      } catch {
        if (!cancelled) {
          setActivity([]);
          setActivityUnavailable(true);
        }
      } finally {
        if (!cancelled) {
          setLoadingActivity(false);
        }
      }
    }

    void loadActivity();

    return () => {
      cancelled = true;
    };
  }, [data]);

  const quickLinks = [
    {
      href: "/shura/mosques",
      label: "Mosque Network",
      description: "Review every mosque in the application and keep network operations aligned.",
      icon: Building2,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      href: "/shura/teams",
      label: "Operations Teams",
      description: "Create field teams, attach members, and decide which mosque they support.",
      icon: BriefcaseBusiness,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
    {
      href: "/shura/tasks",
      label: "Task Dispatch",
      description: "Assign action items to teams and track progress across all mosques.",
      icon: ListTodo,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      href: "/shura/imams",
      label: "Imam Appointments",
      description: "Oversee imam assignments, active leadership, and appointment coverage.",
      icon: UserPlus,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      href: "/shura/prayer-times",
      label: "Prayer Times",
      description: "Ensure schedules stay accurate across the whole mosque network.",
      icon: Clock3,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      href: "/shura/events",
      label: "Events",
      description: "Coordinate the shared programming calendar and operational visibility.",
      icon: Calendar,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      href: "/shura/announcements",
      label: "Announcements",
      description: "Push important notices and follow-up communications across mosques.",
      icon: BellRing,
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      href: "/shura/control-center",
      label: "Control Center",
      description: "Open the full Shura command surface with live entity management.",
      icon: Database,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="space-y-10 p-4 sm:p-6 lg:p-8">
        {/* Header Section - Premium */}
        <div className="animate-slide-in-down space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge 
                  variant="secondary"
                  className="gap-1.5 bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Shura Panel
                </Badge>
                <Badge 
                  variant="secondary"
                  className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  All Mosques
                </Badge>
                <Badge 
                  variant="secondary"
                  className="gap-1.5 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Network Control
                </Badge>
              </div>
              <div>
                <h1 className="heading-xl text-foreground">
                  Shura Operations Dashboard
                </h1>
                <p className="mt-3 max-w-3xl body-sm text-muted-foreground leading-relaxed">
                  Oversee every mosque in the application, dispatch teams, assign tasks, monitor imam appointments, and keep network-wide operations moving from one live workspace.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button 
                variant="outline"
                onClick={refresh}
                className="gap-2 transition-premium"
              >
                <Activity className="h-4 w-4" />
                Refresh
              </Button>
              <Link href="/shura/control-center">
                <Button className="gap-2 transition-premium">
                  <Database className="h-4 w-4" />
                  Control Center
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid - Premium Cards */}
        <div className="animate-slide-in-up grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-primary/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-primary/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Mosques</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : entityCount.mosques ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/15 border border-primary/20 p-3 transition-premium group-hover:bg-primary/20 group-hover:shadow-md">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="pt-2 border-t border-primary/10">
                <p className="text-xs text-muted-foreground font-medium">Network oversight</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-accent/15 bg-gradient-to-br from-accent/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-accent/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-accent/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Operations Teams</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : entityCount.management_teams ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-accent/15 border border-accent/20 p-3 transition-premium group-hover:bg-accent/20 group-hover:shadow-md">
                  <BriefcaseBusiness className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="pt-2 border-t border-accent/10">
                <p className="text-xs text-muted-foreground font-medium">Field operations</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-blue-500/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-blue-500/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Open Tasks</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : entityCount.mosque_tasks ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-500/15 border border-blue-500/20 p-3 transition-premium group-hover:bg-blue-500/20 group-hover:shadow-md">
                  <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="pt-2 border-t border-blue-500/10">
                <p className="text-xs text-muted-foreground font-medium">Active assignments</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-emerald-500/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-emerald-500/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Imam Appointments</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : entityCount.imams ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-3 transition-premium group-hover:bg-emerald-500/20 group-hover:shadow-md">
                  <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-500/10">
                <p className="text-xs text-muted-foreground font-medium">Leadership coverage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shura Workflows - Premium */}
        <PanelCard
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          title="Shura Workflows"
          description="Manage mosques, coordinate teams, assign work, and track progress across your entire network"
          variant="elevated"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {quickLinks.map((item, index) => (
              <Link key={item.href} href={item.href}>
                <div className="group/card relative h-full overflow-hidden rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 transition-premium hover:border-primary/50 hover:bg-card hover:shadow-elevation-lg hover:shadow-primary/10 cursor-pointer" style={{animation: `slide-in-up 0.5s ease-out ${index * 50}ms both`}}>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                  
                  <div className="relative space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`rounded-xl p-2.5 transition-premium group-hover/card:scale-110 ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-1 tracking-tight">
                          {item.label}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="group/btn mt-3 w-full justify-start px-0 text-primary hover:bg-primary/5 hover:text-primary transition-premium"
                    >
                      <span className="text-xs font-semibold">Open Module</span>
                      <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-50 transition-premium group-hover/btn:opacity-100 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </PanelCard>

        {/* Activity Feed - Premium */}
        <ActivityPanel
          items={activity.map((item) => ({
            id: String(item.eventId),
            icon: <Activity className="h-4 w-4" />,
            title: formatActivityLabel(item),
            description: `${formatEntityLabel(item.entityType)} ID: ${item.entityId}`,
            timestamp: new Date(item.occurredAt).toLocaleTimeString(),
          }))}
          isEmpty={loadingActivity || activityUnavailable}
          title="Network Activity"
          description="Latest actions across all operations"
        />
      </div>
    </div>
  );
}
