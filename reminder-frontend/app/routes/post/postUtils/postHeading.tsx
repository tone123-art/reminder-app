  import {Link} from "react-router";
  
  export default function PostHeading({heading, btnName, link}:{heading:string, btnName:string, link:string}){

    return (

    <div className="flex items-center gap-4 mb-6">

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
  
  
