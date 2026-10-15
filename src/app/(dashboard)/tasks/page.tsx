"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Search,
  RotateCcw,
  Pencil,
  Trash2,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

import { taskApi } from "@/services/task-api";
import { Task, TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskPriorityBadge } from "@/components/tasks/task-priority-badge";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskDeleteDialog } from "@/components/tasks/task-delete-dialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  // Search & Filter state
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [priority, setPriority] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Build filter params for TanStack Query
  const filterParams = {
    search: search || undefined,
    status: status !== "All" ? status : undefined,
    priority: priority !== "All" ? priority : undefined,
    sortBy,
    order,
    page,
    limit,
  };

  // TanStack Query useQuery ONLY for data fetching per spec
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tasks", filterParams],
    queryFn: () => taskApi.getTasks(filterParams),
    enabled: !!user,
  });

  const paginatedData = response?.data;
  const tasks = paginatedData?.items || [];
  const total = paginatedData?.total || 0;
  const totalPages = paginatedData?.totalPages || 1;

  // Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("All");
    setPriority("All");
    setSortBy("createdAt");
    setOrder("desc");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || status !== "All" || priority !== "All" || sortBy !== "createdAt" || order !== "desc"
  );

  // Inline status change handler
  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      await taskApi.updateTask(task._id, { status: newStatus });
      toast.success(`Task status changed to ${newStatus}`);
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage, filter, and track all your tasks in one place.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setFormDialogOpen(true);
          }}
          className="sm:self-start"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Task
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks by title..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" className="h-8">
                Search
              </Button>
            </form>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="h-8 px-2.5 rounded-lg border border-input bg-background text-xs font-medium outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setPage(1);
                }}
                className="h-8 px-2.5 rounded-lg border border-input bg-background text-xs font-medium outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="h-8 px-2.5 rounded-lg border border-input bg-background text-xs font-medium outline-none"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>

              {/* Order Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                title="Toggle sort direction"
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
                {order.toUpperCase()}
              </Button>

              {/* Reset button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleResetFilters}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Table Card */}
      <Card className="shadow-xs">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-sm font-medium text-destructive">
                {(error as Error)?.message || "Failed to load tasks"}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-muted-foreground text-sm">
                {hasActiveFilters
                  ? "No tasks match your current filters."
                  : "No tasks created yet."}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingTask(null);
                    setFormDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add your first task
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Title & Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    {/* Title & Description */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-medium text-foreground block">
                          {task.title}
                        </span>
                        {task.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status with quick inline change */}
                    <TableCell>
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task, e.target.value as TaskStatus)
                        }
                        className="h-7 px-2 text-xs rounded border border-border bg-background cursor-pointer outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <TaskPriorityBadge priority={task.priority} />
                    </TableCell>

                    {/* Due Date */}
                    <TableCell>
                      {task.dueDate ? (
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setEditingTask(task);
                            setFormDialogOpen(true);
                          }}
                          title="Edit Task"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setDeletingTask(task);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination Controls */}
          {total > 0 && (
            <div className="px-4 py-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <div>
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} tasks
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>

                <span className="px-2 font-medium text-foreground">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog for Create / Edit */}
      <TaskFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        task={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      <TaskDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        task={deletingTask}
      />
    </div>
  );
}
