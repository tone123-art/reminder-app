import { Form, useActionData } from "react-router";
import { useState } from "react";
export { default as action} from "./action"
import DataPostMessage from "../postUtils/dataPostMessage"
import PostHeading from "../postUtils/postHeading";



export default function PostTasksPage() {

    const actionData = useActionData() as any;

    const errors =actionData?.errors  || {};
    const message: string | undefined = actionData?.message;

    const [hasDeadline, setHasDeadline] = useState< boolean>(false);

    return <div >


      {/* Messages */}
     <DataPostMessage errors={errors} message={message} />
        
              
    {/* Heading */}
    <PostHeading heading={'Add a Task'} btnName={'Return' } link={'/tasks'}/>
             

             


    


    {/* Form for Chores */}

    <Form method="post" className="list-container"> 
    
    

    {/* Name of Chore */}

    <div className="mt-4">
    <label htmlFor="name" className="input-label"> Task To Do</label>
        <input  
        type='text'
        id='name'
        name='name'
        className="input-field" />
        </div>

         
    
    {/* Priority of Chore */}

    <div className="mt-4">
    <label htmlFor="priority" className="input-label"> Choose Priority</label>
        <select  
        id='priority'
        name='priority'
        className="input-field" >
            <option value='high'> {"\u{1F534}"} High</option>
            <option value='medium'>{"\u{1F7E1}"} Medium</option>
            <option value='low'> {"\u{1F7E2}"} Low </option>
            </select>
    </div>
         {errors.priority && (
    <p className="mt text-red-700 font-medium">{errors.priority}</p>
  )}

    {/* Deadline Yes/No */}

    { !hasDeadline && (

        <div className="flex gap-6">
           
 
   
    <label className="input-label">
           <input
            type="checkbox"
            name="hasDeadline"
            value="true"
            checked={hasDeadline}
            onChange={(e) => setHasDeadline(e.target.checked)}
            className="scale-150 mr-4 ml-1 mt-4"
            />
            Add Deadline? 
    </label>
    </div>
    )}

   
    



    {/* Deadline Date */}




            

    { hasDeadline &&   (
    <div className="mt-4">
    <label htmlFor="deadline" className="input-label">  Deadline</label>
        <input  
        type='date'
        id='deadline'
        name='deadline'
        className="input-field" />
        <button 
        type='button'
        className="btn-delete mt-1"
        onClick={()=>setHasDeadline(false)}> Delete Deadline </button>
    </div>)}


            <button 
            
            className="btn-add mt-2"> Submit</button>
        </Form>
    </div>


}