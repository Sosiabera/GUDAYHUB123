import { createContext, useReducer, useState } from "react";
import useAuth from "./UseAuth";


const { getUserData, getUserToken } = useAuth();

const userData = getUserData();
const token = getUserToken();


const INITIAL_STATE ={
    user: userData,
    isFecthing: false,
    error: false,
    currentChat: null
}

export const AuthContext = createContext(INITIAL_STATE);
 export const AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(useAuth, INITIAL_STATE)
    const [currentChat, setCurrentChat] = useState(null);

    return(
        <AuthContext.Provider 
        value={{
        user:userData, 
        isFecthing:state.isFecthing, 
        error:state.error,
        dispatch,
        currentChat,
        setCurrentChat
        }}>
       {children}
        </AuthContext.Provider>
    )
 }

