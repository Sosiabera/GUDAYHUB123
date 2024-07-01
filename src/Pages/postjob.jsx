import { useState, useEffect } from "react";
import axios from "axios";
import "./css/post.css";
import useAuth from "../Hooks/UseAuth";
import BackButton from "../components/BackButton";

export default function Write() {
  const { getUserData, getUserToken } = useAuth();
  const userData = getUserData();
  const token = getUserToken();

  const [inputValue, setinputValue] = useState({
    JobTask: "",
    Jobtype: "",
    Jobtitle: "",
    Description: "",
    Qualification: "",
    PostedDate: "",
    Deadline: "",
    Salary: "",
    Contact: "",
    location: "",
    urgency: "",
    anonymous: false,
    cv: false,
    coverletter: false,
  });

  const [readData, setreadData] = useState([]);
  const [show, setShow] = useState("");
  const [showbox, setShowbox] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [DataLen, setDataLen] = useState("");

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

  const saveData = async () => {
    try {
      await axios.post("http://localhost:4000/post/writepost", {
        ...inputValue,
        PostedDate: combinedDateTime,
        employerid: userData.userID,
      });
      console.log("data: ", inputValue);
      alert("job/task posted");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get("http://localhost:4000/PostHistory/reademployerpost", {
            params: { employerid: userData.userID },
          })
          .then((Post) => setreadData(Post.data));
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, [userData.userID]);

  const handleJobTaskChange = (value) => {
    setinputValue((prevState) => ({ ...prevState, JobTask: value }));
    setShow(value);
    setShowbox("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setinputValue((prevState) => ({ ...prevState, [name]: value }));
  };

  const isEmpty = (arr) => {
    const isEmptyArray = arr.length === 0;
    if (!isEmptyArray) {
      setDataLen(arr.length);
    }
    return isEmptyArray;
  };

  useEffect(() => {
    const emptyCheck = isEmpty(readData);
    setArrayIsEmpty(emptyCheck);
  }, [readData]);

  const handleAnonymousToggle = () => {
    setinputValue({ ...inputValue, anonymous: !inputValue.anonymous });
  };
  const handlecvToggle = () => {
    setinputValue({ ...inputValue, cv: !inputValue.cv });
  };
  const handlecoverToggle = () => {
    setinputValue({ ...inputValue, coverletter: !inputValue.coverletter });
  };
  const handleurgencyToggle = () => {
    setinputValue({ ...inputValue, urgency: !inputValue.urgency });
  };

  return (
    <>
      <div className="postimg">
        <div className="post">
          <h1 className="post-h1"></h1>
          <br />
          <br />
          <button className="c-button" onClick={() => setShowbox("post")}>
            <span className="c-main">
              <span className="c-ico">
                <span className="c-blur"></span>{" "}
                <span className="ico-text">+</span>
              </span>
              Post
            </span>
          </button>
          <div className={`post-div${showbox}`}>
            <div className="radiocontainer">
              <div className="radiobox">
                <div
                  className="radioleft-side"
                  onClick={() => handleJobTaskChange("Job")}
                >
                  <h3>Job</h3>
                </div>
                <div
                  className="radioright-side"
                  onClick={() => handleJobTaskChange("Task")}
                >
                  <h3>Task</h3>
                </div>
              </div>
            </div>
          </div>

          {show && (
            <div>
              {show === "Job" && (
                <div className="toggle-div end-0">
                  <p>Is CV required to apply?</p>
                  <div className="toggle-button-cover ">
                    <div id="button-3" className="buttont r">
                      <input
                        className="checkboxt"
                        type="checkbox"
                        checked={inputValue.cv}
                        onChange={handlecvToggle}
                      />
                      <div className="knobs"></div>
                      <div className="layer"></div>
                    </div>
                  </div>
                  <p>Is cover letter required to apply?</p>
                  <div className="toggle-button-cover ">
                    <div id="button-3" className="buttont r">
                      <input
                        className="checkboxt"
                        type="checkbox"
                        checked={inputValue.coverletter}
                        onChange={handlecoverToggle}
                      />
                      <div className="knobs"></div>
                      <div className="layer"></div>
                    </div>
                  </div>
                </div>
              )}

              {show === "Job" || show === "Task" ? (
                <>
                  <div className="toggle-div end-0 both">
                    <p>Do you wish to be annonmous to freelancers?</p>
                    <div className="toggle-button-cover ">
                      <div id="button-3" className="buttont r">
                        <input
                          className="checkboxt"
                          type="checkbox"
                          checked={inputValue.anonymous}
                          onChange={handleAnonymousToggle}
                        />
                        <div className="knobs"></div>
                        <div className="layer"></div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="containert on "
                    onClick="this.classList.toggle('off'); this.classList.toggle('on')"
                  >
                    <div class="toggle">
                      <div class="detail"></div>
                      <div class="detail"></div>
                      <div class="detail"></div>
                    </div>
                  </div>


                  <JobTypeSelector setinputValue={setinputValue} />
                  <InputField
                    name="Jobtitle"
                    placeholder="Job Title"
                    value={inputValue.Jobtitle}
                    onChange={handleInputChange}
                  />
                  <InputField
                    name="Description"
                    placeholder="Description"
                    value={inputValue.Description}
                    onChange={handleInputChange}
                  />
                  <InputField
                    name="Qualification"
                    placeholder="Qualification"
                    value={inputValue.Qualification}
                    onChange={handleInputChange}
                  />
                  <DeadlineField
                    value={inputValue.Deadline}
                    onChange={handleInputChange}
                  />
                  <InputField
                    name="location"
                    placeholder="location"
                    value={inputValue.location}
                    onChange={handleInputChange}
                  />
                  <InputField
                    name="Contact"
                    placeholder="Contact"
                    value={inputValue.Contact}
                    onChange={handleInputChange}
                  />
                  <InputField
                    name="Salary"
                    placeholder="Salary"
                    value={inputValue.Salary}
                    onChange={handleInputChange}
                  />
                </>
              ) : null}

              {show === "Task" && (
                <>
                <p>Urgency</p>
                  <div id="button-3" className="buttont r">
                    <input
                      className="checkboxt"
                      type="checkbox"
                      checked={inputValue.urgency}
                      onChange={handleurgencyToggle}
                    />
                    <div className="knobs"></div>
                    <div className="layer"></div>
                  </div>
               
                </>
              )}

              <button className="btn-save" onClick={saveData}>
                Post
              </button>
            </div>
          )}
        </div>
      </div>

      {arrayIsEmpty ? (
        <div className="taskblock">You have not posted any job or task yet</div>
      ) : (
        <div>
          <div className="taskblock">You had posted {DataLen} job </div>
          {readData.map((data) => (
            <>
              <div className="applylist">
                <div>
                  <h3 className="textf">Job title </h3>
                  <p className="titlef">{data.Jobtitle}</p>
                </div>
                <h3 className="textf">Job type </h3>
                <p className="titlef">{data.Jobtype}</p>
                <h3 className="textf">Description </h3>
                <p className="titlef">{data.Description}</p>
                <button onClick={() => handleDelete(data._id)}>Delete</button>
              </div>
              <button
                className="btn-job1 more"
                onClick={() => handleDelete(data._id)}
              >
                 Delete Post 
              </button>

              <button
                className="btn-job1 more"
                onClick={() => handlepost(data._id)}
              >
                Post details
              </button>
            </>
          ))}
        </div>
      )}
      <BackButton />
    </>
  );
}

function JobTypeSelector({ setinputValue }) {
  return (
    <div>
      <br />
      Job Type
      <div
        className="skills"
        onClick={() =>
          setinputValue((prevState) => ({ ...prevState, Jobtype: "onsite" }))
        }
      >
        onsite
      </div>
      <div
        className="skills"
        onClick={() =>
          setinputValue((prevState) => ({ ...prevState, Jobtype: "remote" }))
        }
      >
        remote
      </div>
      <div
        className="skills"
        onClick={() =>
          setinputValue((prevState) => ({ ...prevState, Jobtype: "hybrid" }))
        }
      >
        hybrid
      </div>
      <BackButton />
    </div>
  );
}


function InputField({ name, placeholder, value, onChange }) {
  return (
    <div>
      <input
        className="post-input"
        placeholder={placeholder}
        type="string"
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function DeadlineField({ value, onChange }) {
  return (
    <div>
      <label htmlFor="deadline">Deadline</label>
      <input
        className="post-input"
        type="date"
        id="deadline"
        name="Deadline"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
