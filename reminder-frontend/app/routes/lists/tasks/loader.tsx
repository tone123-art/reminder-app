import type { LoaderFunctionArgs } from "react-router";
import type { Task } from "~/lib/types/task";
import { redirect } from "react-router";

type LoaderData = {
    tasklist : Task[];
}


export default async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie") ?? "";
  const apiBase = import.meta.env.VITE_API_URL;

  if (!apiBase) {
    throw new Response("VITE_API_URL missing", { status: 500 });
  }

  const res = await fetch(`${apiBase}/api/tasks/`, {
    headers: cookie ? { Cookie: cookie } : undefined,
    credentials: "include",
  });

  if (res.status === 401) {
    // not logged in (or SSR request without cookies) -> go to login
    throw redirect(`/login?redirectTo=/tasks`);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Response(`Tasks failed: ${res.status}\n${body}`, { status: res.status });
  }

  const tasklist = (await res.json()) as Task[];
  return { tasklist };
}


