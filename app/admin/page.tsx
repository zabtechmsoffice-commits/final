"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Clock3,
  Database,
  Loader2,
  Shield,
  SlidersHorizontal,
  Zap,
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
import { StatCard, PanelCard } from "@/components/panels";
import type { AdminEntityKey } from "@/lib/admin/types";
import { useAdminPanelMetadata } from "@/lib/hooks/use-admin-panel";

function getEntityHref(entityKey: AdminEntityKey): string {
  switch (entityKey) {
    case "settings":
      return "/admin/settings";
    case "prayer_times":
      return "/admin/prayer-times";
    case "profiles":
    case "posts":
      return "/admin/community";
    case "donations":
      return "/admin/finance";
    default:
      return `/admin/${entityKey}`;
  }
}

export default function AdminDashboardPage() {
  const { data, loading, refresh } = useAdminPanelMetadata();

  const entityCount = data?.entities.length ?? 0;
  const totalRecords = (data?.entities ?? []).reduce(
    (sum, entity) => sum + (typeof entity.count === "number" ? entity.count : 0),
    0
  );
  const enabledModules = Object.values(data?.moduleSettings ?? {}).filter(Boolean).length;

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
                  className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Realtime Admin
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="gap-1.5 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Role Enforced
                </Badge>
                <Badge 
                  variant="secondary"
                  className="gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium Panel
                </Badge>
              </div>
              <div>
                <h1 className="heading-xl text-foreground">
                  Admin Dashboard
                </h1>
                <p className="mt-3 max-w-3xl body-sm text-muted-foreground leading-relaxed">
                  Manage all entities, settings, and permissions from this comprehensive control surface. Real-time updates across your entire organization.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/admin/prayer-times">
                <Button variant="outline" className="gap-2 transition-premium">
                  <Clock3 className="h-4 w-4" />
                  Prayer Times
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="gap-2 transition-premium">
                  <SlidersHorizontal className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Link href="/admin/control-center">
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
                  <p className="text-sm font-medium text-muted-foreground">Managed Entities</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : entityCount}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/15 border border-primary/20 p-3 transition-premium group-hover:bg-primary/20 group-hover:shadow-md">
                  <Database className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="pt-2 border-t border-primary/10">
                <p className="text-xs text-muted-foreground font-medium">Data management</p>
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

          <div className="group rounded-2xl border border-green-500/15 bg-gradient-to-br from-green-500/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-green-500/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-green-500/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Enabled Modules</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : enabledModules}
                  </p>
                </div>
                <div className="rounded-xl bg-green-500/15 border border-green-500/20 p-3 transition-premium group-hover:bg-green-500/20 group-hover:shadow-md">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="pt-2 border-t border-green-500/10">
                <p className="text-xs text-muted-foreground font-medium">Active modules</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/8 via-card to-transparent shadow-elevation-sm transition-premium hover:border-blue-500/30 hover:shadow-elevation-md hover:bg-gradient-to-br hover:from-blue-500/12 hover:via-card hover:to-transparent">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Sync Status</p>
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    Live
                  </p>
                </div>
                <div className="rounded-xl bg-blue-500/15 border border-blue-500/20 p-3 transition-premium group-hover:bg-blue-500/20 group-hover:shadow-md">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="pt-2 border-t border-blue-500/10">
                <p className="text-xs text-muted-foreground font-medium">Real-time sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* Entity Overview */}
        <PanelCard
          icon={<Database className="h-5 w-5" />}
          title="Entity Overview"
          description="Access and manage all your organization's core entities and data types"
          variant="elevated"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
              className="gap-1.5 transition-premium"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Refresh
            </Button>
          }
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading entities...</p>
            </div>
          ) : !data || data.entities.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border/40 bg-muted/20 p-12 text-center">
              <Database className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No admin entities available for your role
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.entities.map((entity) => (
                <Link key={entity.key} href={getEntityHref(entity.key)}>
                  <div className="group relative h-full rounded-lg border border-border/50 bg-card/50 p-5 transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <div className="relative space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                            {entity.label}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {entity.description}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary"
                          className="shrink-0 bg-primary/10 text-primary font-semibold"
                        >
                          {typeof entity.count === "number" ? entity.count : "-"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {entity.capability.read && (
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                          >
                            Read
                          </Badge>
                        )}
                        {entity.capability.create && (
                          <Badge 
                            variant="outline"
                            className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                          >
                            Create
                          </Badge>
                        )}
                        {entity.capability.update && (
                          <Badge 
                            variant="outline"
                            className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                          >
                            Update
                          </Badge>
                        )}
                        {entity.capability.delete && (
                          <Badge 
                            variant="outline"
                            className="text-xs bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                          >
                            Delete
                          </Badge>
                        )}
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="group/btn mt-2 w-full justify-start px-0 text-primary hover:bg-primary/5 hover:text-primary"
                      >
                        Open {entity.label}
                        <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-200 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </PanelCard>
      </div>
    </div>
  );
}
