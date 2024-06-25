import React from "react";
import { useMemo } from "react";
import { io } from "socket.io-client";


const SocketContext = React.createContext(null)

export const useSocket =() =>{
    return React.useContext(SocketContext)
}

export const SocketProvider = (props) =>{

    const Socket = useMemo(() => io(
        "ws://localhost:4100"
    ),[])

    return(
        <SocketContext.Provider value={{Socket}}>
            {props.children}
        </SocketContext.Provider>
    )
}