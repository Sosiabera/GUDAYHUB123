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
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const localPeerConnection = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            myVideo.current.srcObject = stream;
        });

        socket.on("me", (id) => {
            setMe(id);
        });

        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });
    }, []);

    const callUser = (id) => {
        localPeerConnection.current = new RTCPeerConnection();

        stream.getTracks().forEach((track) => {
            localPeerConnection.current.addTrack(track, stream);
        });

        localPeerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("sendCandidate", { candidate: event.candidate, to: id });
            }
        };

        localPeerConnection.current.ontrack = (event) => {
            userVideo.current.srcObject = event.streams[0];
        };

        localPeerConnection.current.createOffer().then((offer) => {
            localPeerConnection.current.setLocalDescription(offer);
            socket.emit("callUser", {
                userToCall: id,
                signalData: offer,
                from: me,
                name: name,
            });
        });

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            localPeerConnection.current.setRemoteDescription(new RTCSessionDescription(signal));
        });

        connectionRef.current = localPeerConnection.current;
    };

    const answerCall = () => {
        setCallAccepted(true);
        localPeerConnection.current = new RTCPeerConnection();

        stream.getTracks().forEach((track) => {
            localPeerConnection.current.addTrack(track, stream);
        });

        localPeerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("sendCandidate", { candidate: event.candidate, to: caller });
            }
        };

        localPeerConnection.current.ontrack = (event) => {
            userVideo.current.srcObject = event.streams[0];
        };

        localPeerConnection.current.setRemoteDescription(new RTCSessionDescription(callerSignal)).then(() => {
            localPeerConnection.current.createAnswer().then((answer) => {
                localPeerConnection.current.setLocalDescription(answer);
                socket.emit("answerCall", { signal: answer, to: caller });
            });
        });

        connectionRef.current = localPeerConnection.current;
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.close();
    };

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
