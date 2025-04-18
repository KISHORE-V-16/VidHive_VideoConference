import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Header from '../Components/Header';
import { ToastContainer, toast } from 'react-toastify';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { firestore1 } from '../Utils/firebase';
import { useNavigate } from 'react-router-dom';
import TextScramble from '../Components/TextScrammble';

const Createmeeting = () => {
  const [createmeet, setcreatemeet] = useState(true);
  const [callId, setCallId] = useState('');
  const [meetname, setmeetname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toaststyles = {
    position: "bottom-right",
    autoClose: 1300,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  };

  const userscollections = collection(firestore1, 'userscollections');
  const [userdata, setuserdata] = useState([]);

  // Animation effect for form on load
  useEffect(() => {
    // Add appearance animation to form
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
      setTimeout(() => {
        formContainer.classList.add('appear');
      }, 300);
    }

    // Ensure background animations are visible immediately
    const bgElements = document.querySelector('.background-elements');
    if (bgElements) {
      bgElements.classList.add('animate');
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
    };
  }, []);
  
  const createOffer = async () => {
    setIsLoading(true);
    const callDocRef = doc(collection(firestore1, "calls"));
    const refdoc = collection(firestore1, 'docref');

    addDoc(refdoc, {
      "docu1": [callDocRef],
      "meetId": callDocRef.id,
      "meetname": meetname,
    });
      
    const getdata = collection(firestore1, 'Meetings');
    const username = localStorage.getItem('username');
    const userinfo = userdata.filter((val) => (val.name1 === username))[0];
      
    addDoc(getdata, {
      "createduser": userinfo.name1,
      "CreatedBY": userinfo.uid,
      "meetID": callDocRef.id,
      "meetingName": meetname
    })
      .then(res => {
        setCallId(callDocRef.id);
        toast.dark('Successfully Created The Meeting', toaststyles);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch(error => {
        toast.warn('Retry Again Or else Network Problem', toaststyles);
        navigate('/common/create');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const submitformdata = () => {
    if (!meetname || meetname.length < 10) {
      if (!meetname) {
        toast.warn("Enter the proper meet Name", toaststyles);
      }
      if (meetname && meetname.length < 10) {
        toast.warn("Enter a minimum length of meet name", toaststyles);
      }
    } else {
      createOffer();
    }
  };

  return (
    <CreateMeetingContainer>
      {/* Enhanced Background Elements */}
      <BackgroundElements className="background-elements">
        <GradientOrb className="orb1" />
        <GradientOrb className="orb2" />
        <GradientOrb className="orb3" />
        <VideoElements />
        <PulseWave />
      </BackgroundElements>
      
      <Header createmeet={createmeet} />
      <ToastContainer />
      
      <div className="content-wrapper">
        <div className="welcome-section">
          <h1>Create <span>Meeting</span></h1>
        </div>

        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <div className="form-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M10 13l-2 2 2 2M14 13l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Meeting Details</h2>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label htmlFor="meetname">Meeting Name</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="meetname"
                    value={meetname}
                    onChange={(e) => setmeetname(e.target.value)} 
                    placeholder="Enter a descriptive name (min. 10 characters)"
                  />
                  <div className="focus-border"></div>
                </div>
                <p className="hint">Create a descriptive name for your meeting</p>
              </div>
              
              <div className="form-footer">
                <button 
                  className={`submit-button ${isLoading ? 'loading' : ''}`} 
                  onClick={submitformdata}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loader"></div>
                  ) : (
                    <>
                      <span>Create Meeting</span>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.4 5.6c0-.56.448-1 1-1h4c.513 0 .936.386.993.883L20.4 5.6v4c0 .552-.448 1-1 1s-1-.448-1-1V7.414l-6.293 6.293c-.39.39-1.024.39-1.414 0-.39-.39-.39-1.024 0-1.414L17.586 6h-2.187c-.55 0-.998-.448-.998-.4z" fill="currentColor"/>
                        <path d="M11.6 18.4c0 .56-.448 1-1 1h-4c-.513 0-.936-.386-.993-.883L5.6 18.4v-4c0-.552.448-1 1-1s1 .448 1 1v2.187l6.293-6.293c.39-.39 1.024-.39 1.414 0 .39.39.39 1.024 0 1.414L8.414 18h2.187c.55 0 .998.448.998 1z" fill="currentColor"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CreateMeetingContainer>
  );
};

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.6; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 0.2; }
  50% { transform: translateY(-20px) translateX(20px); opacity: 0.8; }
  100% { transform: translateY(-40px) translateX(40px); opacity: 0.2; }
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

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(10, 101, 237, 0.5); }
  50% { box-shadow: 0 0 20px rgba(10, 101, 237, 0.8); }
  100% { box-shadow: 0 0 5px rgba(10, 101, 237, 0.5); }
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Background elements styling with improved visibility
const BackgroundElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  
  &.animate {
    opacity: 1;
  }
`;


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
  
  &:before, &:after {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.1),
      0 0 0 3px rgba(10, 101, 237, 0.1),
      0 0 30px rgba(10, 101, 237, 0.3);
  }
`;

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

const CreateMeetingContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  position: fixed; /* Changed from relative to fixed */
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
  
  /* Hide scrollbars but keep functionality */
  &::-webkit-scrollbar {
    display: none;
  }

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

  .content-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0; /* Removed padding */
    margin: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%; /* Added height 100% */
    z-index: 10;
    position: relative;
    overflow-y: auto; /* Allow vertical scrolling if needed */
  }
  
  .welcome-section {
    text-align: center;
    margin: 0 0 2rem 0; /* Adjusted margin */
    width: 100%;
    position: relative;
    z-index: 11;
    
    h1 {
      color: #ffffff;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
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
      margin-bottom: 1.5rem;
    }
  }
  
  .form-container {
    width: 100%;
    max-width: 500px;
    padding: 0 20px; /* Added horizontal padding */
    box-sizing: border-box;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    perspective: 1000px;
    
    &.appear {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .form-card {
    background: rgba(21, 24, 33, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(3, 115, 252, 0.2);
    transition: all 0.3s ease;
    position: relative; /* Added position relative */
    
    &:hover {
      box-shadow: 0 15px 35px rgba(3, 115, 252, 0.4);
      border-color: rgba(10, 101, 237, 0.5);
    }
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #0a65ed, #4c00ff);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover:before {
      opacity: 1;
    }
  }
  
  .form-header {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .form-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0a65ed, #4c00ff);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      animation: ${glowAnimation} 2s infinite ease-in-out;
      
      svg {
        width: 24px;
        height: 24px;
        stroke: white;
      }
    }
    
    h2 {
      margin: 0;
      color: #ffffff;
      font-size: 1.5rem;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
  }
  
  .form-body {
    padding: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      color: #a0a0b8;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
    
    .input-wrapper {
      position: relative;
      
      input {
        width: 90%;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #ffffff;
        font-size: 1rem;
        transition: all 0.3s ease;
        outline: none;
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      }
      
      .focus-border {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #0a65ed, #4c00ff);
        transition: all 0.3s ease;
      }
      
      input:focus + .focus-border {
        width: 98%;
        left: 0;
      }
    }
    
    .hint {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 0.5rem;
    }
  }
  
  .form-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
  }
  
  .submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding:24px;
    width:190px;
    height: 30px;
    background: linear-gradient(135deg, #0a65ed, #4c00ff);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(10, 101, 237, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    svg {
      width: 18px;
      height: 18px;
      transition: all 0.3s ease;
    }
    
    &:hover svg {
      transform: scale(1.1);
    }
    
    &.loading {
      background: linear-gradient(135deg, #0a65ed50, #4c00ff50);
      pointer-events: none;
      
      span, svg {
        opacity: 0;
      }
    }
    
    .loader {
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: ${spinAnimation} 1s linear infinite;
    }
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .welcome-section {
      padding-top: 60px; /* Adjusted for mobile header */
      
      h1 {
        font-size: 2rem;
      }
    }
    
    .form-container {
      max-width: 100%;
      padding: 0 15px;
    }
  }
  
  @media (max-width: 480px) {
    .welcome-section {
      h1 {
        font-size: 1.8rem;
      }

      .tagline {
        font-size: 0.9rem;
      }
    }
    
    .form-header {
      padding: 1rem;
      
      .form-icon {
        width: 32px;
        height: 32px;
        
        svg {
          width: 18px;
          height: 18px;
        }
      }
      
      h2 {
        font-size: 1.2rem;
      }
    }
    
    .form-body {
      padding: 1rem;
    }
    
    .submit-button {
      width: 100%;
      padding: 10px 16px;
      font-size: 0.9rem;
    }
  }
`;

export default Createmeeting;