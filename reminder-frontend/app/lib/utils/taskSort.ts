import type { Task } from "../types/task";

export type SortKey = "created_at" | "deadline"| "priority";
export type SortOrder = "asc" | "desc";
export type DisplayType = 'all' | 'completed' | 'active';

export function priorityBg(priority: Task['priority']) {
  switch (priority) {
    case "high":
      return "bg-[#EF4444]";
    case "medium":
      return "bg-[#F59E0B]";
    case "low":
      return "bg-[#22C55E]";
    default:
      return "bg-gray-200";
  }
}

export const priorityRank: Record<Task["priority"], number> = {
        low: 1,   medium: 2,  high: 3,
  };

export function compareTasks(a: Task, b: Task, key: SortKey) {
  if (key === "priority") return priorityRank[a.priority] - priorityRank[b.priority];

  if (key === "created_at") {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  }
 
  const da = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
  const db = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
  return da - db;
}

export function sortTasks(tasks: Task[], key: SortKey, order: SortOrder){
    
    const dir = order === "asc" ? 1 : -1;

    return [...tasks].sort((a, b) => {
      const diff = compareTasks(a, b, key);
      // tie-breaker for stable-ish ordering:
    return diff !== 0 ? diff * dir : (a.task_id - b.task_id) * dir;
    });
}