import { useState, useEffect,useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../components/employer/css/freelancerdetails.css";
import useAuth from "../Hooks/UseAuth";
import { AuthContext } from "../Hooks/AuthContext";


export default function Hire() {

  const { getUserData, getUserToken } = useAuth();
  const { setCurrentChat } = useContext(AuthContext);

  const userData = getUserData();
  const token = getUserToken();
  const location = useLocation();
const navigate = useNavigate()


  const { userid, applicaionid, check } = location.state || {};


  const [readData, setreadData] = useState({
    Usertype: null,
    username: null,
    Fullname: null,
    Phonenumber: null,
    Email: null,
    Password: null,
    Gender: null,
    profilepic: null,
    title: null,
    freelancerprofile: {
      profilepic: null,
      title: null,
      skills: null,
      cv: null,
      additionaldoc: { educations: null, certifications: null },
      gudayhistory: null,
      workhistory: null,
      rating: null,
      description: null,
      portfolio: { link: null, title: null },
    },
  });

  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/employer/freelancerdetail/${userid}`
        );
        setreadData(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, [userid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/applicant/setinterviewdate", {
        applicantid: applicaionid,
        interviewdate: interviewDate,
        interviewTime: interviewTime,
      });
      alert("Interview date and time set successfully");
    } catch (error) {
      console.error("Error setting interview date:", error);
    }
  };

  const changestatus = async (status) => {
    try {
      await axios.put(`http://localhost:4000/applicant/changestatus`, null, {
        params: { status: status, applicantid: applicaionid },
      });
    } catch (error) {
      console.error("error", error);
    }
  };
  useEffect(() =>{
    changestatus("application opened")
  })


const hiredapp = async (status) =>{
  try{
    await axios.put(`http://localhost:4000/applicant/changestatus`, null, {
      params: { status: status, applicantid: applicaionid },
    });

    await axios.post("http://localhost:4000/hired/addhired", { appId: applicaionid })

  alert("applicant hired");
  confirm("do you wish to close this job opening?");
  }catch(error) {
    console.error("Error adding hired:", error);
    alert("Error adding hired");
  }
  }



  // Toggle the popup visibility
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle date input change
  const handleDateChange = (e) => {
    setInterviewDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setInterviewTime(e.target.value);
  };

  const openDocument = (value) => {
    const file = `http://localhost:4000/${value}`;
    window.open(file, "_blank");
  };

  const [rating, setRating] = useState(0);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleratingSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/user/addrating/${userid}`, { rating });
      response.data 
    } catch (error) {
      console.error('Error submitting rating', error);
    }
  };

  const startConvo = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/conversations/`, {
        senderId: userData.userID,
        receiverId: userid,
      });
      console.log("convo started successfully");
      const converation = response.data
         setCurrentChat(converation)
      navigate("/Messenger");
    } catch (error) {
      console.error("Error starting convo", error);
    }
  };

 

  return (
    <>
      <div className="fdetails">
        {readData && (
          <div>
            <h2>Freelancer: {readData.username}</h2>
            <p>FullName: {readData.Fullname}</p>
            <p>
              Skills:{" "}
              {readData.freelancerprofile.skills
                ? readData.freelancerprofile.skills.map((skill) => skill)
                : null}
            </p>
            <p>PhoneNumber: {readData.Phonenumber}</p>
            <p>Email: {readData.Email}</p>
            <p>Gender: {readData.Gender}</p>
            <p>Profession:{readData.freelancerprofile.title}</p>
            <p>CV:</p>

            <div
              className="cv1"
              style={{ display: "inline", borderRight: "none" }}
            >
              <img
                src={`/image/cv.png`}
                onClick={() => {
                  openDocument(readData.freelancerprofile.cv);
                }}
              />
            </div>
          
              <div className="ratings ">
                <input
                  value="5"
                  name="rate"
                  id="star5"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star5"></label>
                <input
                  value="4"
                  name="rate"
                  id="star4"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star4"></label>
                <input
                  value="3"
                  name="rate"
                  id="star3"
                  type="radio"
                 checked=""
                  onChange={handleRatingChange}
                />
                <label title="text" for="star3"></label>
                <input
                  value="2"
                  name="rate"
                  id="star2"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star2"></label>
                <input
                  value="1"
                  name="rate"
                  id="star1"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star1"></label>
              </div>

              <div className="checkbox-wrapper-56" >
                <label className="rating-container">
                  <input checked="checked"  type="checkbox" onClick={handleratingSubmit} />
                  <div className="checkmark"></div>
                </label>
              </div>
            

            <button className="chat-btn txtme" onClick={startConvo}>Text Me</button>
            {check !== "hired" && (
              <>
                <button className="chat-btn interview" onClick={togglePopup}>
                  Set interview
                </button>
                <button
                  className="chat-btn hire"
                  onClick={() => hiredapp("hire")}
                >
                  Hire
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div className="popupi">
          <div className="popup-contenti">
            <h2>Set Interview Date</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="interviewDate">Interview Date:</label>
              <input
                type="date"
                id="interviewDatei"
                value={interviewDate}
                onChange={handleDateChange}
              />
              <label htmlFor="interviewTime">Interview Time:</label>
              <input
                type="time"
                id="interviewTime"
                value={interviewTime}
                onChange={handleTimeChange}
              />
              <button type="submit">Set Date</button>
              <button type="button" onClick={togglePopup}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
