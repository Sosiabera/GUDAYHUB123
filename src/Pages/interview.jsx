import React, { useEffect, useState,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../provider/socket";
import useAuth from "../Hooks/UseAuth";


export default function Interview() {

    const { getUserData, getUserToken } = useAuth();

const userData = getUserData();
const token = getUserToken();

const navigate = useNavigate()

    const {Socket} = useSocket()

    const [roomId, setroomId] =useState()

    const handleRoomJoined =useCallback(({roomId}) =>{
        navigate(`/room/${roomId}`)
    },[navigate])

useEffect(()=>{{
    Socket.on('joined-room',handleRoomJoined )
    return()=>{
      Socket.off("joined-room",handleRoomJoined )
    }
}},[Socket,handleRoomJoined])

    const handleJoinRoom = () =>{
        Socket.emit("join-room", {emailId:userData.userID, roomId:roomId})

    }

  return (
    <>
      <div style={{ position: "absolute", top: "50%" }}>
        <input className="input" type="text" placeholder="" 
        value={roomId}
        onChange={e => setroomId(e.target.value)}/>
        <button onClick={handleJoinRoom}>join room</button>
      </div>
    </>
  );
}
