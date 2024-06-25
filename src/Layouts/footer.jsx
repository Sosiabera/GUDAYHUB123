import React from "react";
import { useNavigate } from "react-router-dom";


export default function Footer() {
const navigate = useNavigate();

    const handleClick = () => {
        navigate("/Messenger");
    };

    const handleinterClick = () => {
      navigate("/InterviewCalls");
  };

  return (
    <>
      <div className="holder start-0 interviewlogo"  onClick={handleinterClick}>
          
          <img
            className="profilepic "
            src={`/image/interview5.png`}
            alt="Profile"
          />
   
      </div>


    <div className="footer">
      <button className="round-btn" title="Message" onClick={handleClick}>
        <svg className="svgIcon" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 5.92 2 10.5c0 1.95.86 3.73 2.28 5.05l-1.07 3.21c-.19.57.48 1.06.98.71L7.73 17c1.31.5 2.73.78 4.27.78 5.52 0 10-3.92 10-8.5S17.52 2 12 2zm0 15c-1.39 0-2.71-.26-3.9-.73l-.38-.16-2.38.98.66-2.01-.3-.32C4.64 12.93 4 11.75 4 10.5 4 7.42 7.58 5 12 5s8 2.42 8 5.5-3.58 5.5-8 5.5z"></path>
        </svg>
      </button>
    </div>
    </>
  );
}