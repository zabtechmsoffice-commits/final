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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant="secondary"
                className="gap-1.5 bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20"
              >
                <Shield className="h-3.5 w-3.5" />
                Shura Panel
              </Badge>
              <Badge 
                variant="secondary"
                className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20"
              >
                <Building2 className="h-3.5 w-3.5" />
                All Mosques
              </Badge>
              <Badge 
                variant="secondary"
                className="gap-1.5 bg-accent/10 text-accent hover:bg-accent/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Network Control
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Shura Operations Dashboard
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Oversee every mosque in the application, dispatch teams, assign tasks, monitor imam appointments, and keep network-wide operations moving from one live workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              onClick={refresh}
              className="gap-1.5"
            >
              <Activity className="h-4 w-4" />
              Refresh
            </Button>
            <Link href="/shura/control-center">
              <Button className="gap-1.5">
                <Database className="h-4 w-4" />
                Control Center
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent hover:border-primary/40 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Mosques</p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? "..." : entityCount.mosques ?? 0}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-accent/5 via-accent/2 to-transparent hover:border-accent/40 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Operations Teams</p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? "..." : entityCount.management_teams ?? 0}
                  </p>
                </div>
                <div className="rounded-lg bg-accent/10 p-3">
                  <BriefcaseBusiness className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-blue-500/2 to-transparent hover:border-blue-500/40 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Open Tasks</p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? "..." : entityCount.mosque_tasks ?? 0}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-emerald-500/2 to-transparent hover:border-emerald-500/40 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Imam Appointments</p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? "..." : entityCount.imams ?? 0}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-3">
                  <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shura Workflows */}
        <PanelCard
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          title="Shura Workflows"
          description="Manage mosques, coordinate teams, assign work, and track progress across your entire network"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="group relative h-full rounded-lg border border-border/50 bg-card/50 p-5 transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div className="relative space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg p-2.5 ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                          {item.label}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="group/btn mt-2 w-full justify-start px-0 text-primary hover:bg-primary/5 hover:text-primary"
                    >
                      Open
                      <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-200 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </PanelCard>

        {/* Activity Feed */}
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
