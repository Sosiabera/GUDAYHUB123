import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../Hooks/UseAuth'; // Replace with your actual authentication hook
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PhoneIcon from '@mui/icons-material/Phone';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactPlayer from 'react-player';

const socket = io.connect('ws://localhost:4100');

const InterviewCall = () => {
    const { getUserData, getUserToken } = useAuth(); // Replace with your actual authentication hooks

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
    const peerConnection = useRef(new RTCPeerConnection());

    useEffect(() => {
        // Set up local video stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setStream(stream);
                myVideo.current.srcObject = stream; // Set local video stream to the video element

                // Add local stream to peerConnection
                stream.getTracks().forEach(track => {
                    peerConnection.current.addTrack(track, stream);
                });

                // Create offer and set local description
                peerConnection.current.createOffer()
                    .then(offer => peerConnection.current.setLocalDescription(offer))
                    .then(() => {
                        // Emit callUser event with offer to the server
                        socket.emit('callUser', {
                            userToCall: idToCall,
                            signalData: peerConnection.current.localDescription,
                            from: me,
                            name: name,
                        });
                    })
                    .catch(error => console.error('Error creating or setting local description:', error));
            })
            .catch(error => console.error('Error accessing media devices:', error));

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

        // Handle incoming tracks from remote peer
        peerConnection.current.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
            }
        };

    }, [idToCall, me, name]);

    console.log(me)

    const callUser = async () => {
        try {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            socket.emit('callUser', {
                userToCall: idToCall,
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
    console.log(remoteStream)

    return (
        <div>
            <h1>WebRTC Video Call</h1>
            <div>
                <video ref={myVideo} autoPlay playsInline muted style={{ width: '300px' }} />
                {callAccepted && !callEnded && remoteStream && (
                    <video srcObject={URL} autoPlay playsInline style={{ width: '300px' }} />
                )}
            </div>
            <div>
                {!callAccepted && (
                    <div>
                        <TextField
                            label="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            label="ID to Call"
                            value={idToCall}
                            onChange={(e) => setIdToCall(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={callUser}>
                            Call
                        </Button>
                    </div>
                )}
                {receivingCall && !callAccepted && (
                    <div>
                        <h2>{caller} is calling...</h2>
                        <Button variant="contained" color="primary" onClick={answerCall}>
                            Answer
                        </Button>
                    </div>
                )}
                {callAccepted && !callEnded && (
                    <Button variant="contained" color="secondary" onClick={leaveCall}>
                        End Call
                    </Button>
                )}
            </div>
        </div>
    );
};

export default InterviewCall;
