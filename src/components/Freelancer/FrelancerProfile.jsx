import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useAuth from "../../Hooks/UseAuth";
import "./css/profile.css";
import Addprofile from "./Addprofile";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

export default function Frelancerprofile() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();

  const [inputValue, setinputValue] = useState({ title: "" });
  const [ShowAddProfile, setShowAddProfile] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const inputref = useRef(null);
  const [freelancerData, setfreelancerData] = useState({
    Usertype: null,
    username: null,
    Fullname: null,
    Phonenumber: null,
    Email: null,
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

  const handleImage = () => {
    inputref.current.click();
  };

  const uploadimg = async (e) => {
    const file = e.target.files[0];

    if (file) {
      await editpic(file);
    }
  };

  const addpro = () => {
    setShowAddProfile(!ShowAddProfile);
    setPopup(!popup);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/freelancer/freelancerapply/${userData.userID}`
        );
        setfreelancerData(response.data);
      } catch (error) {
        console.error("freelacer error", error);
      }
    };
    fetchData();
  }, []);

  const editpic = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.put(
        `http://localhost:4000/freelancer/picedit/${userData.userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Multer-specific error related to file format validation
        alert(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        // Server-side error
        alert("Server error occurred. Please try again later.");
      } else {
        // Other general errors
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      }
    }
      
    
  };

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
    
  };

  

  const editData = async () => {
    const formData = new FormData();

    formData.append("title", inputValue.title);
    try {
      await axios.put(
        `http://localhost:5000/freelanceredit/${userData._userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("errorr", error);
    }
  };

  const [popup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!popup);
  };

  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }


  const handleComplaintClick = () => {
    navigate("/Complaint");
  };
  const handleClick = () => {
    navigate("/Interview");
};

  return (
    <>
           <div className="holder start-0 interviewlogo">
          
            <img
              onClick={handleClick}
              className="profilepic "
              src={`/image/interview5.png`}
              alt="Profile"
            />
     
        </div>

      <div>{ShowAddProfile && <Addprofile prop={freelancerData}
                                          prop2 ={addpro} />}</div>
      <div>
        <div className="holder start-0">
          {freelancerData === null ? (
            <img
              onClick={togglePopup}
              className="profilepic "
              src={`/image/profile.jpg`}
              alt="Profile"
            />
          ) : (
            <img
              onClick={togglePopup}
              className="profilepic "
              src={
                freelancerData.freelancerprofile.profilepic === "" ||
                freelancerData.freelancerprofile.profilepic === null
                  ? `/image/profile.jpg`
                  : getProfilePicUrl(freelancerData.freelancerprofile.profilepic)
              }
              alt="Profile"
            />
            
          )}
        </div>
        <div className="wrapper ">
          {popup && (
            <div className={`profilebox `}>
              <div className="profile-content">
                <div className="pholder " onClick={handleImage}>
                  <img
                    className="ppic "
                    src={
                      freelancerData.freelancerprofile.profilepic === "" ||
                      freelancerData.freelancerprofile.profilepic === null
                        ? `/image/profile.jpg`
                        :  getProfilePicUrl(freelancerData.freelancerprofile.profilepic)
                    }
                    alt="Profile"
                  />
                  <input
                    onChange={uploadimg}
                    type="file"
                    ref={inputref}
                    style={{ display: "none" }}
                  />
                </div>
                <br />
                {freelancerData.Fullname} <br />
                {freelancerData.Email}
                <br />
                {freelancerData &&
                  (freelancerData.freelancerprofile?.title === null ||
                  freelancerData.freelancerprofile?.skills === null ||
                  freelancerData.freelancerprofile?.workhistory === null ||
                  freelancerData.freelancerprofile?.description === null ||
                  freelancerData.freelancerprofile.portfolio?.link === null ? (
                    <div className="finprofile" onClick={addpro}>
                      <p>{t('Finish creating your profile!!')} </p>
                      <h6>{t('Not having a finished profile  might affect your cradiability!')} </h6>
                    </div>
                  ) : null)}
                 
                  <div className="finprofile complaint" onClick={handleComplaintClick}>
                      <h6>{t('Complaint')} </h6>
                    </div>
              
                <br /> <br />
                <button className="popup-btn" onClick={editData}>
                  {t('Submit')}
                </button>
                <button className="popup-btn" id="x" onClick={togglePopup}>
                  X
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
