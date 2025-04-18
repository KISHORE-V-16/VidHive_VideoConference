import React, { useState, useEffect } from 'react';
import styled, { keyframes }  from 'styled-components';
import Header from '../Components/Header';
import { collection, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { firestore1 } from '../Utils/firebase';
import { toast, ToastContainer } from 'react-toastify';
import { FaCopy, FaEdit,FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Mymeetings = ({ setupSources }) => {
  const [dsgedit, setdsgedit] = useState(false);
  const [meetdata, setmeetdata] = useState([]);
  const [docdata, setdocdata] = useState([]);
  const [userdata, setuserdata] = useState([]);
  const [newindex, setnewindex] = useState('');
  const [mymeeting, setmymeeting] = useState(true);

  const combinedClassNames = classnames('edit-content-dsg', {
    'adder': dsgedit
  });

    const toaststyles = {
    position: "bottom-right",
    autoClose: 1300,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  };

  const meetcollections = collection(firestore1, 'Meetings');
  const userscollections = collection(firestore1, 'userscollections');
  const documnet1 = collection(firestore1, 'docref');

  // Animation effect for background elements - Added from Dashboard component
  useEffect(() => {
    // Ensure background animations are visible immediately
    const bgElements = document.querySelector('.background-elements');
    if (bgElements) {
      bgElements.classList.add('animate');
    }
  }, []);

  useEffect(() => {
    const meetcollection__data = onSnapshot(meetcollections, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        "createduser": doc.data().createduser,
        "Createdby": doc.data().CreatedBY,
        "meetid": doc.data().meetID,
        "invitedusers": doc.data().invitedUsers,
        "maxusers": doc.data().maxUsers,
        "meetingdate": doc.data().meetingDate,
        "meetingname": doc.data().meetingName,
        "meetingtype": doc.data().meetingType,
        "status": doc.data().status,
        "id": doc.id,
      }));
      setmeetdata(data);
    });

    return () => {
      meetcollection__data();
    }
  }, []);

  useEffect(() => {
    const usercollection__data = onSnapshot(userscollections, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        emailid: doc.data().emailid,
        name1: doc.data().name,
        uid: doc.data().uid,
      }));
      setuserdata(data);
    });

    return () => {
      usercollection__data();
    }
  }, []);

  useEffect(() => {
    const docref_data = onSnapshot(documnet1, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        documentref: doc.data().docu1,
        name1: doc.data().meetname,
        meetid: doc.data().meetId,
      }));
      setdocdata(data);
    });

    return () => {
      docref_data();
    }
  }, []);

  const handleDeleteClick = (data) => {

    const docRef = doc(firestore1, 'Meetings', data.id);

    deleteDoc(docRef)
      .then(() => {
        toast.success("Meeting cancelled successfully", toaststyles);
      },toaststyles)
      .catch((error) => {
        console.error("Error While Deleting the document: ");
      });
  };

  const handleCloseEdit = () => {
    setdsgedit(false);
  };

  return (
    <MymeetingsContainer>
      <HeaderWrapper>
        <Header mymeeting={mymeeting} />
      </HeaderWrapper>
      
      <ContentWrapper>
        <div className="welcome-section">
          <h1>My <span>Meeting</span></h1>
        </div> 

        <ToastContainer />
        
        <BackgroundElements className="background-elements">
          <GradientOrb className="orb2" />
          <GradientOrb className="orb3" />
          <VideoElements />
          <PulseWave />
          <ScanLine />
        </BackgroundElements>

        <MeetingsWrapper className={meetdata.length === 0 ? "empty-meetings" : ""}>
          <div className="meetings-content">
            <div className="meetings-header">
              <div className="header-item">Meeting Name</div>
              <div className="header-item">Meeting ID</div>
              <div className="header-item">Delete</div>
              <div className="header-item">Status</div>
              <div className="header-item">Copy Link</div>
            </div>

            <div className="meetings-list">
              {meetdata.length > 0 ? (
                meetdata.map((data, index) => (
                  <div className="meeting-item" key={index}>
                    <div className="meeting-name">{data.meetingname}</div>
                    <div className="meeting-id">{data.meetid}</div>
                    <div className="meeting-action">
                      <button
                        className="edit-button"
                        disabled={data.status === "cancelled"}
                        style={{
                          color: data.status === "cancelled" ? "#888" : "#fff",
                          opacity: data.status === "cancelled" ? 0.6 : 1
                        }}
                        onClick={() => handleDeleteClick(data)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="meeting-status">
                      <button
                        className="join-button"
                        onClick={() => setupSources("create", data.meetid)}
                      >
                        Join
                      </button>
                    </div>
                    <CopyToClipboard text={data.meetid}>
                      <button className="copy-button">
                        <FaCopy />
                      </button>
                    </CopyToClipboard>
                  </div>
                ))
              ) : (
                <div className="no-meetings">
                  <p>No meetings found. Create a new meeting to get started.</p>
                </div>
              )}
            </div>
          </div>
        </MeetingsWrapper>
      </ContentWrapper>

      <div className={combinedClassNames}>
        <div className="head">
          <h2>Edit Meeting</h2>
          <div className="close-dsg">
            <button className="btn-close" onClick={handleCloseEdit}>
              <AiOutlineCloseCircle />
            </button>
          </div>
        </div>
        <div className="edit-form">
          {/* Your edit form content here */}
          <p>Edit meeting options will appear here</p>
        </div>
      </div>
    </MymeetingsContainer>
  );
};

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.6; }
`;

const orbMove1Animation = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(100px, 100px); }
  100% { transform: translate(0, 0); }
`;

const orbMove2Animation = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(-100px, -100px); }
  100% { transform: translate(0, 0); }
`;

const orbMove3Animation = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(80px, -80px); }
  100% { transform: translate(0, 0); }
`;

const scanLineAnimation = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

// New wrapper for all content to maintain proper spacing
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  position: relative;
  padding: 1rem 0;
  z-index: 10;
`;

// New wrapper for meetings container with dynamic spacing
const MeetingsWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 1rem;
  margin-top: 2rem;
  overflow-y: auto;
  
  &.empty-meetings {
    margin-top: 1rem;
  }
`;

// Background elements styling with improved visibility
const BackgroundElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0; /* Changed from -1 to 0 to improve visibility */
  opacity: 0;
  transition: opacity 0.5s ease;
  
  &.animate {
    opacity: 1;
  }
`;

const HeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: 100; /* Ensure Header appears above background elements */
  pointer-events: auto; /* Explicitly enable pointer events */
  cursor: default; /* Set a default cursor */
  
  /* Make sure all elements within the header are interactive */
  * {
    pointer-events: auto;
  }
  
  /* Ensure clickable elements show proper cursor */
  a, button, [role="button"] {
    cursor: pointer;
  }
`;

// ScanLine component added from the Dashboard
const ScanLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(32, 100, 226, 0.2) 30%, 
    rgba(76, 0, 255, 0.2) 70%, 
    transparent 100%);
  box-shadow: 0 0 10px rgba(10, 101, 237, 0.3);
  z-index: 5;
  animation: ${scanLineAnimation} 8s linear infinite;
  opacity: 0.5;
`;

// Enhanced gradient orbs with improved opacity
const GradientOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 2;
  opacity: 0.7;
  
  &.orb1 {
    top: -150px;
    left: -150px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(32, 100, 226, 0.7) 0%, rgba(9, 9, 121, 0.3) 70%);
    animation: ${orbMove1Animation} 20s ease-in-out infinite;
  }
  
  &.orb2 {
    bottom: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(76, 0, 255, 0.7) 0%, rgba(25, 0, 94, 0.3) 70%);
    animation: ${orbMove2Animation} 25s ease-in-out infinite;
  }
  
  &.orb3 {
    top: 40%;
    left: 30%;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.7) 0%, rgba(9, 9, 121, 0.2) 70%);
    animation: ${orbMove3Animation} 18s ease-in-out infinite;
  }
`;

// Video conference related visual elements with improved visibility
const VideoElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  opacity: 0.8;
  
  &:before {
    content: '';
    position: absolute;
    top: 10%;
    left: 5%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(76, 0, 255, 0.3);
    box-shadow: 0 0 20px rgba(76, 0, 255, 0.5);
    animation: ${pulseAnimation} 4s infinite;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 15%;
    right: 10%;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: rgba(0, 212, 255, 0.3);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
    animation: ${pulseAnimation} 3s infinite;
    animation-delay: 1s;
  }
  
  /* Video-frame outlines with improved visibility */
  &:before, &:after {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.1),
      0 0 0 3px rgba(10, 101, 237, 0.1),
      0 0 30px rgba(10, 101, 237, 0.3);
  }
`;

// Pulse wave effect with improved visibility
const PulseWave = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: transparent;
  z-index: 2;
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 2px solid rgba(10, 101, 237, 0.2);
    animation: ${pulseAnimation} 6s infinite;
  }
  
  &:after {
    animation-delay: 2s;
  }
`;

const MymeetingsContainer = styled.div`
   display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #030b1a 0%, #0a101f 100%);
  box-sizing: border-box;
  overflow-x: hidden;
  scrollbar-width: none;

  /* Add a subtle scan line effect with improved visibility */
  &:after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(32, 100, 226, 0.2) 30%, 
      rgba(76, 0, 255, 0.2) 70%, 
      transparent 100%);
    box-shadow: 0 0 10px rgba(10, 101, 237, 0.3);
    z-index: 5;
    animation: ${scanLineAnimation} 8s linear infinite;
    opacity: 0.5;
  }

  .welcome-section {
    text-align: center;
    width: 100%;
    padding: 1rem 0;
    margin-bottom: 0.5rem;
    position: relative;
    z-index: 11;
    
    h1 {
      color: #ffffff;
      font-size: 2.5rem;
      margin: 0;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      text-shadow: 0 0 20px rgba(10, 101, 237, 0.5);
      
      span {
        background: linear-gradient(to right, #0a65ed, #4c00ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        position: relative;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, rgba(10, 101, 237, 0.3), rgba(76, 0, 255, 0.3));
        }
      }
    }

    .tagline {
      font-size: 1rem;
      color: #a0a0b8;
    }
  }

  .meetings-content {
    width: 100%;
    max-width: 1200px;
    background-color: rgba(21, 24, 33, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(3, 115, 252, 0.2);
    transform: translateY(0);
    opacity: 1;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 200px);
  }

  .meetings-header {
    display: grid;
    grid-template-columns: 2fr 1.5fr 0.5fr 0.8fr 0.5fr;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(26, 26, 26, 0.5);
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    
    @media (max-width: 768px) {
      grid-template-columns: 2fr 1fr 0.5fr 0.8fr 0.5fr;
      font-size: 12px;
    }
    
    @media (max-width: 480px) {
      display: none;
    }
  }

  .header-item {
    padding: 0 8px;
  }

  .meetings-list {
    padding: 10px;
    overflow-y: auto;
    max-height: calc(100vh - 250px);
    scrollbar-width: none; /* Firefox */
    
    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }
  }

  .meeting-item {
    display: grid;
    grid-template-columns: 2fr 1.5fr 0.5fr 0.8fr 0.5fr;
    align-items: center;
    padding: 12px 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background: rgba(21, 24, 33, 0.4);
    margin-bottom: 8px;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(3, 115, 252, 0.2);
      border-color: #0373fc;
      z-index: 12;
      background: rgba(26, 29, 33, 0.6);
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 2fr 1fr 0.5fr 0.8fr 0.5fr;
    }
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
      gap: 8px;
      padding: 16px;
    }
  }

  .meeting-name {
    font-weight: 500;
    color: #fff;
    padding: 0 8px;
    
    @media (max-width: 480px) {
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 4px;
    }
  }

  .meeting-id {
    font-family: monospace;
    color: #ccc;
    font-size: 12px;
    
    @media (max-width: 480px) {
      margin-bottom: 8px;
      &:before {
        content: "ID:";
        opacity: 0.7;
      }
    }
  }

   .join-button, .edit-button, .copy-button {
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 8px;
    
    &:hover:not(:disabled) {
      background-color: rgba(10, 101, 237, 0.2);
      transform: translateY(-1px);
      border-color: #0a65ed;
    }
   
  }

  .join-button {
    background: linear-gradient(90deg, #0a65ed, #4c00ff);
    color: #fff;
    border: none;
    padding: 8px 16px;
    font-weight: 500;
    
    &:hover {
      background: linear-gradient(90deg, #0a65ed, #4c00ff);
      opacity: 0.9;
    }
  }

  .edit-button, .copy-button {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    
    svg {
      color: #fff;
    }
  }

  .copy-button {
    max-width: max-content;
    margin-left: 28px;
  }

  .no-meetings {
    text-align: center;
    padding: 32px 16px;
    color: #a0a0b8;
  }

  @media (max-width: 480px) {
    .meeting-action, .meeting-status, .copy-button {
      display: inline-flex;
      margin-right: 12px;
    }
  }

  /* Edit sidebar */
  .edit-content-dsg {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    max-width: 400px;
    height: 100vh;
    background-color: rgba(26, 26, 26, 0.9);
    backdrop-filter: blur(10px);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    transition: transform 0.3s ease;
    overflow-y: auto;
    
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      h2 {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(to right, #0a65ed, #ffffff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .btn-close {
        background-color: transparent;
        border: none;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border-radius: 50%;
        transition: background-color 0.2s ease;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
    
    .edit-form {
      padding: 16px;
      color: #a0a0b8;
    }
  }

  .adder {
    transform: translateX(-100%);
  }

  @media (max-width: 768px) {
    .edit-content-dsg {
      max-width: 100%;
    }
  }
`;

export default Mymeetings;