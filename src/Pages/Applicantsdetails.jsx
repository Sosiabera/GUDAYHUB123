import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Applicantsdetails() {
    const [readData, setReadData] = useState([]);
    const [readHired, setReadHired] = useState([]);
    const [readApplicant, setReadApplicant] = useState([]);
    const [readHiredApplicant, setHiredApplicant] = useState([]);
    const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
    const [hiredIsEmpty, setHiredIsEmpty] = useState(false);
    const [dataLen, setDataLen] = useState(0);
    const [hiredLen, setHiredLen] = useState(0);

    const location = useLocation();
    const { t } = useTranslation();
    const { postid } = location.state || {};

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

                const hiredResponse = await axios.get(
                    "http://localhost:4000/hired/readhired",
                    { params: { postid } }
                );
                const hiredIds = hiredResponse.data.map(Hired => Hired.Freelancerid);

                const hireResponses = await Promise.all(
                    hiredIds.map(id =>
                        axios.get(`http://localhost:4000/freelancer/apply/${id}`)
                    )
                );

                const hiredNames = hireResponses.map(response => response.data.Fullname);

                setReadData(applicantResponse.data);
                setReadApplicant(applicantNames);
                setReadHired(hiredResponse.data);
                setHiredApplicant(hiredNames);

                setArrayIsEmpty(applicantResponse.data.length === 0);
                setHiredIsEmpty(hiredResponse.data.length === 0);
                setDataLen(applicantResponse.data.length);
                setHiredLen(hiredResponse.data.length);
            } catch (error) {
                console.error("error", error);
            }
        };

        fetchData();
    }, [postid]);

    const changeStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:4000/applicant/changestatus`, null, {
                params: { status: status, applicantid: id }
            });
        } catch (error) {
            console.error("error", error);
        }
    };

    const navigate = useNavigate();
    const handleClick = (id, userid, status) => {
        if (status === "waiting") {
            changeStatus(id, "application opened")
            navigate("/employerpage/Applicantsdetails/more/Hire", { state: { userid, applicaionid: id, postid: "not" } });
        } else if (status === "hired" || status === "got the job" || status === "hire") {
            navigate("/employerpage/Applicantsdetails/more/Hire", { state: { userid, applicaionid: id, check: "hired" } });
        } else {
            navigate("/employerpage/Applicantsdetails/more/Hire", { state: { userid, applicaionid: id, check: "not" } });
        }
    }

    return (
        <>
            {arrayIsEmpty ? (
                <div className="taskblock">{t('There is no applicant yet')}</div>
            ) : (
                <div>
                    <div className="taskblock">{t('You have')} {dataLen} {t('Applicants')}</div>
                    {readData.map((data, index) => (
                        <div onClick={() => handleClick(data._id, data.Freelancerid, data.status)} className="freelist" key={data._id}>
                            {readApplicant[index] && (
                                <>
                                    <h3 className="textf">{t('Applicant name')}</h3>
                                    <p className="titlef">{readApplicant[index]}</p>
                                </>
                            )}
                            <h3 className="textf">{t('Job type')}</h3>
                            <p className="titlef">{data.Jobtype}</p>
                            <h3 className="textf">{t('Cover Letter')}</h3>
                            <p className="titlef">{data.Coverletter}</p>
                        </div>
                    ))}
                </div>
            )}

            {hiredIsEmpty ? (
                <div className="taskblock">You have not hired any applicant</div>
            ) : (
                <>
                    <div className="taskblock">You have hired {hiredLen} applicants for this job</div>
                    <div className="container">
                        {readHired.map((data, index) => (
                            <div onClick={() => handleClick(data._id, data.Freelancerid, data.status)} className="freelist" key={data._id}>
                                {readHiredApplicant[index] && (
                                    <>
                                        <h3 className="textf">Applicant name</h3>
                                        <p className="titlef">{readHiredApplicant[index]}</p>
                                    </>
                                )}
                                <h3 className="textf">Job type</h3>
                                <p className="titlef">{data.Jobtype}</p>
                                <h3 className="textf">Cover Letter</h3>
                                <p className="titlef">{data.Coverletter}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
