"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

import { taskApi } from "@/services/task-api";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TaskDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSuccess?: () => void;
}

export function TaskDeleteDialog({
  open,
  onOpenChange,
  task,
  onSuccess,
}: TaskDeleteDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!task) return;

    try {
      setIsDeleting(true);
      await taskApi.deleteTask(task._id);
      toast.success("Task deleted successfully");

      // Invalidate relevant queries per spec
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete task";
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to delete this task?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {task && (
          <div className="p-3 my-2 rounded-lg bg-muted/60 border border-border text-sm">
            <span className="font-medium text-foreground">{task.title}</span>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
            Delete Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
