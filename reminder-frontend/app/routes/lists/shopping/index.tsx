import { Link, useFetcher, useLoaderData, useNavigate } from "react-router"
export { default as loader} from "./loader"
export { default as action} from "./action"
import type { LoaderData} from "~/lib/types/shopping"
import { useState } from "react"
import { Trash2 , Pencil} from "lucide-react"
import ListHeading from "../listUtils/listHeading"


export default function ShoppingPage(){

  const navigate = useNavigate();
  const editFetcher = useFetcher();

  const [filterBy, setfilterBy] = useState<'supermarket'|'online'|'store'|null>(null)
  const [editingId, setEditingId] = useState<number | null>(null);

  const { shopping_items}  = useLoaderData() as LoaderData;

  const filtered_shopping_items = filterBy 
    ? shopping_items.filter((item)=>item.store_type === filterBy)
    : shopping_items;

  // Handle Update of Shopping Item
  async function handelUpdate(item_id:number) {
    setEditingId(null)    
  }

  // Handle Delete of Shopping Items
  async function handleDeleteItem(item_id: number) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shopping/items/${item_id}`, {
      method: "DELETE",
      credentials: "include",
  });
    if (!res.ok) {
      alert("Failed to delete Item");
      return;
  } 
  navigate("/shopping");
  };


return (
<div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

{/* Heading of Shopping list */}
<ListHeading heading="Shoppinglist" btnName="+ Add Item" link="/post/shopping" />




{/* Background of List starts here */}

<div className="list-container">

{/* Toggle Bar */}
<div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
    <button className={`${filterBy === null ? `btn-toggle-selected` : 'btn-toggle'}`} onClick={()=>setfilterBy(null)}> all</button>
    <button className={`${filterBy === 'supermarket' ? `btn-toggle-selected` : 'btn-toggle'}`} onClick={()=>setfilterBy('supermarket')}> supermarket</button>
    <button className={`${filterBy === 'online' ? `btn-toggle-selected` : 'btn-toggle'}`} onClick={()=>setfilterBy('online')}> online</button>
    <button className={`${filterBy === 'store' ? `btn-toggle-selected` : 'btn-toggle'}`} onClick={()=>setfilterBy('store')}> store</button> 
</div>


{/* Shopping List */}
       
{filtered_shopping_items.length === 0 ? (
    <p className="text-slate-300">No items yet.</p>
    ) : (
    filtered_shopping_items.map((item)=> (item.item_id === editingId 
    ?     
    (<editFetcher.Form  key={item.item_id} 
                        method="post"
                        onSubmit={()=>handelUpdate(item.item_id)}
                        >
      <div className="list-card grid grid-cols-1">
      <input type="hidden" name="intent" value="update" />
      <input name="item_id" type="hidden" value={item.item_id} /> 

      
  
      <div className="flex items-center gap-3">
      <div className="grid grid-cols-2">
      <input
        name='name'
        defaultValue={item.name}
        className="input-field-small w-full"
        placeholder="Item"
      />

      <input
        name='quantity'
        defaultValue={item.quantity}
        inputMode="numeric"
        className="input-field-small w-10"
        placeholder="Qty"
      />
      </div>
      </div>

      <input
        name='notes'
        defaultValue={item.notes ? item.notes : ''}
        className="input-field-small w-full "
        placeholder="Notes (optional)"
      />
    
    {/* Update Button */}
      <button
      type="submit"
      className="btn-add w-full sm:w-auto self-end"
    >
      OK
    </button>
        </div>
    </editFetcher.Form>
    )
    :
    (
// Cards
  <div
  key={item.item_id}
  className="list-card"
  >
  <p className=""> 
    {item.quantity} x {item.name}
  </p>
   
    {item.notes ? ( <p className="notes">{item.notes}</p>
    ) 
    : null}
     
     
  <div className="flex justify-end gap-2">
  
    <button 
        onClick={()=> setEditingId(item.item_id)}
        className="btn-edit"> 
        <Pencil size={16}  />
    </button>
    <button 
        onClick={()=>handleDeleteItem(item.item_id)}
        className="btn-delete"> 
        <Trash2 size={16} />
    </button>
    </div>
      
    </div> )
          ))
        )}
      </div>
    </div>
  );
}