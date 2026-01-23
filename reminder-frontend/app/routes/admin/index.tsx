import { useLoaderData } from "react-router"
import type {  LoaderData } from "~/lib/types/users"
import ApplicantRow from "../../components/admin/ApplicantRow";
export { default as loader} from "./loader"
export { default as action} from "./action"
import { useFetcher } from "react-router";
import UserRow from "../../components/admin/UserRow";


export default function AdminPage(){

    const { users} = useLoaderData() as LoaderData;
    
    const usersApplications = users.filter((user)=> user.role==='applicant')
    const usersAccepted = users.filter((user)=> user.role==='user' || user.role ==='admin')

    const acceptFetcher = useFetcher();
    const deleteFetcher = useFetcher();

 return (
    <div className="max-w-6xl mx-auto px-6 py-6">
           
    <h1 className="text-2xl font-semibold mb-4"> Applications </h1> 

    <div className="space-y-2">
    {usersApplications.length === 0 ? <p> No Applications, right now. </p> :
     usersApplications.map(user => (

    <ApplicantRow user={user} fetcher={acceptFetcher}  />

  
        ))
}
    </div>
     <h1 className="text-2xl font-semibold mt-8 mb-4 mt-6"> User List </h1> 
     <div className="space-y-2">
    { usersAccepted.length === 0 ? <p> No users, so far. </p> : usersAccepted.map(user => (

    <UserRow user={user} fetcher={deleteFetcher} />

  
      
        
        ))}
    
    </div>
      
    </div>
    )
}