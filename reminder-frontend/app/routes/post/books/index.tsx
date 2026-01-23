import { useFetcher } from "react-router";
import { useRef , useEffect } from "react";
export { default as action} from "./action"
import DataPostMessage from "../postUtils/dataPostMessage"
import PostHeading from "../postUtils/postHeading";


export default function PostBook() {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  const data = fetcher.data as any;
  const errors: Record<string, string> = data?.errors || {};
  const message: string | undefined = data?.message;

  // Reset form after successful submit
  useEffect(() => {
    if (fetcher.state === "idle" && message) {
      formRef.current?.reset();
    }
  }, [fetcher.state, message]);

  return (
    <div>
    {/* Messages */}
    <DataPostMessage errors={errors} message={message} />
    
          
    {/* Heading */}
    <PostHeading heading={'Add a Book to your Reading List'} btnName={'Return' } link={'/books'}/>

  

      <fetcher.Form
        ref={formRef}
        method="post"
        className="justify-between rounded-2xl border border-slate-700 bg-slate-800 p-4"
      >
        <input type="hidden" name="intent" value="add" />

        <div className="mt-4">
          <label htmlFor="name" className="block font-medium text-xl mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="bg-white text-black w-full px-4 py-2 rounded-lg border border-gray-900 focus:border-2 focus:border-orange-400 focus:outline-none transition"
          />
          {errors.name ? (
            <p className="mt-1 text-sm text-red-300">{errors.name}</p>
          ) : null}
        </div>
              <div className="mt-4">
          <label htmlFor="author" className="block font-medium text-xl mb-1">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            
            className="bg-white text-black w-full px-4 py-2 rounded-lg border border-gray-900 focus:border-2 focus:border-orange-400 focus:outline-none transition"
          />
          {errors.author ? (
            <p className="mt-1 text-sm text-red-300">{errors.author}</p>
          ) : null}
        </div>

        <div className="mt-4">
          <label htmlFor="category" className="block font-medium text-xl mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="bg-white text-black w-full px-4 py-2 rounded-lg border border-gray-900 focus:border-2 focus:border-orange-400 focus:outline-none transition"
          >
            <option value="fiction">fiction</option>
            <option value="non-fiction">non-fiction</option>
         
            </select>
          {errors.category ? (
            <p className="mt-1 text-sm text-red-300">{errors.category}</p>
          ) : null}
        </div>

        <div className="mt-4">
          <label htmlFor="notes" className="block font-medium text-xl mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            className="bg-white text-black w-full px-4 py-2 rounded-lg border border-gray-900 focus:border-2 focus:border-orange-400 focus:outline-none transition"
          />
          {errors.notes ? (
            <p className="mt-1 text-sm text-red-300">{errors.notes}</p>
          ) : null}
        </div>

 

        <button
          type="submit"
          disabled={fetcher.state !== "idle"}
          className="btn-add"
        >
          {fetcher.state === "submitting" ? "Adding..." : "Add"}
        </button>
      </fetcher.Form>
    </div>
  );
}