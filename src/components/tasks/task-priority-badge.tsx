import { Badge } from "@/components/ui/badge";
import { TaskPriority } from "@/types";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  switch (priority) {
    case "Low":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
          <ArrowDown className="w-3 h-3 text-slate-500" />
          Low
        </span>
      );
    case "Medium":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
          <ArrowRight className="w-3 h-3 text-orange-500" />
          Medium
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <ArrowUp className="w-3 h-3 text-rose-500" />
          High
        </span>
      );
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}
