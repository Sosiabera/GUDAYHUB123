import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Freelancer/css/addprofile.css";
import useAuth from "../../Hooks/UseAuth";

export default function EmployerProfile() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();

  const [inputValue, setInputValue] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    gender: "",
    title: "",
  });
  const inputRef = useRef(null);
  const [employerData, setEmployerData] = useState({
    Usertype: null,
    username: null,
    Fullname: null,
    Phonenumber: null,
    Email: null,
    Gender: null,
    freelancerprofile: {
        profilepic: null}
  });
  const [popup, setPopup] = useState(false);

  const handleImage = () => {
    inputRef.current.click();
  };

  const uploadImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await editPic(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/employer/readprofile/${userData.userID}`
        );
        setEmployerData(response.data);
        setInputValue({
          fullname: response.data.fullname || "",
          email: response.data.email || "",
          phonenumber: response.data.phonenumber || "",
          gender: response.data.gender || "",
          title: response.data.title || "",
        });
      } catch (error) {
        console.error("Employer error", error);
      }
    };
    fetchData();
  }, [userData.userID]);


  const editPic = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.put(
        `http://localhost:4000/employer/picedit/${userData.userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error uploading picture", error);
    }
  };

  const editData = async () => {
   
    try {
      await axios.put(
        `http://localhost:4000/employer/edit/${userData.userID}`, 
        {
            fullname:inputValue.fullname, email:inputValue.email, phonenumber: inputValue.phonenumber, gender:inputValue.gender,title: inputValue.title
        }
      );
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

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
      <div className="holder start-0">
        <img
          onClick={togglePopup}
          className="profilepic"
          src={
            !employerData.freelancerprofile.profilepic
              ? `/image/profile.jpg`
              : getProfilePicUrl(employerData.freelancerprofile.profilepic)
          }
          alt="Profile"
        />
      </div>
      <div className="wrapper">
        {popup && (
          <div className={`profilebox morepro `}>
            <div className="profile-content">
              <div className="pholder " onClick={handleImage}>
                <img
                  className="ppic"
                  src={
                    !employerData.freelancerprofile.profilepic
                      ? `/image/profile.jpg`
                      : getProfilePicUrl(employerData.freelancerprofile.profilepic)
                  }
                  alt="Profile"
                />
                <input
                  onChange={uploadImg}
                  type="file"
                  ref={inputRef}
                  style={{ display: "none" }}
                />
              </div>
              <br />
              {employerData.Fullname} <br />
              {employerData.Email}
              <br />
              <input
                type="text"
                placeholder="Full Name"
                value={inputValue.fullname}
                onChange={(e) =>
                  setInputValue({ ...inputValue, fullname: e.target.value })
                }
              />
              <br />
              <input
                type="email"
                placeholder="Email"
                value={inputValue.email}
                onChange={(e) =>
                  setInputValue({ ...inputValue, email: e.target.value })
                }
              />
              <br />
              <input
                type="text"
                placeholder="Phone Number"
                value={inputValue.phonenumber}
                onChange={(e) =>
                  setInputValue({ ...inputValue, phonenumber: e.target.value })
                }
              />
             
              <br /> <br />
              <input
                type="text"
                placeholder="Title"
                value={inputValue.title}
                onChange={(e) =>
                  setInputValue({ ...inputValue, title: e.target.value })
                }
              />
              <br /> <br />
              <button className="popup-btn" onClick={editData}>
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
