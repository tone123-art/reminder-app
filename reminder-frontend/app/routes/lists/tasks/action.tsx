import { redirect, type ActionFunctionArgs } from "react-router";

export default async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const cookieHeader = request.headers.get("Cookie") ?? "";

  // helper so you don't repeat yourself
  async function backendFetch(url: string, init: RequestInit) {
    const res = await fetch(url, {
      ...init,
      credentials: "include",
      headers: {
        ...(init.headers || {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    if (res.status === 401) {
      throw redirect(`/login?redirectTo=/tasks`);
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Response(body || "Backend request failed", { status: res.status });
    }

    return res;
  }

  if (intent === "toggle") {
    const task_id = Number(formData.get("task_id"));
    const completed = formData.get("completed");

    const res = await backendFetch(`${import.meta.env.VITE_API_URL}/api/tasks/completed`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id, completed }),
    });

    return await res.json();
  }

  if (intent === "update") {
    const name = formData.get("name");
    const priority = formData.get("priority");
    const deadlineRaw = formData.get("deadline");
    const task_id = Number(formData.get("task_id"));

    const payload = {
      name: typeof name === "string" ? name : undefined,
      priority: typeof priority === "string" ? priority : undefined,
      deadline:
        typeof deadlineRaw === "string"
          ? (deadlineRaw.trim() === "" ? null : deadlineRaw)
          : undefined,
      task_id,
    };

    const res = await backendFetch(`${import.meta.env.VITE_API_URL}/api/tasks/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await res.json();
  }

  throw new Response("Unknown intent", { status: 400 });
}
