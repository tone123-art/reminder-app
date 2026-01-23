import { useFetcher } from "react-router";
import { useRef , useEffect } from "react";
export { default as action} from "./action";
import { Link } from "react-router";
import DataPostMessage from "../postUtils/dataPostMessage"
import PostHeading from "../postUtils/postHeading";




export default function PostShopping() {
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
      <PostHeading heading={'Add Item to Shopping List'} btnName={'Return' } link={'/shopping'}/>
   

      <fetcher.Form
        ref={formRef}
        method="post"
        className="list-container py-2"
      >
        <input type="hidden" name="intent" value="add" />

        <div className="mt-4">
        <label htmlFor="name" className="input-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="input-field"
          />
          {errors.name ? (
            <p className="mt-1 text-sm text-red-300">{errors.name}</p>
          ) : null}
        </div>

        <div className="mt-4">
          <label htmlFor="quantity" className="input-label">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min={1}
            step={1}
            defaultValue={1}
            required
            inputMode="numeric"
            className="input-field"
          />
          {errors.quantity ? (
            <p className="mt-1 text-sm text-red-300">{errors.quantity}</p>
          ) : null}
        </div>

        <div className="mt-4">
          <label htmlFor="notes" className="input-label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            className="input-field"
          />
          {errors.notes ? (
            <p className="mt-1 text-sm text-red-300">{errors.notes}</p>
          ) : null}
        </div>

        <div className="mt-4">
          <label htmlFor="type" className="input-label">
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            className="input-field"
            defaultValue="supermarket"
          >
            <option value="online">online</option>
            <option value="supermarket">supermarket</option>
            <option value="store">store</option>
          </select>
          {errors.store_type ? (
            <p className="mt-1 text-sm text-red-300">{errors.store_type}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={fetcher.state !== "idle"}
          className="btn-add mt-4"
        >
          {fetcher.state === "submitting" ? "Adding..." : "Add"}
        </button>
      </fetcher.Form>
    </div>
  );
}