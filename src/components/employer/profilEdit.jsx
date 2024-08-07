import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { useTranslation } from "react-i18next";

export default function Editprofile(prop) {
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    gender: "",
    title: "",
  });

  const editData = async () => {
    try {
      await axios.put(
        `http://localhost:4000/employer/edit/${userData.userID}`,
        {
          fullname: inputValue.fullname,
          email: inputValue.email,
          phonenumber: inputValue.phonenumber,
          gender: inputValue.gender,
          title: inputValue.title,
        }
      );
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const remove = () => {
    prop.prop2();
  };

  return (
    <>
      <div className="addpform">
        <div className="addp-content">
          <div className={``}>
            <h3>Edit Your Information Here</h3>
            <input
            className="ee"
              type="text"
              placeholder="Full Name"
              value={inputValue.fullname}
              onChange={(e) =>
                setInputValue({ ...inputValue, fullname: e.target.value })
              }
            />
            <br />
            <input
            className="ee"
              type="email"
              placeholder="Email"
              value={inputValue.email}
              onChange={(e) =>
                setInputValue({ ...inputValue, email: e.target.value })
              }
            />
            <br />
            <input
            className="ee"
              type="text"
              placeholder="Phone Number"
              value={inputValue.phonenumber}
              onChange={(e) =>
                setInputValue({ ...inputValue, phonenumber: e.target.value })
              }
            />
            <br />
            <input
            className="ee"
              type="text"
              placeholder="Title"
              value={inputValue.title}
              onChange={(e) =>
                setInputValue({ ...inputValue, title: e.target.value })
              }
            />
            <br /> <br />
            <button className="popup-btne" onClick={editData}>
              Submit
            </button>
            <button
              className="xe"
              id="x"
              onClick={remove}
            >
              X
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
