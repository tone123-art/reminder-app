import { useLoaderData } from "react-router";
import { useFetcher, useRevalidator } from "react-router";
import { useEffect, useRef, useState , useMemo } from "react";
import { useNavigate} from "react-router"  ;
import { AlarmClock, ClockPlus, ClipboardCheck } from "lucide-react";
export {default as action} from "./action"
export {default as loader} from "./loader"
import type { Task } from "~/lib/types/task";
import { formatDateOnly } from "~/lib/utils/formatDateOnly";
import { type SortKey, type SortOrder, type DisplayType, priorityBg, sortTasks } from "~/lib/utils/taskSort";
import { matchesDisplay } from "~/lib/utils/taskFilter";
import ListHeading from "../listUtils/listHeading";
import { SlidersHorizontal, Pencil, Trash2} from "lucide-react";
import ActionButtons from "../listUtils/actionButtons";

type LoaderData = { tasklist : Task[];}


export default function Tasklist(){

  const {tasklist } = useLoaderData() as LoaderData;
    
  const [editingId, setEditingId] = useState<number | null >(null)

  const fetcher = useFetcher();
  const toggleFetcher = useFetcher();
  const revalidator = useRevalidator();
  const navigate = useNavigate();

    // Handle Editing
  const lastSubmission = useRef<any>(null)
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && editingId !== null) {
        lastSubmission.current=fetcher.data;
        setEditingId(null);
         revalidator.revalidate(); 
   }
   }, [fetcher.state, fetcher.data, revalidator]);

    // Handle Completion: 
  const prevToggleState = useRef(toggleFetcher.state);

  useEffect(() => {
      const wasBusy = prevToggleState.current !== "idle";
  const isNowIdle = toggleFetcher.state === "idle";

  if (wasBusy && isNowIdle) {
    revalidator.revalidate();
  }

  prevToggleState.current = toggleFetcher.state;
    }, [toggleFetcher.state,  revalidator]);

    // Handle Deleting
    async function handleDeleteTask(task_id: number) {
        const ok = window.confirm("Do you really want to delete this Task?");
        if (!ok) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task_id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    alert("Failed to delete task");
    return;
  } 
     navigate("/tasks");
  };

    // Sorting the tasklist
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [ displayType, setDisplayType] = useState<DisplayType>('active');
  const [open, setOpen] = useState(false);

  const sortedTaskslist= useMemo(
    () => 
      sortTasks(tasklist, sortKey, sortOrder),
       [tasklist, sortKey, sortOrder]);


    // Filtering the tasklist
const visibleTasks = useMemo(
  () => sortedTaskslist.filter(t => matchesDisplay(t, displayType)),
  [sortedTaskslist, displayType]
  );






  
return (
<div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
 
 {/* Heading of the List */}
 <ListHeading heading={'To Do List'} link={'/post/tasks'} btnName={'Add Task'}/>
  

  {/* Start of Container */}
  <div className="list-container">
  
  
  
  {/* Filter / Sort Bar */}
<div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-4">

<div className="flex flex-wrap items-center gap-2">
    <button className={`${displayType === 'active' ? `btn-toggle-selected` : 'btn-toggle'}`} onClick={()=>setDisplayType('active')}> active</button>
    <button className={`${displayType === 'completed' ? `btn-toggle-selected` : 'btn-toggle'}`} onClick={()=>setDisplayType('completed')}> done</button>
    <button className={`${displayType === 'all' ? `btn-toggle-selected` : 'btn-toggle'}`} onClick={()=>setDisplayType('all')}> all</button>
</div>

{/* sort order */}
<button 
    className="btn-toggle sm:ml-2"
    onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}>
    {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
</button>
         
       
{/* sort key dropdown */}
<div className="relative sm:ml-auto">
<button 
      onClick={()=>setOpen((v)=>!v)}
      className="btn-toggle flex items-center gap-2">  <SlidersHorizontal size={16}/> Filter 
</button>

{ open ?  (
<div className="absolute top-full right-0 mt-2 z-50 w-44 rounded-lg border border-slate-700 bg-slate-800 shadow-lg p-1">    
  <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-white/10" onClick={()=> setSortKey('created_at')}>created</button>
  <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-white/10" onClick={()=> setSortKey('deadline')}>deadline</button>
  <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-white/10" onClick={()=> setSortKey('priority')}>priority</button> 
</div>
 ) : null}
</div>
</div>

{/* To Do List Items */}
{visibleTasks.map((task => {
    const isEditing = editingId ===task.task_id;
    const deadlineForInput =  task.deadline ? task.deadline.slice(0, 10) : "";
          
return  (      
<div 
    key={task.task_id}
    className={`list-card ${task.completed ? 'opacity-50' :''}`}> 
<div className="flex items-center gap-3 sm:gap-6">
      
      {/* Checkmark Button  Toggle Completion*/}

<toggleFetcher.Form  method="POST"> 
<input type="hidden" name='intent' value='toggle' />
<input type="hidden" name="completed" value={String(!task.completed)} />
<input type="hidden" name="task_id" value={String(task.task_id)} />
<button
    type="submit"
    aria-label="Toggle completed"
    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${priorityBg(task.priority)} shadow-md cursor-pointer
                hover:border-2 hover:border-black active:scale-[0.95]
                flex items-center justify-center
${task.completed ? "border-teal-500" : "border-black"}`}
>
      {task.completed &&(
        <svg
            viewBox="0 0 20 20"
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round">
        <path d="M5 10 l3 3 8 -8" />
        </svg> )}
            </button>
  </toggleFetcher.Form>
       
       
     
      <div className="flex-1">
          
          {/* Editing Page starts */}
          {isEditing ? (            <fetcher.Form  key={task.task_id} method="post" >              
      <div className="space-y-2">
      <input type="hidden" name="intent" value="update" />
      <input name="task_id" type="hidden" value={task.task_id} /> 
      <input
        name='name'
        defaultValue={task.name}
        className="input-field-small"
      />
    
      <input
        name='deadline'
        type="date"
        defaultValue={deadlineForInput ?? ""}
        className="input-field-small"
      />
           <select  
        id='priority'
        name='priority'
        defaultValue={task.priority}
        className="input-field-small" >
            <option value='high'> {"\u{1F534}"} High</option>
            <option value='medium'>{"\u{1F7E1}"} Medium</option>
            <option value='low'>{"\u{1F7E2}"} Low </option>
            </select>

      <div className="flex gap-2 mt-2">
        <button type='submit' disabled={fetcher.state !== 'idle'}
         
          className="btn-add"
        >
          Save
        </button>
        <button
          type='button'
          onClick={() => setEditingId(null)}
          className="btn-cancel"
        >
          Cancel
        </button>
      </div>
    </div>
 </fetcher.Form>
    // Editing ends here
   )    
   : ( <>
    
    <h2 className="headline-small"> {task.name}</h2>

  
    
    <div className="mt-2  gap-1 text-slate-300">
    { task.deadline && (
    <div className="flex flex-wrap items-center gap-1">               
    <AlarmClock size={12} /> 
    
    <span> {formatDateOnly(task.deadline)}   </span>  
    </div>
    )}  
 
  {/* Task Createt */}
  <div className="flex flex-wrap items-center gap-1">
  <ClockPlus size={12} />
  <span> {formatDateOnly(task.created_at)}
  </span>
  </div>


  



  {task.completed && (   
  <div className="flex flex-wrap items-center gap-1">
  <ClipboardCheck size={12} />
  <span> {formatDateOnly(task.completed_at)}
  </span>
  </div>
  )}
        

  <ActionButtons setEditingId={setEditingId} handleDelete={handleDeleteTask} id={task.task_id} />
        
 
   </div> 

                           
  </> )}
          
  </div>
  </div>
  </div>
)}))}
</div>
  </div>
)}
