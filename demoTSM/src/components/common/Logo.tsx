import { FcTodoList  } from "react-icons/fc";

function Logo(){
    return(
        <div className="flex gap-1 mb-3">
        <FcTodoList  className="text-3xl "/>
           <p className="text-lg font-semibold">TaskFlow</p> 
        </div>
    );
}

export default Logo ;