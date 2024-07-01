import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import "./css/taskmanager.css";
import { useTranslation } from 'react-i18next';
import BackButton from "../components/BackButton";

export default function Posthistory(){
    const { getUserData, getUserToken } = useAuth();

    const userData = getUserData();
    const token = getUserToken();
    const { t } = useTranslation();

    const [readData, setreadData] = useState([]);
    const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
    const [DataLen, setDataLen] = useState("")


    useEffect(() => {
      const fetchData = async () => {
        try {
       const response = await axios.get("http://localhost:4000/post/reademployerpost" ,{
          params: { employerid: userData.userID }
        })
            
            const sortedData = response.data.sort(
              (a, b) => new Date(b.PostedDate) - new Date(a.PostedDate)
            );
            setreadData(sortedData);
            
        } catch (error) {
          console.error("error", error);
        }
      };
      fetchData();
    }, [userData.userID]);

    
   

    let navigate = useNavigate();

    const handleclick = (postid) => {
        navigate("/employerpage/Applicantsdetails/more", { state: {postid: postid}});
    }

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

    const handlepost = (postid) => {
      navigate("/employerpage/Applicantsdetails/postdetails", { state: { postid: postid } });
    };

    return(
        <>
         {arrayIsEmpty  ? (
        <div className="taskblock">{t('You have not posted any job or task yet')}</div>
      ) : (
     <div>
      <div className="taskblock">{t('You have')} {DataLen}  {t('active job')}</div>
        {readData.map((data) => (
          <>
         <div className="applylist" >
             <div>
             <h3 className="textf"> {t('Job title')}</h3>
          <p className="titlef">{data.Jobtitle}</p>
          </div>
             <h3 className="textf">{t('Job type')} </h3>
          <p className="titlef">{data.Jobtype}</p>
          <h3 className="textf">{t('Description')} </h3>
          <p className="titlef">{data.Description}</p>
            </div>
            <button className="btn-job1 more" onClick={() => handlepost(data._id)}>
            {t('Post details')}</button>
          <button className="btn-job1 more1" onClick={() => handleclick(data._id)}>{t('See applicant')}</button>
          </>
         ))}
          </div>
            )}
            <BackButton />
        </>
     )
    }