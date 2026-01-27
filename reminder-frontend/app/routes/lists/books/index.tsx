import { useFetcher, useNavigate, useLoaderData } from "react-router"
export { default as loader} from "./loader"
export { default as action} from "./action"
import { useState } from "react";
import type { LoaderData } from "~/lib/types/books";
import ListHeading from "../listUtils/listHeading";
import ActionButtons from "../listUtils/actionButtons";

export default function BookPage(){

    const navigate = useNavigate();
    const editFetcher = useFetcher();

    const [editingId, setEditingId] = useState<number | null>(null);

    const { books }  = useLoaderData() as LoaderData;


    // Handle Update of Books
    async function handleUpdate(book_id:number) {
    setEditingId(null)  
    }

    // Handle Delete of Books
    async function handleDeleteBook(book_id: number) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${book_id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    alert("Failed to delete Book");
    return;
  } 
     navigate("/books");
  };

return (
<div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">


{/* Heading of Movies list */}
<ListHeading heading={'Books to Read'} btnName={'Add Book'} link={'/post/books'} />

{/* Movies List */}
<div className="list-container">
        
{books.length === 0 ? (
    <p className="text-slate-300">No Books yet.</p>
    ) : (
    books.map((book)=> (book.book_id === editingId 
    ?     
    (<editFetcher.Form  key={book.book_id} 
                        method="post"
                        onSubmit={()=>handleUpdate(book.book_id)}
                        >
        <div className="list-card grid grid-cols-1">
        <input type="hidden" name="intent" value="update" />
        <input name="book_id" type="hidden" value={book.book_id} /> 
         
      
        <input
        name='name'
        defaultValue={book.name}
        className="input-field-small  w-full"
        />
         <input
        name='author'
        defaultValue={book.author}
        className="input-field-small  w-full"
        />

        <select
            id="category"
            name="category"
            className="input-field-small  w-full"
            defaultValue={book.category}
        >
        <option value="fiction">fiction</option>
        <option value="non-fiction">non-fiction</option>
          
          </select>

    
      

        <input
        name='notes'
        defaultValue={book.notes ? book.notes : ''}
        className="input-field-small w-full"
        />
    
    {/* Update Button */}
        <button  
        type='submit'
        className="btn-add w-full sm:w-auto self-end"> 
        OK 
        </button>    
        </div>
    </editFetcher.Form>
    )
    :
    (
        <div
        key={book.book_id}
        className="list-card "
        >
       <div className="flex flex-col gap-2">
  <div className="flex items-start gap-2">
         <p className="    min-w-0 overflow-hidden
    [display:-webkit-box] [-webkit-box-orient:vertical]
    [-webkit-line-clamp:2]
    sm:[-webkit-line-clamp:1]">
          {book.name}  {book.author ? `by ${book.author}`: ''}
        </p>
         
            
             <span className="ml-auto rounded-lg bg-slate-700 px-2 py-1 text-xs sm:text-sm text-slate-300 whitespace-nowrap">
    {book.category}
  </span>
        
          </div>
</div>
        {book.notes ? (
            <p className="notes">{book.notes}</p>
        ) 
        : null}

       <ActionButtons handleDelete={handleDeleteBook} setEditingId={setEditingId} id={book.book_id} />
              
              </div>
          )
          ))
        )}
      </div>
    </div>
  );
}




