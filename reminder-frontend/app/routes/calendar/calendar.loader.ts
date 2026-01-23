import { type LoaderFunctionArgs } from "react-router";
import type { Appt } from "~/lib/types/calendar";

export default async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/calendar/appointments`, {
    credentials: "include",
    headers: { ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
  });
  if (!res.ok) throw new Response("Failed to load appointments", { status: 500 });
  const appointments = (await res.json()) as Appt[];
  return { appointments };
}
