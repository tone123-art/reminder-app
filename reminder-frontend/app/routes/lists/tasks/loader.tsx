import type { LoaderFunctionArgs } from "react-router";
import type { Task } from "~/lib/types/task";

type LoaderData = {
    tasklist : Task[];
}

export default async function loader({request}:LoaderFunctionArgs){

    const cookie = request.headers.get("Cookie") ?? "";
const apiBase = import.meta.env.VITE_API_URL;

const res = await fetch(`${apiBase}/api/tasks/`, {
  headers: cookie ? { Cookie: cookie } : undefined,
});
    if (!res.ok) {
    throw new Response("Failed to load tasks", { status: 500 });
    }

    const tasklist = (await res.json()) as Task[];
  return {tasklist}
  }


