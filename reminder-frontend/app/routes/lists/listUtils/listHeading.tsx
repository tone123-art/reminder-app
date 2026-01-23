  import {Link} from "react-router";
  
  export default function ListHeading({heading, btnName, link}:{heading:string, btnName:string, link:string}){

    return (

    <div className="flex items-center gap-4 mb-4">

    <h1 className="headline">{heading}</h1>
    
    <Link
    to={link}
    className="btn-add ml-auto"
    >
    {btnName}
    </Link>
    </div>

    )
  }
  
  
