import { useState, useEffect } from "react";
import type { FetcherWithComponents } from "react-router";
import { type Appt } from "~/lib/types/calendar";
import { toDatetimeLocal, toDateOnly } from "~/lib/utils/calendar.datetransform";
import { useRef } from "react";


type Props = {
  fetcher: FetcherWithComponents<any>;
  appt: Appt | null;
  onClose: () => void;
};
  
export default function EditAppointmentModal({ fetcher, appt, onClose }: Props){ 

    const [editTitle, setEditTitle] = useState("");
    const [editAllDay, setEditAllDay] = useState(false);
    const [editStart, setEditStart] = useState(""); // date or datetime-local string
    const [editEnd, setEditEnd] = useState("");

  useEffect(() => {
    if (!appt) return;

    const allDay = Boolean(appt.all_day);
    setEditTitle(appt.title);
    setEditAllDay(allDay);
    setEditStart(allDay ? toDateOnly(appt.start_at) : toDatetimeLocal(appt.start_at));
    setEditEnd(
      appt.end_at
        ? (allDay ? toDateOnly(appt.end_at) : toDatetimeLocal(appt.end_at))
        : ""
    );
  }, [appt]);

  // Close after successful submit
  const prevState = useRef(fetcher.state);

 useEffect(() => {
  const wasSubmitting = prevState.current !== "idle" && fetcher.state === "idle";
  if (wasSubmitting && fetcher.data) onClose();
  prevState.current = fetcher.state;
}, [fetcher.state, fetcher.data, onClose]);;

  if (!appt) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-50">
    <div className="list-container w-full max-w-lg px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Edit appointment</h2>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 rounded-xl hover:bg-gray-100 transition"
        >
          ✕
        </button>
      </div>

    <fetcher.Form method="post" className="space-y-3">
      <input type="hidden" name="intent" value="update" />
      <input type="hidden" name="id" value={appt.id} />

       <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
            name="title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 bg-white text-black"
            required
        />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Start</label>
            <input
              name="start_at"
              type={editAllDay ? "date" : "datetime-local"}
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End</label>
            <input
              name="end_at"
              type={editAllDay ? "date" : "datetime-local"}
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 bg-white text-black"
              required
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={editAllDay}
            onChange={(e) => {
              const next = e.target.checked;
              setEditAllDay(next);
              // reset formats when switching
              setEditStart("");
              setEditEnd("");
            }}
          />
          All day
        </label>
        <input type="hidden" name="all_day" value={String(editAllDay)} />

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              const ok = window.confirm("Delete this appointment?");
              if (!ok) return;
              fetcher.submit(
                { intent: "delete", id: String(appt.id) },
                { method: "post" }
              );
            }}
            className="px-4 py-2 rounded-2xl border border-red-300 text-red-700 font-semibold hover:bg-red-50 transition"
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl border font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={fetcher.state !== "idle"}
              className="px-4 py-2 rounded-2xl bg-black text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </fetcher.Form>
    </div>
  </div>

);    
};

      

