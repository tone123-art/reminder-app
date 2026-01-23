
export default function DataPostMessage({errors, message}:{ errors:Record<string, string> ,message: string | undefined}){
  return (
    <div>  
    {message ? (
        <p className="message-success">
          {message}
        </p>
      ) : null}

      {/* Form-level error */}
      {errors.form ? (
        <p className="message-fail">
          {errors.form}
        </p>
      ) : null}
      </div>
)}