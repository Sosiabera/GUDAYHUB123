import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Applicantsdetails(){
    const [readData, setreadData] = useState([]);
    const [readapplicant, setreadapplicant] = useState([]);
    const [freelancerData, setfreelancerData] = useState([]);
    const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
    const [DataLen, setDataLen] = useState("")
    
    const location = useLocation();
    const { t } = useTranslation();
    const {postid }= location.state || {};
    

    useEffect(() => {
      const fetchData = async () => {
        try {
          const applicantResponse = await axios.get(
            "http://localhost:4000/applicant/readjobapplicant",
            { params: { postid } }
          );
          const freelancerIds = applicantResponse.data.map(applicant => applicant.Freelancerid);
          
          const freelancerResponses = await Promise.all(
            freelancerIds.map(id =>
              axios.get(`http://localhost:4000/freelancer/apply/${id}`)
            )
          );
    
          const applicantNames = freelancerResponses.map(response => response.data.Fullname);
    
          setreadData(applicantResponse.data);
          setreadapplicant(applicantNames);
        } catch (error) {
          console.error("error", error);
        }
      };
    
      fetchData();
    }, [postid]);

    const changestatus = async (id, status) => {
      try {
        await axios.put(`http://localhost:4000/applicant/changestatus`, null, {
          params: { status: status, applicantid: id }
        });
      } catch (error) {
        console.error("error", error);
      }
    };
    

    const navigate = useNavigate();
    const handleclick = (id,userid,staus) => {
      if(staus === "waiting"){
        changestatus(id, "application opened")
        navigate("/employerpage/Applicantsdetails/more/Hire", { state: {userid: userid,applicaionid:id }})}
      else navigate("/employerpage/Applicantsdetails/more/Hire", { state: {userid: userid ,applicaionid:id  }})
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
    
  

    return(
        <>
     <div className="container">
     {arrayIsEmpty  ? (
        <div className="taskblock">{t('There is no appicant yet')}</div>
      ) : (
        <div>
        <div className="taskblock">{t('You have')} {DataLen}  {t('Appicants')}</div>
        {readData.map((data,index) => (
         <div onClick={() => handleclick(data._id,data.Freelancerid,data.status)}  className="freelist" >
          {readapplicant[index] && (
      <>
        <h3 className="textf">{t('Applicant name')}</h3>
        <p className="titlef">{readapplicant[index]}</p>
      </>
    )}
             <h3 className="textf"> {t('Job type')}</h3>
          <p className="titlef">{data.Jobtype}</p>
          <h3 className="textf"> {t('Cover Letter')}</h3>
          <p className="titlef">{data.Coverletter}</p>
           </div>
         ))}
         </div>
         )}
          </div>
        </>
     )
    }

