import React, { createContext, useContext, useRef, useState } from 'react';

const PeerContext = createContext();

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
    const peerConnection = useRef(new RTCPeerConnection());
    const [remoteStream, setRemoteStream] = useState(new MediaStream());

    peerConnection.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
        setRemoteStream(remoteStream);
    };

    return (
        <PeerContext.Provider value={{ peerConnection, remoteStream }}>
            {children}
        </PeerContext.Provider>
    );
};

