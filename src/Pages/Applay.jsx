import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import { format } from "timeago.js";
import "./css/apply.css";
import { useTranslation } from 'react-i18next';
import BackButton from "../components/BackButton";

export default function Apply() {
  const { getUserData, getUserToken } = useAuth();
  const navigate = useNavigate();

  const userData = getUserData();
  const token = getUserToken();
  const { t } = useTranslation();

  const location = useLocation();
  const { postid } = location.state || {};

  const [readData, setReadData] = useState([]);
  const [freelancerData, setFreelancerData] = useState([]);
  const [applied, setApplied] = useState("");
  const [file, setFile] = useState("");
  const [inputValue, setInputValue] = useState({
    Freelancerid: "",
    postid: "",
    Coverletter: "",
    status: "",
  });
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      if (userData && userData.userID) {
        try {
          const response = await axios.get(
            `http://localhost:4000/freelancer/apply/${userData.userID}`
          );
          setFreelancerData(response.data);
        } catch (error) {
          console.error("freelancer error", error);
        }
      }
    };
    fetchFreelancerData();
  }, [userData]);

  const uploadcv = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  };

  const alreadyApplied = (applied) => {
    if (applied === "applied") {
      alert("You have already applied");
    }
    if (applied === "hired") {
      alert("You have already been hired");
    }
  };

  const saveData = async () => {
    try {
      editData(file);
      if (readData.coverletter && !inputValue.Coverletter) {
        alert("Cover letter is a requirement for this job");
        return;
      }
      if (
        readData.cv &&
        (!freelancerData.freelancerprofile.cv || freelancerData.freelancerprofile.cv === "")
      ) {
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
      alert("Application sent");
      fetchData();
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchData = async () => {
    if (userData && userData.userID) {
      try {
        const response = await axios.get("http://localhost:4000/applicant/searchapplied", {
          params: { postid: postid, freelancerid: userData.userID },
        });
        const data = response.data;

        if (data.message === "have applied") {
          setApplied("applied");
        }
        if (data.message === "have been hired") {
          setApplied("hired");
        }
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [postid, userData]);

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
        console.error("error", error);
      }
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/post/searchpost/${postid}`
        );
        setReadData(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchPostData();
  }, [postid]);

  const togglePopup = () => {
    if (!userData) {
      navigate("/login");
    } else {
      setPopup(!popup);
    }
  };

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  return (
    <>
      <div>
        {readData && (
          <div>
            <h2> {readData.JobTask}</h2>
<<<<<<< HEAD
            <h2>Job Type: {readData.Jobtype}</h2>
            <p>Job Title: {readData.Jobtitle}</p>
            <p>Description: {readData.Description}</p>
            <p>Qualification: {readData.Qualification}</p>
            <p>Salary: {readData.Salary}</p>
            <p>Location: {readData.Location}</p>
            <p>Contact: {readData.Contact}</p>
            <p>Posted Date: {format(readData.PostedDate)}</p>
            <p>Deadline: {readData.Deadline}</p>

            {applied === "applied" || applied === "hired" ? (
              <button className="apply-btn applied" onClick={() => alreadyApplied(applied)}>
                Apply Now
=======
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
>>>>>>> 8a858d009a296d7ddeb69090d6eac7512404a7ee
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
<<<<<<< HEAD
                    Your CV
=======
                    {t('Your CV')}
>>>>>>> 8a858d009a296d7ddeb69090d6eac7512404a7ee
                    {freelancerData.freelancerprofile.cv ? (
                      <div className="">
                        <a
                          href={getProfilePicUrl(freelancerData.freelancerprofile.cv)}
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
<<<<<<< HEAD
                    Change CV
=======
                    {t('Change CV')}
>>>>>>> 8a858d009a296d7ddeb69090d6eac7512404a7ee
                    <input type="file" onChange={uploadcv} /> <br />
                    {t('Cover Letter')}
                    <input
                      className="input"
                      type="text"
                      placeholder="coverletter"
                      value={inputValue.Coverletter}
                      onChange={(e) =>
                        setInputValue({
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

