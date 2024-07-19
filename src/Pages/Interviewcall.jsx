// import { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';
// import useAuth from '../Hooks/UseAuth';
// import React from 'react';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import TextField from '@mui/material/TextField';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import PhoneIcon from '@mui/icons-material/Phone';
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import ReactPlayer from "react-player";

// const socket = io.connect('ws://localhost:4100');

// export default function InterviewCall() {
//     const { getUserData, getUserToken } = useAuth();

//     const userData = getUserData();
//     const token = getUserToken();

//     const [me, setMe] = useState('');
//     const [stream, setStream] = useState(null);
//     const [receivingCall, setReceivingCall] = useState(false);
//     const [caller, setCaller] = useState('');
//     const [callerSignal, setCallerSignal] = useState(null);
//     const [callAccepted, setCallAccepted] = useState(false);
//     const [idToCall, setIdToCall] = useState('');
//     const [callEnded, setCallEnded] = useState(false);
//     const [name, setName] = useState('');
//     const [remoteStream, setRemoteStream] = useState(null);
//     const [userVideoSrc, setUserVideoSrc] = useState('');

//     const myVideo = useRef();
//     const userVideo = useRef();
//     const peerConnection = useRef(new RTCPeerConnection());

//     useEffect(() => {
//         // Set up local video stream
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
//             setStream(stream);
          
//         });

//         // Receive socket ID from server
//         socket.on('me', (id) => {
//             setMe(id);
//         });

//         // Handle incoming call
//         socket.on('callUser', (data) => {
//             setReceivingCall(true);
//             setCaller(data.from);
//             setName(data.name);
//             setCallerSignal(data.signal);
//         });

//         // Handle incoming tracks from remote peer
//         peerConnection.current.ontrack = (event) => {
//             if (event.streams && event.streams[0]) {
//                 setRemoteStream(event.streams[0]);
//                 console.log(event.streams[0])
//             }
//         };

//     }, []);

//     // Set remote stream to userVideoSrc when it changes
//     useEffect(() => {
//         if (remoteStream) {
//             const videoSrc = URL.createObjectURL(remoteStream);
//             setUserVideoSrc(videoSrc);
//         }
//     }, [remoteStream]);

//     const callUser = async (id) => {
//         try {
//             const offer = await peerConnection.current.createOffer();
//             await peerConnection.current.setLocalDescription(offer);

//             socket.emit('callUser', {
//                 userToCall: id,
//                 signalData: offer,
//                 from: me,
//                 name: name,
//             });

//             socket.on('callAccepted', async (signal) => {
//                 setCallAccepted(true);
//                 const remoteDesc = new RTCSessionDescription(signal);
//                 await peerConnection.current.setRemoteDescription(remoteDesc);
//             });
//         } catch (error) {
//             console.error('Error creating or setting local description:', error);
//         }
//     };

//     const answerCall = async () => {
//         try {
//             setCallAccepted(true);

//             const remoteDesc = new RTCSessionDescription(callerSignal);
//             await peerConnection.current.setRemoteDescription(remoteDesc);

//             const answer = await peerConnection.current.createAnswer();
//             await peerConnection.current.setLocalDescription(answer);

//             socket.emit('answerCall', { signal: answer, to: caller });
//         } catch (error) {
//             console.error('Error answering call:', error);
//         }
//     };


//     const leaveCall = () => {
//         setCallEnded(true);
//         if (stream) {
//             stream.getTracks().forEach((track) => track.stop());
//         }
//         if (peerConnection.current) {
//             peerConnection.current.close();
//         }
//         if (socket.connected) {
//             socket.disconnect();
//         }
//     };
//     console.log("my",stream)
//     console.log("other",remoteStream)

//     return (
//         <>
//             <h1 style={{ textAlign: 'center', color: '#fff' }}>Zoomish</h1>
//             <div className="container">
//                 <div className="video-container">
//                     <div className="video">
//                         {stream &&  <ReactPlayer url={stream} playing muted autoPlay style={{ width: '300px' }}/> }
//                     </div>
//                     <div className="video">
//                         {callAccepted && !callEnded ? (
//                              <ReactPlayer url={remoteStream} playing muted autoPlay style={{ width: '300px' }}/> 
//                         ) : null}
//                         {callAccepted && !callEnded && userVideoSrc && (
//                              <ReactPlayer url={remoteStream} playing muted autoPlay style={{ width: '300px' }}/> 
//                         )}
//                     </div>
//                 </div>
//                 <div className="myId">
//                     <TextField
//                         id="filled-basic"
//                         label="Name"
//                         variant="filled"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         style={{ marginBottom: '20px' }}
//                     />
//                     <CopyToClipboard text={me} style={{ marginBottom: '2rem' }}>
//                         <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
//                             Copy ID
//                         </Button>
//                     </CopyToClipboard>

//                     <TextField
//                         id="filled-basic"
//                         label="ID to call"
//                         variant="filled"
//                         value={idToCall}
//                         onChange={(e) => setIdToCall(e.target.value)}
//                     />
//                     <div className="call-button">
//                         {callAccepted && !callEnded ? (
//                             <Button variant="contained" color="secondary" onClick={leaveCall}>
//                                 End Call
//                             </Button>
//                         ) : (
//                             <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
//                                 <PhoneIcon fontSize="large" />
//                             </IconButton>
//                         )}
//                     </div>
//                 </div>
//                 <div>
//                     {receivingCall && !callAccepted ? (
//                         <div className="caller">
//                             <h1>{name} is calling...</h1>
//                             <Button variant="contained" color="primary" onClick={answerCall}>
//                                 Answer
//                             </Button>
//                         </div>
//                     ) : null}
//                 </div>
//             </div>
//         </>
//     );
// }

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../Hooks/UseAuth';
import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PhoneIcon from '@mui/icons-material/Phone';
import { CopyToClipboard } from "react-copy-to-clipboard";

const socket = io.connect('ws://localhost:4100');

export default function InterviewCall() {
    const { getUserData, getUserToken } = useAuth();

    const userata = getUserData();
    const tokeDn = getUserToken();

    const [me, setMe] = useState('');
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState('');
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
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
        socket.on('me', (id) => {
            setMe(id);
        });

        // Handle incoming call
        socket.on('callUser', (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });

    }, []);

    // Add local stream tracks to peer connection and handle remote tracks
    useEffect(() => {
        if (stream) {
            stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
        }

        peerConnection.current.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
                if (userVideo.current) {
                    userVideo.current.srcObject = event.streams[0];
                }
            }
        };
    }, [stream]);

    const callUser = async (id) => {
        try {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            socket.emit('callUser', {
                userToCall: id,
                signalData: offer,
                from: me,
                name: name,
            });

            socket.on('callAccepted', async (signal) => {
                setCallAccepted(true);
                const remoteDesc = new RTCSessionDescription(signal);
                await peerConnection.current.setRemoteDescription(remoteDesc);
            });
        } catch (error) {
            console.error('Error creating or setting local description:', error);
        }
    };

    const answerCall = async () => {
        try {
            setCallAccepted(true);

            const remoteDesc = new RTCSessionDescription(callerSignal);
            await peerConnection.current.setRemoteDescription(remoteDesc);

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            socket.emit('answerCall', { signal: answer, to: caller });
        } catch (error) {
            console.error('Error answering call:', error);
        }
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        if (peerConnection.current) {
            peerConnection.current.close();
        }
        if (socket.connected) {
            socket.disconnect();
        }
    };

    return (
        <>
            <h1 style={{ textAlign: 'center', color: '#fff' }}>Zoomish</h1>
            <div className="container">
                <div className="video-container">
                    <div className="video">
                        {stream && <video ref={myVideo} autoPlay muted style={{ width: '300px' }} />}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded && (
                            <video ref={userVideo} autoPlay style={{ width: '300px' }} />
                        )}
                    </div>
                </div>
                <div className="myId">
                    <TextField
                        id="filled-basic"
                        label="Name"
                        variant="filled"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <CopyToClipboard text={me} style={{ marginBottom: '2rem' }}>
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

