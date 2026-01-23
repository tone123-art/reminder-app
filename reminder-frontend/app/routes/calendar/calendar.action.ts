import {type ActionFunctionArgs } from "react-router";


export function toIsoFromDatetimeLocal(value: string) {
  // value like "2026-01-09T14:30" interpreted as local time
  const dt = new Date(value);
  return dt.toISOString();
}

export default async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const cookieHeader = request.headers.get("Cookie");

  if (intent === "create") {
    const title = String(formData.get("title") ?? "Appointment");
    const allDay = formData.get("all_day") === "true";
    const startRaw = String(formData.get("start_at") ?? "");
    const endRaw = String(formData.get("end_at") ?? "");

    if (!startRaw || !endRaw) throw new Error("Missing start/end");

    const start_at = allDay
    ? new Date(startRaw + "T00:00:00").toISOString()
    : toIsoFromDatetimeLocal(startRaw);

  const end_at = allDay
    ? new Date(endRaw + "T00:00:00").toISOString()
    : toIsoFromDatetimeLocal(endRaw);

  // optional validation
  if (new Date(end_at) <= new Date(start_at)) {
    throw new Error("End must be after start");
  }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/calendar/appointments`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
      body: JSON.stringify({ title, start_at, end_at }),
    });
    if (!res.ok) throw new Error("Failed to create appointment");
    return await res.json();
  }
    if (intent === "delete") {
    const id = Number(formData.get("id"));
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/calendar/appointments/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
    });
    if (!res.ok) throw new Error("Failed to delete appointment");
    return { ok: true };
  }

  if (intent === "update") {
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "");
  const allDay = formData.get("all_day") === "true";

  const startRaw = String(formData.get("start_at") ?? "");
  const endRaw = String(formData.get("end_at") ?? "");

  // Convert "datetime-local" / "date" to ISO
  const toIsoFromDatetimeLocal = (v: string) => new Date(v).toISOString();

  const start_at = allDay
    ? new Date(startRaw + "T00:00:00").toISOString()
    : toIsoFromDatetimeLocal(startRaw);

  const end_at = allDay
    ? new Date(endRaw + "T00:00:00").toISOString()
    : toIsoFromDatetimeLocal(endRaw);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/calendar/appointments/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
    body: JSON.stringify({ title, start_at, end_at, all_day: allDay }),
  });

  if (!res.ok) throw new Error("Failed to update appointment");
  return await res.json();
}
return null;
}