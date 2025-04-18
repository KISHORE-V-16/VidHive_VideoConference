import React, { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  max-width: 400px;
  margin: auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.7rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const MeetingForm = ({ onStartMeeting }) => {
  const [meetName, setMeetName] = useState("");
  const [inviteUser, setInviteUser] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartMeeting({ meetName, inviteUser, date, time });
  };

  return (
    <FormContainer>
      <h2>Start a Meeting</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Meeting Name"
          value={meetName}
          onChange={(e) => setMeetName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Invite User"
          value={inviteUser}
          onChange={(e) => setInviteUser(e.target.value)}
          required
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <Button type="submit">Start Meeting</Button>
      </form>
    </FormContainer>
  );
};

export default MeetingForm;
