import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../Hooks/UseAuth';
import './complaint.css';

export default function Complaint() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();

  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    setCurrentDateTime(formattedDate);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      const formObject = Object.fromEntries(formData.entries());
      formObject.Userid = userData.userID;
      formObject.Date = currentDateTime;

      const response = await axios.post(
        'http://localhost:4000/complaint/writecomplaint',
        formObject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fs-frm-inputs">
        <label htmlFor="full-name">Full Name</label>
        <input
          type="text"
          name="Fullname"
          className="full-name"
          placeholder="First and Last"
          required
        />

        <label htmlFor="email-address">Email Address</label>
        <input
          type="email"
          name="email"
          className="email-address"
          placeholder="email@domain.tld"
          required
        />

        <label htmlFor="telephone">Telephone Number (Optional)</label>
        <input
          type="tel"
          name="number"
          className="telephone optional"
          placeholder="09********"
        />

        <label htmlFor="complaint">Complaint</label>
        <textarea
          rows="6"
          name="complaint"
          className="complaints"
          placeholder="Enter your complaint"
          required
        ></textarea>

        <input
          type="hidden"
          name="_subject"
          className="email-subject hidden"
          value="Complaint Form Submission"
        />
      </fieldset>
      <input type="submit" value="File Complaint" />
    </form>
  );
}

