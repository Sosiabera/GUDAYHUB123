import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SkillTest = () => {
  const { id } = useParams(); // Extract id parameter from URL
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/skillTests/getskilltests/${id}`);
        console.log('Response from API:', res.data);
        if (res.data) {
          setTest(res.data);
          setAnswers(new Array(res.data.questions.length).fill(null));
        } else {
          setError('Test data not found');
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
        setError('Error fetching test data');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]); // Fetch data whenever id changes

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://localhost:4000/skillTests/getskilltests/${id}/submit`, { answers });
      setScore(res.data.score);
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('Error submitting answers');
    }
  };

  if (loading) return <p>Loading test...</p>;
  if (error) return <p>{error}</p>;

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
