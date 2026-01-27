import { Pencil, Trash2 } from "lucide-react"

export default function ActionButtons({handleDelete, setEditingId, id}: {  handleDelete: (id: number) => void, setEditingId:React.Dispatch<React.SetStateAction<number | null>>, id:number}){

    return (
         <div className="flex justify-end">
            <button 
              onClick={()=> setEditingId(id)}
              className="btn-edit"> <Pencil size={14} /></button>
          
                <button 
                onClick={()=>handleDelete(id)}
                className="btn-delete"> <Trash2 size={14}/>
            </button>
              </div>
    )
}