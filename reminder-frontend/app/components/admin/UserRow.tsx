import {type FetcherWithComponents } from "react-router";
import type { User } from "~/lib/types/users";


export default function UserRow({user, fetcher}:{user:User, fetcher: FetcherWithComponents<any>}){


    return  (  
    <fetcher.Form method="post" className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 p-4">
      <input type="hidden" name="intent" value="delete" />
      <input type="hidden" name="userId" value={user.id} />

      <div className="flex flex-col">
        <p className="font-medium text-white">{user.username}</p>
        <p className="text-sm text-slate-400">{user.email}</p>
      </div>

      <button
        type="submit"
        disabled={fetcher.state !== "idle"}
        className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50"
      >
        {fetcher.state === "submitting" ? "Deleting…" : "Delete"}
      </button>
    </fetcher.Form>
  );
}

