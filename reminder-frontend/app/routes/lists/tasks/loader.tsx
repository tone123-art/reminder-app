import type { LoaderFunctionArgs } from "react-router";
import type { Task } from "~/lib/types/task";

type LoaderData = {
    tasklist : Task[];
}

export default async function loader({request}:LoaderFunctionArgs){

    const cookieHeader = request.headers.get('Cookie');

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
    credentials: "include",
    headers: {
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
    }
  });
    if (!res.ok) {
    throw new Response("Failed to load tasks", { status: 500 });
    }

    const tasklist = (await res.json()) as Task[];
  return {tasklist}
  }


