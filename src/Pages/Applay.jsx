import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../Hooks/UseAuth";
import { useLocation } from "react-router-dom";
import { format } from "timeago.js";
import "./css/apply.css";
import { useTranslation } from 'react-i18next';
import BackButton from "../components/BackButton";

export default function Apply() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();
  const { t } = useTranslation();

  const location = useLocation();

  const { postid } = location.state || {};

  const [readData, setreadData] = useState([]);

  const [freelancerData, setfreelancerData] = useState([]);
  const [applied, setapplied] = useState("");
  const [file, setfile] = useState("");


  const uploadcv = (e) => {
    setfile(e.target.files[0]);
    console.log(file);
  };

  const alreadyapplied = (applied) => {
    if(applied === "applied"){
      alert("You have already applied");
    }
    if(applied === "hired")
      {alert("You have already been hired");}
    
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/freelancer/apply/${userData.userID}`
        );
        setfreelancerData(response.data);
      } catch (error) {
        console.error("freelacer error", error);
      }
    };
    fetchData();
  }, []);

  const [inputValue, setinputValue] = useState({
    Freelancerid: "",
    postid: "",
    Coverletter: "",
    status: "",
  });

  const saveData = async () => {
    try {
      editData(file);
      if(readData.coverletter === true && inputValue.Coverletter === ""){
        alert("cover letter is a requirment for this job")
        return
      }
      if (readData.cv === true && (freelancerData.freelancerprofile.cv === "" || freelancerData.freelancerprofile.cv === null)) {
        alert("CV is a requirement for this job");
        return;
      }
      await axios.post("http://localhost:4000/applicant/writeapplicant", {
        Freelancerid: userData.userID,
        postid: readData._id,
        Coverletter: inputValue.Coverletter,
        status: "waiting",
      });
      console.log("data: ", inputValue);
      setPopup(!popup);
      alert("application sent");
      fetchData();
    } catch (error) {
      console.log("errorr", error);
    }
  };

  const fetchData = async () => {
    try {
      await axios
        .get("http://localhost:4000/applicant/searchapplied", {
          params: { postid: postid, freelancerid: userData.userID },
        })
        .then((response) => {
          const data = response.data;

          if (data.message === "have applied") {
            setapplied("applied");
          }
          if (data.message === "have been hired") {
            setapplied("hired");
          }
        });
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postid, userData.userID]);

  function isFormDataEmpty(formData) {
    for (let pair of formData.entries()) {
      return false;
    }
    return true;
  }

  const editData = async (cv) => {
    const formData = new FormData();
    if (cv) {
      formData.append("cv", cv);
    }

    if (!isFormDataEmpty(formData)) {
      try {
        await axios.put(
          `http://localhost:4000/freelancer/edit/${userData.userID}`,
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
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/post/searchpost/${postid}`
        );
        setreadData(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, []);

  const [popup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!popup);
  };

  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }
  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };



  return (
    <>
      <div>
        {readData && (
          <div>
            <h2> {readData.JobTask}</h2>
            <h2>{t('Job Type')}: {readData.Jobtype}</h2>
            <p>{t('Job Title')}: {readData.Jobtitle}</p>
            <p>{t('Description')}: {readData.Description}</p>
            <p>{t('Qualification')}: {readData.Qualification}</p>
            <p>{t('Salary')}: {readData.Salary}</p>
            <p>{t('Location')}: {readData.location}</p>
            <p>{t('Contact')}: {readData.Contact}</p>
            <p>{t('PostedDate')}: {format( readData.PostedDate)}</p>
            <p>{t('Deadline')}: {readData.Deadline}</p>

            {applied === "applied" || applied === "hired" ? (
              <button className="apply-btn applied" onClick={() => alreadyapplied(applied)}>
                {t('Apply Now')}
              </button>
            ) : (
              <button className="apply-btn" onClick={togglePopup}>
                {t('Apply Now')}
              </button>
            )}

            <div className="wrapper">
              {popup && (
                <div className={`form`}>
                  <div className="form-content">
                    <h3 className="">
                      {t('Application for')} {readData.Jobtitle} {t('position')}
                    </h3>
                    {t('Fullname')}
                    <input
                      className="input"
                      type="text"
                      placeholder={freelancerData.Fullname}
                    />
                    <br />
                    {t('Phonenumber')}
                    <input
                      className="input"
                      type="text"
                      placeholder={freelancerData.Phonenumber}
                    />
                    <br />
                    {t('Email')}
                    <input
                      className="input"
                      type="email"
                      placeholder={freelancerData.Email}
                    />{" "}
                    <br />
                    {t('Address')}
                    <input
                      className="input"
                      type="text"
                      placeholder="Address"
                    />{" "}
                    <br />
                    {t('Your CV')}
                    {freelancerData.freelancerprofile.cv ? (
                      <div className="">
                        <a
                          href={getProfilePicUrl(
                            freelancerData.freelancerprofile.cv
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`/image/cv.png`}
                            style={{ width: "5rem" }}
                          />
                        </a>
                      </div>
                    ) : null}
                    {t('Change CV')}
                    <input type="file" onChange={uploadcv} /> <br />
                    {t('Cover Letter')}
                    <input
                      className="input"
                      type="text"
                      placeholder="coverletter"
                      value={inputValue.Coverletter}
                      onChange={(e) =>
                        setinputValue({
                          ...inputValue,
                          Coverletter: e.target.value,
                        })
                      }
                    />{" "}
                    <br />
                    <br /> <br />
                    <button className="popup-btn" onClick={saveData}>
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
        )}
      </div>
      <BackButton />
    </>
  );
}
