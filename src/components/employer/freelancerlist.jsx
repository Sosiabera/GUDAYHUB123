import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/freelancerlist.css";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faMinus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";



export default function Freelancerlist() {
  const [readData, setreadData] = useState([]);
  const { t } = useTranslation();
  const [searchicon, setsearchicon] = useState("");


  const searchclicked = () => {
    setsearchicon("active");
  };
  const searchclickednot = () => {
    setsearchicon("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/employer/readfromserver"
        );
        setreadData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleclick = (userid) => {
    navigate("Freelancerdetails", { state: { userid: userid } });
  };

  const filteredData = readData.filter(
    (data) => data.Usertype === "freelancer"
  );

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  // Function to generate stars HTML
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
  };

  return (
    <>
      <div className="jobparent">
      <div className={`serachparent`}>
          <FontAwesomeIcon
            className={`search s${searchicon} end-0 morecssserch`}
            icon={faSearch}
          />
          <input
            className={`another  end-0 morecss`}
            type="text"
            placeholder="Search specialtys"
           
            onClick={searchclicked}
          />
        </div>
        <div class={`sidebar${searchicon} end-0 morecssside`}>
        <FontAwesomeIcon
            className={`arrow start-0`}
            icon={faArrowRight}
            onClick={searchclickednot}
          />
        
  
        </div>



        <div className="freelist-container">
          {filteredData.map((data) => (
            <div onClick={() => handleclick(data._id)} className="free-list">
              <div>
                <img
                  className="ppf"
                  src={
                    data.freelancerprofile.profilepic === "" ||
                    data.freelancerprofile.profilepic === null
                      ? `/image/profile.jpg`
                      : getProfilePicUrl(data.freelancerprofile.profilepic)
                  }
                  alt="Profile"
                />
                <p className="titles">{data.freelancerprofile.title}</p>
              </div>

              <div className="rating">
                {generateStars(data.freelancerprofile.rating)}
              </div>

              

              <p className="namef">{data.Fullname}</p>
              <p>
                {" "}
                {data.freelancerprofile.gudayhistory.jobs
                  ? data.freelancerprofile.gudayhistory.jobs
                  : 0}{" "}
                jobs in GudayHub
              </p>

              {data.freelancerprofile.skills.map((skill, key) => (
                key <= 1 ?(
                <div className="skills freelist-skill">
                  <p>{skill}</p>
                </div>
                ):null
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
