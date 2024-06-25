import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../provider/socket";
import useAuth from "../Hooks/UseAuth";
import { usePeer } from "../provider/peer";

const RoomPage = () => {
  const { getUserData, getUserToken } = useAuth();
  const userData = getUserData();
  const token = getUserToken();

  const { Socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const handleNewUserJoined = useCallback(async (data) => {
    const { emailId } = data;
    console.log("new user joined", emailId);
    // Initiate call to the new user who just joined
    const offer = await createOffer();
    Socket.emit("call-user", { emailId, offer });
    setRemoteEmailId(emailId);
  }, [createOffer, Socket]);

  const handleIncomingCall = useCallback(async (data) => {
    const { from, offer } = data;
    console.log("incoming call from", from);
    // Accept incoming call and create answer
    const ans = await createAnswer(offer);
    Socket.emit("call-accepted", { emailId: from, ans });
    setRemoteEmailId(from);
  }, [createAnswer, Socket]);

  const handleCallAccepted = useCallback(async (data) => {
    const { ans } = data;
    console.log("call accepted", ans);
    // Set remote answer to establish connection
    await setRemoteAns(ans);
  }, [setRemoteAns]);

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      sendStream(stream); // Send local stream to peer
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, [sendStream]);

  const handleNegotiation = useCallback(() => {
    // When negotiation is needed, send local offer again
    const localOffer = peer.localDescription;
    Socket.emit("call-user", { emailId: remoteEmailId, offer: localOffer });
  }, [peer.localDescription, remoteEmailId, Socket]);

  useEffect(() => {
    // Event listeners for signaling messages
    Socket.on("user-joined", handleNewUserJoined);
    Socket.on("incoming-call", handleIncomingCall);
    Socket.on("call-accepted", handleCallAccepted);

    return () => {
      // Clean up event listeners
      Socket.off("user-joined", handleNewUserJoined);
      Socket.off("incoming-call", handleIncomingCall);
      Socket.off("call-accepted", handleCallAccepted);
    };
  }, [Socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

  useEffect(() => {
    // Event listener for negotiation event
    peer.addEventListener("nego", handleNegotiation);
    return () => {
      // Clean up negotiation event listener
      peer.removeEventListener("nego", handleNegotiation);
    };
  }, [peer, handleNegotiation]);

  useEffect(() => {
    // Get user media stream when component mounts
    getUserMediaStream();
  }, [getUserMediaStream]);

  console.log("Local Stream:", myStream);
  console.log("Remote Stream:", remoteStream);

  return (
    <>
      <h1 style={{ marginTop: "3rem" }}>You are in the room</h1>
      <div style={{ marginTop: "20px" }}>
        {myStream && <ReactPlayer url={myStream} playing muted />}
      </div>
      <div>
        {remoteStream && <ReactPlayer url={remoteStream} playing />}
      </div>
    </>
  );
};

export default RoomPage;
