import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import meet1 from '../asserts/meet1.png';
import meet2 from '../asserts/meet2.png';
import meet3 from '../asserts/meet3.png';
import Header from '../Components/Header';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import TextScramble from '../Components/TextScrammble';

const Dashboard = () => {



  // Animation effect for cards on load
  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('appear');
      }, 300 * index);
    });

    // Ensure background animations are visible immediately
    const bgElements = document.querySelector('.background-elements');
    if (bgElements) {
      bgElements.classList.add('animate');
    }
  }, []);

  return (
    <DashboardContainer>
      {/* Enhanced Background Elements - Now with improved visibility */}
      <BackgroundElements className="background-elements">
     
        
        {/* Dynamic gradient orbs */}
     
        <GradientOrb className="orb2" />
        <GradientOrb className="orb3" />
        
        {/* Video-conference related elements */}
        <VideoElements />
        
        {/* Dynamic floating particles */}
        <FloatingParticles />
        
        {/* Subtle pulse wave */}
        <PulseWave />
      </BackgroundElements>
      
      <Header />
      <ToastContainer />
      <div className="content-wrapper">
        <div className="welcome-section">
          <h1>Welcome to <span>VidHive</span></h1>
          <p className="tagline">
            <TextScramble />
          </p>
        </div>

        <div className="cards-container">

          <div className="card">
            <div className="card-image">
              <img src={meet1} alt="Create Meeting" />
              <div className="gradient-circle"></div>
            </div>
            <div className="card-content">
              <Link to={'/common/create'}>Create Meeting</Link>
              <p>Create a new meeting and invite people.</p>
              <div className="card-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-image">
              <img src={meet3} alt="Join Meeting" />
              <div className="gradient-circle"></div>
            </div>
            <div className="card-content">
              <Link to={'/common/Joinmeet'}>Join Meeting</Link>
              <p>Join the meeting.</p>
              <div className="card-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-image">
              <img src={meet2} alt="My Meetings" />
              <div className="gradient-circle"></div>
            </div>
            <div className="card-content">
              <Link to={"/common/mymeetings"}>My Meetings</Link>
              <p>View your created meetings.</p>
              <div className="card-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>
        
        <FooterInfo>
          <p>VidHive provides seamless, high-quality video conferencing experience</p>
          <div className="stats">
            <div className="stat">
              <span className="number">HD</span>
              <span className="label">Quality</span>
            </div>
            <div className="stat">
              <span className="number">100+</span>
              <span className="label">Participants</span>
            </div>
            <div className="stat">
              <span className="number">Secure</span>
              <span className="label">Encryption</span>
            </div>
          </div>
        </FooterInfo>
      </div>
    </DashboardContainer>
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
  50% { opacity: 0.8; }
  100% { transform: translateY(-100px) translateX(100px); opacity: 0.2; }
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

const glitchAnimation = keyframes`
  0% { opacity: 0.5; }
  2% { opacity: 0.7; }
  3% { opacity: 0.5; }
  9% { opacity: 0.3; }
  11% { opacity: 0.5; }
  14% { opacity: 0.3; }
  20% { opacity: 0.5; }
  21% { opacity: 0.3; }
  38% { opacity: 0.3; }
  39% { opacity: 0.5; }
  42% { opacity: 0.3; }
  60% { opacity: 0.5; }
  62% { opacity: 0.3; }
  100% { opacity: 0.5; }
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
  pointer-events: none; /* This ensures clicks pass through to elements below */
  
  &.animate {
    opacity: 1;
  }
`;

// Enhanced floating particles component with improved visibility
const FloatingParticles = () => {
  return (
    <ParticlesContainer>
      {[...Array(40)].map((_, i) => {
        const size = Math.random() * 5 + 2;
        const delay = i * 0.5;
        const duration = Math.random() * 10 + 10;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        
        return (
          <Particle 
            key={i} 
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${initialY}%`,
              left: `${initialX}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`
            }} 
          />
        );
      })}
    </ParticlesContainer>
  );
};

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`;

const Particle = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: ${floatAnimation} 15s infinite ease-in-out;
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

const FooterInfo = styled.div`
  margin-top: 3rem;
  text-align: center;
  color: #a0a0b8;
  font-size: 0.9rem;
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  background: rgba(30, 30, 60, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .stats {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
    
    .stat {
      display: flex;
      flex-direction: column;
      
      .number {
        font-size: 1.2rem;
        font-weight: bold;
        color: #0a65ed;
      }
      
      .label {
        font-size: 0.8rem;
        color: #8888aa;
      }
    }
  }
`;

const DashboardContainer = styled.div`
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

  .content-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0;
    margin: 0;
    align-items: center;
    justify-content: center;
    width: 100vw;
    max-width: 100%;
    z-index: 10; /* Increased z-index to ensure content is above background */
    position: relative; /* Added to ensure proper stacking */
  }
  
  .welcome-section {
    margin-top: -1rem;
    text-align: center;
    margin-bottom: 2rem;
    width: 100%;
    padding: 1rem 0;
    position: relative;
    z-index: 11; /* Ensure this is above background elements */
    
    h1 {
      color: #ffffff;
      font-size: 3rem;
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
  
  .cards-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    padding: 0 1rem;
    margin: 0 auto;
    box-sizing: border-box;
    perspective: 1000px;
    z-index: 11; /* Ensure this is above background elements */
    position: relative;
  }
  
  .card {
    background: rgba(21, 24, 33, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    width: 280px;
    box-shadow: 0 10px 30px rgba(3, 115, 252, 0.2);
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    transform: translateY(50px);
    opacity: 0;
    position: relative;
    
    &.appear {
      transform: translateY(0);
      opacity: 1;
    }
    
    &:hover {
      transform: translateY(-10px) scale(1.05);
      box-shadow: 0 15px 35px rgba(3, 115, 252, 0.4);
      border-color: #0373fc;
      z-index: 12;
      
      &:before {
        opacity: 1;
      }
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
    
    .card-image {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 140px;
      padding: 1.5rem 0;
      position: relative;
      overflow: hidden;
      
      img {
        width: 100px;
        height: 100px;
        transition: transform 0.5s ease;
        position: relative;
        z-index: 2;
      }
      
      .gradient-circle {
        position: absolute;
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, rgba(10, 101, 237, 0.2) 0%, rgba(76, 0, 255, 0.05) 70%);
        border-radius: 50%;
        filter: blur(15px);
        z-index: 1;
        transition: all 0.5s ease;
      }
    }
    
    &:hover .card-image {
      img {
        transform: scale(1.15) rotate(5deg);
      }
      
      .gradient-circle {
        transform: scale(1.2);
        opacity: 0.8;
      }
    }
    
    .card-content {
      padding: 1.2rem 1.5rem 1.5rem;
      text-align: center;
      position: relative;
      
      a {
        display: block;
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
        background: linear-gradient(to right, #0a65ed, #ffffff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        text-decoration: none;
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
          text-decoration: none;
        }
      }
      
      p {
        color: #cccccc;
        font-size: 0.9rem;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        margin: 0 0 1rem;
      }
      
      .card-dots {
        display: flex;
        justify-content: center;
        gap: 5px;
        
        span {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0373fc;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
      }
      
      &:after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 20%;
        width: 60%;
        height: 10px;
        background: linear-gradient(90deg, transparent, rgba(3, 115, 252, 0.2), transparent);
        border-radius: 50%;
        filter: blur(5px);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }
    
    &:hover .card-content {
      .card-dots span {
        opacity: 1;
        transform: scale(1.2);
        
        &:nth-child(1) {
          transform: scale(1.1);
          transition-delay: 0.1s;
        }
        
        &:nth-child(2) {
          transform: scale(1.2);
          transition-delay: 0.2s;
        }
        
        &:nth-child(3) {
          transform: scale(1.3);
          transition-delay: 0.3s;
        }
      }
      
      &:after {
        opacity: 1;
      }
    }
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .welcome-section {
      h1 {
        font-size: 2.2rem;
      }
      
      .tagline {
        font-size: 0.9rem;
      }
    }
    
    .cards-container {
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 0 0.5rem;
    }
    
    .card {
      width: 100%;
      max-width: 300px;
    }
    
    ${FooterInfo} {
      padding: 0.8rem;
      
      .stats {
        flex-direction: column;
        gap: 1rem;
        
        .stat {
          margin-bottom: 0.5rem;
        }
      }
    }
  }
  
  @media (max-width: 480px) {
    .welcome-section {
      h1 {
        font-size: 1.8rem;
      }
      
      .tagline {
        font-size: 0.8rem;
      }
    }
    
    ${GradientOrb} {
      opacity: 0.4;
    }
  }
`;

export default Dashboard;