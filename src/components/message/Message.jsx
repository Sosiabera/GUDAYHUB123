import './message.css'
import { format } from 'timeago.js';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Message({message,own}) {

  const [user, setuser] = useState(null);

  useEffect(() => {

    const getUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/user/getuser/${message.sender}`
        );
        setuser(res.data);
      } catch (err) {
        console.log("error" + err);
      }
    };
    getUser();
  }, [message]);

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };



  return (
    <div className={own ? "message own" : "message"}>
        <div className="messageTop">
        {user ? (
        <img
          className="messageImg"
          src={
            user.freelancerprofile.profilepic === "" ||
            user.freelancerprofile.profilepic === null
              ? `/image/profile.jpg`
              : getProfilePicUrl(user.freelancerprofile.profilepic)
          }
        />
      ) : (
        <img className="messageImg" src={`/image/profile.jpg`} />
      )}

            <p className='messageText'>{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}
