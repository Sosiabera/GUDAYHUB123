import { CopyToClipboard } from "react-copy-to-clipboard";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import useAuth from "../Hooks/UseAuth";
import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PhoneIcon from '@mui/icons-material/Phone';

const socket = io.connect("ws://localhost:4100");

export default function InterviewCall() {
    const { getUserData, getUserToken } = useAuth();

    const userData = getUserData();
    const token = getUserToken();

    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const [remoteStream, setRemoteStream] = useState(null);

    const myVideo = useRef();
    const userVideo = useRef();
    const peerConnection = useRef(new RTCPeerConnection());

    useEffect(() => {
        // Set up local video stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            if (myVideo.current) {
                myVideo.current.srcObject = stream;
            }
        });

        // Receive socket ID from server
        socket.on("me", (id) => {
            setMe(id);
        });

        // Handle incoming call
        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });
    }, []);

   

    useEffect(() => {
        if (userVideo.current) {
            userVideo.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const callUser = async (id) => {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        socket.emit("callUser", {
            userToCall: id,
            signalData: offer,
            from: me,
            name: name
        });

        socket.on("callAccepted", async (signal) => {
            setCallAccepted(true);
            const remoteDesc = new RTCSessionDescription(signal);
            await peerConnection.current.setRemoteDescription(remoteDesc);
        });
    };

    const answerCall = async () => {
        setCallAccepted(true);

        const remoteDesc = new RTCSessionDescription(callerSignal);
        await peerConnection.current.setRemoteDescription(remoteDesc);

        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.emit("answerCall", { signal: answer, to: caller });
    };

    const leaveCall = () => {
        setCallEnded(true);
        peerConnection.current.close();
        setRemoteStream(null);
    };

    useEffect(() => {
        if (stream) {
            stream.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, stream);
            });

            peerConnection.current.ontrack = (event) => {
                const [remoteStream] = event.streams;
                setRemoteStream(remoteStream);
            };
        }
    }, [stream]);
 
    return (
        <>
            <h1 style={{ textAlign: "center", color: '#fff' }}>Zoomish</h1>
            <div className="container">
                <div className="video-container">
                    <div className="video">
                        {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ?
                            <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
                            null}
                    </div>
                </div>
                <div className="myId">
                    <TextField
                        id="filled-basic"
                        label="Name"
                        variant="filled"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginBottom: "20px" }}
                    />
                    <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                        <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
                            Copy ID
                        </Button>
                    </CopyToClipboard>

                    <TextField
                        id="filled-basic"
                        label="ID to call"
                        variant="filled"
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                    />
                    <div className="call-button">
                        {callAccepted && !callEnded ? (
                            <Button variant="contained" color="secondary" onClick={leaveCall}>
                                End Call
                            </Button>
                        ) : (
                            <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                                <PhoneIcon fontSize="large" />
                            </IconButton>
                        )}
                        {idToCall}
                    </div>
                </div>
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1>{name} is calling...</h1>
                            <Button variant="contained" color="primary" onClick={answerCall}>
                                Answer
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}
