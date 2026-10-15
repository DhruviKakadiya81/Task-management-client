"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ListTodo,
  Clock,
  Loader2,
  CheckCircle2,
  Plus,
  ArrowRight,
  AlertCircle,
  Calendar,
} from "lucide-react";

import { dashboardApi } from "@/services/dashboard-api";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { TaskPriorityBadge } from "@/components/tasks/task-priority-badge";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // TanStack Query useQuery ONLY for data fetching per spec
  const {
    data: statsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardApi.getStats,
    enabled: !!user,
  });

  const stats = statsResponse?.data;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your tasks progress, metrics, and recent activities.
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="sm:self-start">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Task
        </Button>
      </div>

      {/* Metrics Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">
                {(error as Error)?.message || "Failed to load dashboard statistics"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Tasks */}
          <Card className="shadow-xs hover:border-border transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <ListTodo className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTasks ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All assigned tasks</p>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="shadow-xs hover:border-border transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingTasks ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
            </CardContent>
          </Card>

          {/* In Progress Tasks */}
          <Card className="shadow-xs hover:border-border transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                <Loader2 className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.inProgressTasks ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently working on</p>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card className="shadow-xs hover:border-border transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completedTasks ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully finished</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Tasks Card */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your 5 most recently created or updated tasks</CardDescription>
          </div>
          <Link
            href="/tasks"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            View all tasks <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : stats?.recentTasks && stats.recentTasks.length > 0 ? (
            <div className="divide-y divide-border">
              {stats.recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <TaskPriorityBadge priority={task.priority} />
                    <TaskStatusBadge status={task.status} />
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="p-3 rounded-full bg-muted w-12 h-12 mx-auto flex items-center justify-center text-muted-foreground">
                <ListTodo className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base">No tasks yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Get started by creating your first task to track your progress and stats.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Create Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <TaskFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
