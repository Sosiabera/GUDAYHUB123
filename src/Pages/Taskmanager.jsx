import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../Hooks/UseAuth";
import "./css/taskmanager.css";
import { useWindowSize } from "@uidotdev/usehooks";
import Confetti from "react-confetti";
import BackButton from "../components/BackButton";

export default function Taskmanager() {
  const { getUserData, getUserToken } = useAuth();
  const userData = getUserData();
  const token = getUserToken();

  const [readData, setReadData] = useState([]);
  const [readHired, setReadHired] = useState([]);
  const [readDataPostTitles, setReadDataPostTitles] = useState([]);
  const [readHiredPostTitles, setReadHiredPostTitles] = useState([]);
  const [dataLen, setDataLen] = useState(0);
  const [hiredLen, setHiredLen] = useState(0);
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [hiredIsEmpty, setHiredIsEmpty] = useState(false);
  const [hired, setHired] = useState(false);
  const { width, height } = useWindowSize();
  const confettiDuration = 2000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appliedResponse = await axios.get("http://localhost:4000/applicant/searchappliedposts", {
          params: { freelancerid: userData.userID },
        });
        const hiredResponse = await axios.get("http://localhost:4000/hired/searchhiredposts", {
          params: { freelancerid: userData.userID },
        });

        setReadData(appliedResponse.data);
        setReadHired(hiredResponse.data);

        const appliedPostTitles = await Promise.all(appliedResponse.data.map(data =>
          axios.get(`http://localhost:4000/post/searchpost/${data.postid}`)
            .then(response => response.data.Jobtitle)
            .catch(() => null)
        ));
        setReadDataPostTitles(appliedPostTitles);

        const hiredPostTitles = await Promise.all(hiredResponse.data.map(data =>
          axios.get(`http://localhost:4000/post/searchpost/${data.postid}`)
            .then(response => response.data.Jobtitle)
            .catch(() => null)
        ));
        setReadHiredPostTitles(hiredPostTitles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userData.userID]);

  useEffect(() => {
    const hiredApplicant = readData.find(data => data.status === "hired");
    if (hiredApplicant) {
      setHired(true);
      setTimeout(() => {
        axios.post("http://localhost:4000/hired/addhired", { appId: hiredApplicant._id })
          .then(() => window.location.reload())
          .catch(error => {
            console.error("Error adding hired:", error);
            alert("Error adding hired");
          });
      }, confettiDuration);
    }
  }, [readData, confettiDuration]);

  useEffect(() => {
    setDataLen(readData.length);
    setHiredLen(readHired.length);
    setArrayIsEmpty(readData.length === 0);
    setHiredIsEmpty(readHired.length === 0);
  }, [readData, readHired]);

  console.log("readHired:", readHired);

  return (
    <>
      <Confetti
        width={width}
        height={height}
        run={hired}
        numberOfPieces={400}
        confettiSource={{ x: 0, y: 100, w: width, h: 600 }}
      />

      {arrayIsEmpty ? (
        <div className="taskblock">You have not applied to any job or task yet</div>
      ) : (
        <>
          <div className="taskblock">You have {dataLen} current application{dataLen > 1 ? 's' : ''}</div>
          <div className="container">
            {readData.map((data, index) => (
              <div className="applylist" key={data.postid}>
                {readDataPostTitles[index] && (
                  <>
                    <h3 className="textf">Job title</h3>
                    <p className="titlef">{readDataPostTitles[index]}</p>
                  </>
                )}
                <h3 className="textf">Cover Letter</h3>
                <p className="titlef">{data.Coverletter}</p>
                <h3 className="textf">Status</h3>
                <p className="titlef">{data.status}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {hiredIsEmpty ? (
        <div className="taskblock">You have not gotten any job in GudayHub</div>
      ) : (
        <>
          <div className="taskblock">You have gotten {hiredLen} job{hiredLen > 1 ? 's' : ''} in GudayHub</div>
          <div className="container">
            {readHired.map((data, index) => (
              <div className="applylist" key={data.postid}>
                {readHiredPostTitles[index] && (
                  <>
                    <h3 className="textf">Job title</h3>
                    <p className="titlef">{readHiredPostTitles[index]}</p>
                  </>
                )}
                <h3 className="textf">Cover Letter</h3>
                <p className="titlef">{data.Coverletter}</p>
                <h3 className="textf">Status</h3>
                <p className="titlef">{data.status}</p>
              </div>
            ))}
          </div>
        </>
      )}
      <BackButton />
    </>
  );
}
