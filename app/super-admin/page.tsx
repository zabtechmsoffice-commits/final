"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Crown,
  Database,
  Loader2,
  Settings2,
  Shield,
  UserCog,
  Users,
  TrendingUp,
  Sparkles,
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

export default function SuperAdminDashboardPage() {
  const [activity, setActivity] = useState<AdminActivityEntry[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [activityUnavailable, setActivityUnavailable] = useState(false);
  const { data, loading, refresh } = useAdminPanelMetadata();

  useEffect(() => {
    if (!data) {
      setActivity([]);
      setLoadingActivity(loading);
      return;
    }

    let cancelled = false;

    async function loadActivity() {
      setLoadingActivity(true);
      try {
        const activityResponse = await fetch("/api/admin/activity?limit=6", {
          cache: "no-store",
        }).catch(() => null);
        const activityPayload =
          activityResponse != null
            ? ((await activityResponse.json().catch(() => ({}))) as
                | AdminActivityResponse
                | { error?: string })
            : null;

        if (!cancelled) {
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
  }, [data, loading]);

  const totalRecords = (data?.entities ?? []).reduce(
    (sum, entity) => sum + (typeof entity.count === "number" ? entity.count : 0),
    0
  );
  const enabledModules = Object.values(data?.moduleSettings ?? {}).filter(Boolean).length;
  const profileCount =
    data?.entities.find((entity) => entity.key === "profiles")?.count ?? 0;

  const governanceWorkflows = [
    {
      href: "/super-admin/control-center",
      label: "Global Control Center",
      description: "Access every entity with realtime sync",
      icon: Database,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      href: "/super-admin/users",
      label: "User Governance",
      description: "Manage role hierarchy and profiles",
      icon: Users,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      href: "/super-admin/settings",
      label: "Global Settings",
      description: "Control modules and defaults",
      icon: Settings2,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      href: "/admin",
      label: "Admin Panel",
      description: "Jump to operational management",
      icon: UserCog,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
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
                  className="gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  <Crown className="h-3.5 w-3.5" />
                  Super Admin
                </Badge>
                <Badge 
                  variant="secondary"
                  className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Platform Governance
                </Badge>
                <Badge 
                  variant="secondary"
                  className="gap-1.5 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Ultimate Control
                </Badge>
              </div>
              <div>
                <h1 className="heading-xl text-foreground">
                  Super Admin Panel
                </h1>
                <p className="mt-3 max-w-3xl body-sm text-muted-foreground leading-relaxed">
                  Govern the platform layer with direct access to global control, user governance, and cross-module visibility. Manage the system with separation from day-to-day admin operations.
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
              <Link href="/admin">
                <Button variant="outline" className="gap-2 transition-premium">
                  <ArrowRight className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
              <Link href="/super-admin/control-center">
                <Button className="gap-2 transition-premium">
                  <Database className="h-4 w-4" />
                  Super Control Center
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
                  <p className="text-sm font-medium text-muted-foreground">Governed Surfaces</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : data?.entities.length ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/15 border border-primary/20 p-3 transition-premium group-hover:bg-primary/20 group-hover:shadow-md">
                  <Database className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="pt-2 border-t border-primary/10">
                <p className="text-xs text-muted-foreground font-medium">Platform entities</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-purple-500/15 bg-gradient-to-br from-purple-500/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-purple-500/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-purple-500/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Platform Users</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : profileCount}
                  </p>
                </div>
                <div className="rounded-xl bg-purple-500/15 border border-purple-500/20 p-3 transition-premium group-hover:bg-purple-500/20 group-hover:shadow-md">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="pt-2 border-t border-purple-500/10">
                <p className="text-xs text-muted-foreground font-medium">Active users</p>
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

          <div className="group rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-blue-500/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-blue-500/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Enabled Modules</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : enabledModules}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-500/15 border border-blue-500/20 p-3 transition-premium group-hover:bg-blue-500/20 group-hover:shadow-md">
                  <Settings2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="pt-2 border-t border-blue-500/10">
                <p className="text-xs text-muted-foreground font-medium">Active modules</p>
              </div>
            </div>
          </div>
        </div>

        {/* Governance Workflows */}
        <PanelCard
          icon={<Crown className="h-5 w-5" />}
          title="Governance Workflows"
          description="Platform-level actions with separation from operational management"
          variant="elevated"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {governanceWorkflows.map((item) => (
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
                      <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-200 group-hover/btn:opacity-100 group-hover/btn:translate-x-1" />
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
          title="Platform Activity"
          description="Latest mutations through the realtime bus"
        />
      </div>
    </div>
  );
}
