import { useFetcher, useNavigate, useLoaderData } from "react-router"
export { default as loader} from "./loader"
export { default as action} from "./action"
import { useState } from "react";
import type { LoaderData } from "~/lib/types/books";
import { Pencil, Trash2 } from "lucide-react";
import ListHeading from "../listUtils/listHeading";

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
<ListHeading heading={'Books to Read'} btnName={'+ Add Book'} link={'/post/books'} />

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
        <div className="list-card grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <input type="hidden" name="intent" value="update" />
        <input name="book_id" type="hidden" value={book.book_id} /> 
         
      
        <input
        name='name'
        defaultValue={book.name}
        className="input-field-small  lg:col-span-2"
        />
         <input
        name='author'
        defaultValue={book.author}
        className="input-field-small  lg:col-span-2"
        />

        <select
            id="category"
            name="category"
            className="input-field-small  lg:col-span-1"
            defaultValue={book.category}
        >
        <option value="fiction">fiction</option>
        <option value="non-fiction">non-fiction</option>
          
          </select>

    
      

        <input
        name='notes'
        defaultValue={book.notes ? book.notes : ''}
        className="input-field-small sm:col-span-2 lg:col-span-3"
        />
    
    {/* Update Button */}
        <button  
        type='submit'
        className="bg-red-600 px-2 py-1 rounded-lg hover:bg-red-400 transition-transform active:scale-90 lg:col-span-1"> 
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
         <p className="min-w-0 break-words sm:truncate">
          {book.name} {book.author ? `by ${book.author}`: ''}
        </p>
         
            
             <span className="self-start sm:self-auto sm:ml-auto rounded-lg bg-slate-700 px-2 py-1 text-xs sm:text-sm text-slate-300">
    {book.category}
  </span>
        
            </div>
        {book.notes ? (
            <p className="notes">{book.notes}</p>
        ) 
        : null}
        <div className="mt-2 flex justify-end gap-2">
            <button 
              onClick={()=> setEditingId(book.book_id)}
              className="btn-edit"> <Pencil size={16} /></button>
          
                <button 
                onClick={()=>handleDeleteBook(book.book_id)}
                className="btn-delete"> <Trash2 size={16}/>
            </button>
              </div></div>
          )
          ))
        )}
      </div>
    </div>
  );
}




