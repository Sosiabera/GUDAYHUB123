import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Applicantsdetails(){
    const [readData, setreadData] = useState([]);
    const [readhired, setreadhired] = useState([]);
    const [readapplicant, setreadapplicant] = useState([]);
    const [readhiredapplicant, sethiredapplicant] = useState([]);
    const [freelancerData, setfreelancerData] = useState([]);
    const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
    const [hiredIsEmpty, sethiredIsEmpty] = useState(false);
    const [DataLen, setDataLen] = useState("")
    const [hiredLen, sethiredLen] = useState("")
    
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
//for hired
              const hiredResponse = await axios.get(
                "http://localhost:4000/hired/readhired",
                { params: { postid } }
              );
              const hiredids = hiredResponse.data.map(Hired => Hired.Freelancerid);
             
              
              const hireResponses = await Promise.all(
                hiredids.map(id =>
                  axios.get(`http://localhost:4000/freelancer/apply/${id}`)
                )
              );

          const hiredNames = hireResponses.map(response => response.data.Fullname);
    
          setreadData(applicantResponse.data);
          setreadapplicant(applicantNames);
          setreadhired(hiredResponse.data);
          sethiredapplicant(hiredNames);
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
        navigate("/employerpage/Applicantsdetails/more/Hire", { state: {userid: userid,applicaionid:id,postid:"not" }})}
        else if(staus === "hired" || staus === "got the job" || staus === "hire"){
        navigate("/employerpage/Applicantsdetails/more/Hire", { state: {userid: userid ,applicaionid:id,check:"hired"  }})}
      else navigate("/employerpage/Applicantsdetails/more/Hire", { state: {userid: userid ,applicaionid:id,check:"not"  }})
      }

      const isEmpty = (arr,type) => {
        const isEmptyArray = arr.length === 0;
        if (!isEmptyArray && type === "hired") {
          sethiredLen(arr.length);
        } else if (!isEmptyArray && type === "data") {
          setDataLen(arr.length);
        }
        return isEmptyArray;
      };
    
      useEffect(() => {
        const emptyCheck = isEmpty(readData,"data");
        if(readhired){
        const emptyCheck2 = isEmpty(readhired,"hired");
        sethiredIsEmpty(emptyCheck2);
        }
        setArrayIsEmpty(emptyCheck);
      }, [readData,readhired]);

    

    return(
        <>
    
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
         </>
         )}




{hiredIsEmpty  ? (
        <div className="taskblock">You have not hired any appicant</div>
      ) : (
        <>
        <div className="taskblock">You have  hired {hiredLen} appicant for this job</div>
        <div className="container">
        {readhired.map((data,index) => (
         <div onClick={() => handleclick(data._id,data.Freelancerid,data.status)}  className="freelist" >
          {readhiredapplicant[index] && (
      <>
        <h3 className="textf">Applicant name</h3>
        <p className="titlef">{readhiredapplicant[index]}</p>
      </>
    )}
             <h3 className="textf">Job type </h3>
          <p className="titlef">{data.Jobtype}</p>
          <h3 className="textf">Cover Letter </h3>
          <p className="titlef">{data.Coverletter}</p>
           </div>
         ))}
          </div>
         </>
         )}
         
        </>
     )
    }

