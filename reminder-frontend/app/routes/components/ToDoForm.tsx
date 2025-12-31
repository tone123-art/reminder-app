import { Form } from "react-router";
import { useState } from "react";



export default function ToDoForm() {

    const [hasDeadline, setHasDeadline] = useState< boolean>(false);

    return <div className="max-w-4xl mx-auto mt-4 px-6 py-8">


    {/* Form for Chores */}

    <Form method="post" className="space-y-6 bg-blue-200 px-10 py-8 rounded-4xl"> 
    
    

    {/* Name of Chore */}

    <div className="mt-4">
    <label htmlFor="name" className="block font-medium text-xl mb-1"> Task To Do</label>
        <input  
        type='text'
        id='name'
        name='name'
        className="bg-white text-black w-full px-4 py-2 rounded-lg border border-gray-900" />
        </div>
    
    {/* Priority of Chore */}

    <div className="mt-4">
    <label htmlFor="priority" className="block font-medium text-xl mb-1"> Choose Priority</label>
        <select  
        id='priority'
        name='priority'
        className="bg-white text-black w-full px-4 py-2 rounded-lg border border-gray-900" >
            <option value='high'> {"\u{1F7E2}"} High</option>
            <option value='medium'>{"\u{1F7E1}"} Medium</option>
            <option value='low'>{"\u{1F534}"} Low </option>
            </select>
    </div>

    {/* Deadline Yes/No */}

    { !hasDeadline && (

        <div className="flex gap-6">
           
 
   
    <label className="block text-xl mb-2 inline-flex items-center gap-2 px-1">
           <input
            type="checkbox"
            name="hasDeadline"
            value="true"
            checked={hasDeadline}
            onChange={(e) => setHasDeadline(e.target.checked)}
            className="scale-150"
            />
            Add Deadline? 
    </label>
    </div>
    )}

   
    



    {/* Deadline Date */}




            

    { hasDeadline &&   (
    <div className="mt-4">
    <label htmlFor="deadline" className="block font-medium text-xl mb-1">  Deadline</label>
        <input  
        type='date'
        id='deadline'
        name='deadline'
        className="bg-white text-black w-full px-4 py-2 rounded-lg border border-gray-900" />
        <button 
        className="mt-2"
        onClick={()=>setHasDeadline(false)}> Delete Deadline </button>
    </div>)}


            <button className="mt-2"> submit</button>
        </Form>
    </div>


}