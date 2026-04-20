"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BellRing,
  BriefcaseBusiness,
  BookOpen,
  Building2,
  Calendar,
  Clock3,
  Database,
  DollarSign,
  ListTodo,
  Loader2,
  MessageSquare,
  Users,
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
import type {
  AdminActivityEntry,
  AdminActivityResponse,
  AdminListResponse,
} from "@/lib/admin/types";
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

export default function ImamDashboardPage() {
  const { data, loading, refresh } = useAdminPanelMetadata();
  const [activity, setActivity] = useState<AdminActivityEntry[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [activityUnavailable, setActivityUnavailable] = useState(false);
  const [mosqueName, setMosqueName] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      setActivity([]);
      setMosqueName(null);
      setLoadingActivity(loading);
      return;
    }

    let cancelled = false;

    async function loadScopedDashboard() {
      setLoadingActivity(true);
      try {
        const [mosqueResponse, activityResponse] = await Promise.all([
          fetch("/api/admin/entities/mosques?limit=1", { cache: "no-store" }),
          fetch("/api/admin/activity?limit=6", { cache: "no-store" }).catch(() => null),
        ]);

        const mosquePayload = (await mosqueResponse.json().catch(() => ({}))) as
          | AdminListResponse
          | { error?: string };
        const activityPayload =
          activityResponse != null
            ? ((await activityResponse.json().catch(() => ({}))) as
                | AdminActivityResponse
                | { error?: string })
            : null;

        if (!cancelled) {
          if (
            mosqueResponse.ok &&
            "items" in mosquePayload &&
            mosquePayload.items.length > 0
          ) {
            const firstMosque = mosquePayload.items[0] as Record<string, unknown>;
            setMosqueName(
              typeof firstMosque.name === "string" ? firstMosque.name : null
            );
          } else {
            setMosqueName(null);
          }

          if (
            activityResponse?.ok &&
            activityPayload != null &&
            "items" in activityPayload
          ) {
            setActivity(activityPayload.items);
            setActivityUnavailable(false);
          } else {
            setActivity([]);
            setActivityUnavailable(true);
          }
        }
      } catch {
        if (!cancelled) {
          setActivity([]);
          setMosqueName(null);
          setActivityUnavailable(true);
        }
      } finally {
        if (!cancelled) {
          setLoadingActivity(false);
        }
      }
    }

    void loadScopedDashboard();

    return () => {
      cancelled = true;
    };
  }, [data, loading]);

  const totalRecords = (data?.entities ?? []).reduce(
    (sum, entity) => sum + (typeof entity.count === "number" ? entity.count : 0),
    0
  );
  const totalEntities = data?.entities.length ?? 0;
  const prayerTimeCount =
    data?.entities.find((entity) => entity.key === "prayer_times")?.count ?? 0;

  const quickLinks = [
    {
      href: "/imam/mosque",
      label: "Mosque Settings",
      description: "Update your mosque profile and operational details.",
      icon: Building2,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      href: "/imam/prayer-times",
      label: "Prayer Times",
      description: "Maintain adhan, iqama, and Jummah schedules.",
      icon: Clock3,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      href: "/imam/events",
      label: "Events",
      description: "Publish classes, khutbahs, and community events.",
      icon: Calendar,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      href: "/imam/announcements",
      label: "Announcements",
      description: "Share urgent notices and weekly community updates.",
      icon: BellRing,
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      href: "/imam/imams",
      label: "Leadership",
      description: "Manage imam appointments, leadership bios, and active assignments.",
      icon: Users,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      href: "/imam/team",
      label: "Operations Team",
      description: "Build the working team that operates under your mosque leadership.",
      icon: BriefcaseBusiness,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
    {
      href: "/imam/tasks",
      label: "Task Board",
      description: "Assign work, track status, and keep your mosque team accountable.",
      icon: ListTodo,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      href: "/imam/community",
      label: "Community",
      description: "Moderate mosque posts and community messaging.",
      icon: MessageSquare,
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    },
    {
      href: "/imam/finance",
      label: "Finance",
      description: "Review donations tied to your mosque.",
      icon: DollarSign,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      href: "/imam/control-center",
      label: "Control Center",
      description: "Open the full mosque-scoped CRUD surface.",
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
                  className="gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Imam Panel
                </Badge>
                <Badge 
                  variant="secondary"
                  className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Mosque Scoped
                </Badge>
                <Badge 
                  variant="secondary"
                  className="gap-1.5 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium Experience
                </Badge>
              </div>
              <div>
                <h1 className="heading-xl text-foreground">
                  {mosqueName ? `${mosqueName}` : "Imam Control Center"}
                </h1>
                <p className="mt-3 max-w-3xl body-sm text-muted-foreground leading-relaxed">
                  {mosqueName
                    ? "Manage your appointed mosque's live settings, prayer schedule, announcements, leadership records, operations teams, community posts, donations, and staff tasks from one dedicated workspace."
                    : "This panel activates once your imam profile has an active mosque appointment. As soon as the appointment is live, your control center, team board, and tasks will scope automatically to that mosque."}
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
              <Link href="/imam/control-center">
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
                  <p className="text-sm font-medium text-muted-foreground">Managed Surfaces</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : totalEntities}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/15 border border-primary/20 p-3 transition-premium group-hover:bg-primary/20 group-hover:shadow-md">
                  <Database className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="pt-2 border-t border-primary/10">
                <p className="text-xs text-muted-foreground font-medium">Active surfaces</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-accent/15 bg-gradient-to-br from-accent/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-accent/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-accent/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Live Records</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : totalRecords}
                  </p>
                </div>
                <div className="rounded-xl bg-accent/15 border border-accent/20 p-3 transition-premium group-hover:bg-accent/20 group-hover:shadow-md">
                  <Activity className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="pt-2 border-t border-accent/10">
                <p className="text-xs text-muted-foreground font-medium">Active records</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-emerald-500/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-emerald-500/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Prayer Schedules</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : prayerTimeCount}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-3 transition-premium group-hover:bg-emerald-500/20 group-hover:shadow-md">
                  <Clock3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-500/10">
                <p className="text-xs text-muted-foreground font-medium">Prayer schedules</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-blue-500/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-blue-500/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loadingActivity ? <Loader2 className="h-8 w-8 animate-spin" /> : activity.length}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-500/15 border border-blue-500/20 p-3 transition-premium group-hover:bg-blue-500/20 group-hover:shadow-md">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="pt-2 border-t border-blue-500/10">
                <p className="text-xs text-muted-foreground font-medium">Latest updates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Workflows */}
        <PanelCard
          icon={<BookOpen className="h-5 w-5" />}
          title="Imam Workflows"
          description="Access mosque-scoped surfaces to manage records connected to your mosque"
          variant="elevated"
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

        {/* Activity Panel */}
        <ActivityPanel
          items={activity.map((item) => ({
            id: String(item.eventId),
            icon: <Activity className="h-4 w-4" />,
            title: formatActivityLabel(item),
            description: `${formatEntityLabel(item.entityType)} ID: ${item.entityId}`,
            timestamp: new Date(item.occurredAt).toLocaleTimeString(),
          }))}
          isEmpty={loadingActivity || activityUnavailable}
          title="Mosque Activity"
          description="Latest updates from your mosque operations"
        />
      </div>
    </div>
  );
}
