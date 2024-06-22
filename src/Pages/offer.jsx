import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../Hooks/UseAuth";
import "./css/offer.css";

export default function Offer() {
  const { getUserData } = useAuth();
  const userData = getUserData();

  const [readData, setReadData] = useState([]);
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [readDataPostTitles, setReadDataPostTitles] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  useEffect(() => {
    setArrayIsEmpty(readData.length === 0);
  }, [readData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataResponse = await axios.get(`http://localhost:4000/Offer/read`, {
          params: { freelancerid: userData.userID },
        });

        setReadData(dataResponse.data);

        await Promise.all(
          dataResponse.data.map(async (data) => {
            try {
              const response = await axios.get(`http://localhost:4000/employer/searchoffer/${data.employerid}`);
              setReadDataPostTitles((prevState) => ({
                ...prevState,
                [data.employerid]: response.data,
              }));
            } catch (error) {
              console.error(`Error fetching employer data for ID ${data.employerid}:`, error);
            }
          })
        );
      } catch (error) {
        console.log("Error fetching data: " + error);
      }
    };

    fetchData();
  }, [userData.userID]);

  const handleAccept = async (status, id) => {
    try {
      if (status === "rejected" && inputValue.trim() === "") {
        alert("Please provide a reason for rejection.");
        return;
      }

      await axios.put(`http://localhost:4000/Offer/changestatus`, null, {
        params: { status: status, offerid: id, message: inputValue },
      });

      if (status === "accepted") {
        alert("Offer accepted");
      } else if (status === "rejected") {
        alert("Offer rejected");
      }

      setInputValue("");
      setIsPopupOpen(false);
      const updatedData = readData.map((data) =>
        data._id === id ? { ...data, status } : data
      );
      setReadData(updatedData);
    } catch (error) {
      console.error("Error accepting offer:", error);
      alert("Error accepting offer");
    }
  };

  const togglePopup = (id = null) => {
    setSelectedOfferId(id);
    setIsPopupOpen(!isPopupOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleAccept("rejected", selectedOfferId);
    }
  };

  return (
    <>
      {arrayIsEmpty ? (
        <div className="nojob">
          <img style={{ width: "300px" }} src={`/image/nooffer.png`} alt="No offers" />
        </div>
      ) : (
        <div className="">
          {readData.map((data) => (
            <div key={data._id}>
              <div className="postblock box">
                <div className="ribbon-2">{data.status}</div>
                <h3 className="textf">Description</h3>
                <p className="titlef">{data.Description}</p>
                <h3 className="textf">Price</h3>
                <p className="titlef">{data.price}</p>
                {readDataPostTitles[data.employerid] && (
                  <>
                    <h3 className="textf">Employer Name</h3>
                    <p className="titlef">{readDataPostTitles[data.employerid].Fullname}</p>
                  </>
                )}
              </div>
              {data.status === "waiting" ? (
                <>
                  <button onClick={() => handleAccept("accepted", data._id)} className="btn-job">Accept</button>
                  <button onClick={() => togglePopup(data._id)} className="btn-job reject">Reject</button>
                </>
              ) : (
                <>
                  <button className="btn-job applied">Accept</button>
                  <button className="btn-job reject applied">Reject</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {isPopupOpen && (
        <div className="popupi">
          <div className="popup-contenti">
            <h2>State why you want to reject the offer</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => togglePopup()}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

