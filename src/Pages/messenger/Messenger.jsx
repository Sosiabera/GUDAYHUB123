import { useContext, useEffect, useRef, useState } from "react";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import "./messenger.css";
import { AuthContext } from "../../Hooks/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  const { user, currentChat, setCurrentChat } = useContext(AuthContext);
  

  useEffect(() => {
    socket.current = io("ws://localhost:4100");

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.member.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user.userID);
    socket.current.on("getUsers", (users) => {});
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/conversations/${user.userID}`
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user.userID]);

 
  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        try {
          const res = await axios.get(
            `http://localhost:4000/messages/${currentChat._id}`
          );
          setMessages(res.data);
         console.log(currentChat._id)
        } catch (err) {
          console.log(err);
        }
      }
    };
    getMessages();
  }, [currentChat]);


  const handleNewMessage = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.userID,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.member.find(
      (member) => member !== user.userID
    );

    socket.current.emit("sendMessage", {
      senderId: user.userID,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(`http://localhost:4000/messages/`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log("error" + err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input placeholder="search" className="chatMenuInput" />
          {conversations.map((convo) => (
            <div onClick={() => setCurrentChat(convo)} key={convo._id}>
              <Conversation Conversation={convo} currentUser={user} />
            </div>
          ))}
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop">
                {messages.map((m) => (
                  <div ref={scrollRef} key={m._id}>
                    <Message message={m} own={m.sender === user.userID} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput"
                  placeholder="write something"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                ></textarea>
                <button className="chatSubmitButton" onClick={handleNewMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <span className="noconvo">Open a conversation to start a chat</span>
          )}
        </div>
      </div>
    </div>
  );
}
