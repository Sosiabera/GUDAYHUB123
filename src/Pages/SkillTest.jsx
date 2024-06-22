import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SkillTest = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`/api/skillTests/${id}`);
        setTest(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };
    fetchTest();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`/api/skillTests/${id}/submit`, { answers });
      setScore(res.data.score);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  return (
    <div>
      {test && (
        <div>
          <h1>{test.skill} Test</h1>
          {test.questions.map((q, index) => (
            <div key={index}>
              <p>{q.question}</p>
              {q.options.map((option, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={i}
                    checked={answers[index] === i}
                    onChange={() => {
                      const newAnswers = [...answers];
                      newAnswers[index] = i;
                      setAnswers(newAnswers);
                    }}
                  />
                  {option}
                </div>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
      {score !== null && <h2>Your Score: {score}/{test.questions.length}</h2>}
    </div>
  );
};

export default SkillTest;
