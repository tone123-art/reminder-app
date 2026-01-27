import { useEffect, useState } from "react";
import type { FetcherWithComponents } from "react-router";

type Props = {
  fetcher: FetcherWithComponents<any>;
  open: boolean;
  onClose: () => void;
};


export default function NewAppointmentCard({ fetcher, open, onClose }: Props){
    
    const [title, setTitle] = useState("");
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [allDay, setAllDay] = useState(false);

    
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      onClose();
      setTitle("");
      setStartAt("");
      setEndAt("");
      setAllDay(false);
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!open) return null;

  const endBeforeStart =
    startAt && endAt && new Date(endAt) <= new Date(startAt);


    return(
    <div className="list-container px-4 py-4 mb-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Add appointment</h2>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 rounded-xl hover:bg-gray-100 transition"
        >
          ✕
        </button>
      </div>

      <fetcher.Form method="post" className="space-y-3">
        <input type="hidden" name="intent" value="create" />

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 bg-white text-black"
            placeholder=""
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Start</label>
            <input
              name="start_at"
              type={allDay ? "date" : "datetime-local"}
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End</label>
            <input
              name="end_at"
              type={allDay ? "date" : "datetime-local"}
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 bg-white text-black"
              required
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => {
              setAllDay(e.target.checked);
              // optional: clear values when switching modes
              setStartAt("");
              setEndAt("");
            }}
          />
          All day
        </label>

        <input type="hidden" name="all_day" value={String(allDay)} />

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={fetcher.state !== "idle"}
            className="btn-add rounded-2xl"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-delete rounded-2xl border"
          >
            Cancel
          </button>
        </div>

        {/* tiny validation hint */}
        {startAt && endAt && new Date(endAt) <= new Date(startAt) && (
          <p className="text-sm text-red-600">
            End must be after start.
          </p>
        )}
      </fetcher.Form>
    </div>
  )}

  