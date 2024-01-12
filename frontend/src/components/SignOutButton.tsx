import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import {  useNavigate } from "react-router-dom";
function SignOutButton(){
    const queryClient = useQueryClient();
    const {showToast} = useAppContext();
    const navigate = useNavigate();

    

    const mutation = useMutation(apiClient.signOut,{
        onSuccess:async ()=>{
            await queryClient.invalidateQueries('validateToken');
            showToast({message:"Sign out success", type:"SUCCESS"});
            navigate('/');
        },
        onError:(error:Error)=>{
            showToast({message:error.message, type:"ERROR"}); 
            navigate('/');
        }
    });

    const handleClick = ()=>{
        mutation.mutate();
    }
    return(
        <button onClick= {handleClick} className="bg-white flex items-center text-blue-600 px-3 font-bold hover:bg-gray-100">Sign Out</button>
    )
}
export default SignOutButton;