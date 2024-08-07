import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";
import "./css/freelancerdetails.css";
import { useTranslation } from 'react-i18next';
import useAuth from "../../Hooks/UseAuth";
import PortfolioSlider from "../../assets/portfolio";

export default function Freelancerdetails() {
  const { getUserData, getUserToken } = useAuth();
  const userData = getUserData();
  const token = getUserToken();

  const location = useLocation();
  const navigate = useNavigate()

  const { t } = useTranslation();
  const { userid } = location.state || {};

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
  const [inputValue, setinputValue] = useState({
    Description: "",
    PostedDate: "",
    price: "",
    freelancerid: "",
    employerid: "",
  });
  const [showWork, setshowWork] = useState(true);
  const [showPortfolio, setshowportfolio] = useState(false);

  const work = ()=>{
    if(!showWork)
    setshowWork(!showWork)
    if(showPortfolio){
      setshowportfolio(!showPortfolio)
    }
  }

  const portfolio = ()=>{
    if(!showPortfolio)
    setshowportfolio(!showPortfolio)
    if(showWork)
      setshowWork(!showWork)
  }
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

  const [popup, setPopup] = useState(false);

  const togglePopup = () => {
    if (!userData) {
      const redirectData = {
        pathname: "/employerpage/Freelancerdetails",
        state: location.state,
      };
      sessionStorage.setItem("redirectDataEmployer", JSON.stringify(redirectData));

      navigate("/login");
    } else {
    setPopup(!popup);
    }
  };


  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  const generateStars = (rating) => {
    const roundedRating = Math.round(rating * 2) / 2;
    const stars = [];
    for (let i = 5; i >= 1; i--) {
      if (roundedRating >= i) {
        stars.push(
          <label key={i} className={`${i} full-stars`}>
            &#9733;
          </label>
        );
      } else if (roundedRating + 0.5 === i) {
        stars.push(
          <label key={i} className={`${i} half-stars`}>
            &#9733;
          </label>
        );
      } else {
        stars.push(
          <label key={i} className={`${i} no-stars`}>
            &#9734;
          </label>
        );
      }
    }
    stars.reverse()
    return stars;
  }
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    setCurrentDateTime({
      date: formattedDate,
      time: formattedTime,
    });
  }, []);

  const combinedDateTime = `${currentDateTime.date} ${currentDateTime.time}`;

  const saveOffer = async () => {
    try {
      await axios.post("http://localhost:4000/Offer/write", {
        ...inputValue,
        PostedDate: combinedDateTime,
        freelancerid: userid,
        employerid: userData.userID,
        status:"waiting"
      });
      console.log("data: ", inputValue);
      alert("offer posted");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
    <div className="full-page">
      <div className="fdetails">
        {readData && (
          <div className="firstinfo">

                <img
                  className="ppf-details"
                  src={
                    readData.freelancerprofile.profilepic === "" ||
                    readData.freelancerprofile.profilepic === null
                      ? `/image/profile.jpg`
                      : getProfilePicUrl(readData.freelancerprofile.profilepic)
                  }
                  alt="Profile"
                />


            <h2> {t('Freelancer')}: {readData.Fullname}</h2>
            <p>  {readData.freelancerprofile.description}</p>
            <div className="rating ">
                {generateStars(readData.freelancerprofile.rating)}
              </div>

            <p> {t('Gender')}: {readData.Gender}</p>
            <p>{t('Profession')}: {readData.freelancerprofile.title}</p>

<br/>
            {readData.freelancerprofile.skills?.map((skill) => (
              
                <div className="skills readData">
                  <p>{skill}</p>
                </div>
              ))}
            
          
          </div>
        )}
      </div>
      <button className="chat-btn" onClick={togglePopup}>
               offer
            </button>
      <div className="full-info">
      <div className="radio-inputs">
  <label className="radio" >
    <input type="radio" name="radio" />
    <span className="name h" onClick={work}>Work History</span>
  </label>
  <label className="radio">
    <input type="radio" name="radio" />
    <span className="name r"  onClick={portfolio}>Porfolio Images</span>
  </label>

  <label className="radio">
    <input type="radio" name="radio" />
    <span className="name v">Other Porfolio</span>
  </label>
</div>

{showWork && 
(readData.freelancerprofile.workhistory ? (
  <>
   
	<ol className="olcards ">
  {readData.freelancerprofile.workhistory.map((data, index) => (
    <>
		
		<li className="workcard">
			<div className="content">
				<div className="title num ">{index+1}</div>
				<div className="text work">{data}</div>
			</div>
		</li>
 
    </>
    ))}
	</ol>

  </>
):(
  <>

  <ol className="olcards ">
 
		<li className="workcard">
			<div className="content">
				
				<div className="text work">No work History</div>
			</div>
		</li>
	</ol>
  </>
))}

{showPortfolio && (
 <>

<PortfolioSlider />

 </>)}
      </div>
      </div>

      
      <div className="wrapper">
              {popup && (
                <div className={`form`}>
                  <div className="form-content">
                  Description
                    <input
                      className="input"
                      type="text"
                      placeholder="write a detailed description of the job"
                      onChange={(e) =>
                        setinputValue({
                          ...inputValue,
                          Description: e.target.value,
                        })}
                    />
                    <br />
                    Price
                    <input
                      className="input"
                      type="text"
                      placeholder="set your price"
                      onChange={(e) =>
                        setinputValue({
                          ...inputValue,
                          price: e.target.value,
                        })}
                    />

                    <br />
                   <br />
                    <button className="popup-btn" onClick={saveOffer}>
                      Submit
                    </button>
                    <button className="popup-btn" id="x" onClick={togglePopup}>
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>
    </>
  );
}
