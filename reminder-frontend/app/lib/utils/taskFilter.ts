import { type Task} from "~/lib/types/task";
export type DisplayType = "all" | "active" | "completed";

export function matchesDisplay(task: Task, display: DisplayType) {
  if (display === "all") return true;
  if (display === "active") return !task.completed;
  return task.completed;
}