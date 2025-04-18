import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiUser } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const JoinMeeting = ({ setupSources }) => {
    const videoRef = useRef(null);
    const [callId, setCallId] = useState('');
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // Effect hook to handle the video stream
    useEffect(() => {
        if (videoRef.current && isVideoOn) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play().catch((err) => console.error("Error playing video:", err));
                    }
                })
                .catch((err) => console.error("Error accessing media devices:", err));
        }
    }, [isVideoOn]);

    const handleMute = () => {
        const stream = videoRef.current?.srcObject;
        if (stream instanceof MediaStream) {
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length > 0) {
                const isNowMuted = !isMuted;
                audioTracks.forEach((track) => (track.enabled = !isNowMuted));
                setIsMuted(isNowMuted);
            }
        }
    };

    return (
        <JoinMeetingContainer>
            <ToastContainer />
            
            {/* Dynamic Background Elements */}
            <BackgroundElements>
                <GradientOrb className="orb1" />
                <GradientOrb className="orb2" />
                <GradientOrb className="orb3" />
                <FloatingParticles />
                <GridPattern />
            </BackgroundElements>
            
            <ContentContainer>
                <JoinCard>
                    <VideoSection>
                        <VideoContainer>
                            {isVideoOn ? (
                                <video ref={videoRef} autoPlay muted={isMuted}></video>
                            ) : (
                                <VideoPlaceholder>
                                    <FiUser size={80} color="#fff" />
                                </VideoPlaceholder>
                            )}
                        </VideoContainer>
                        <VideoControls>
                            <ControlButton onClick={handleMute}>
                                {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
                            </ControlButton>
                            <ControlButton onClick={() => setIsVideoOn(!isVideoOn)}>
                                {isVideoOn ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
                            </ControlButton>
                        </VideoControls>
                    </VideoSection>
                    
                    <FormSection>
                        <LogoText>VidHive</LogoText>
                        <Tagline>Connect with Confidence</Tagline>
                        <MeetingInput
                            type="text"
                            placeholder="Enter Meeting ID"
                            value={callId}
                            onChange={(e) => setCallId(e.target.value)}
                        />
                        <JoinButton 
                            onClick={() => setupSources("join", callId)}
                        >
                            Join Meeting
                        </JoinButton>
                    </FormSection>
                </JoinCard>
            </ContentContainer>
        </JoinMeetingContainer>
    );
};

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.6; }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 15px rgba(10, 101, 237, 0.5); }
  50% { box-shadow: 0 0 25px rgba(76, 0, 255, 0.7); }
  100% { box-shadow: 0 0 15px rgba(10, 101, 237, 0.5); }
`;

const orbMove1 = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(100px, 100px); }
  100% { transform: translate(0, 0); }
`;

const orbMove2 = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(-100px, -100px); }
  100% { transform: translate(0, 0); }
`;

const orbMove3 = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(80px, -80px); }
  100% { transform: translate(0, 0); }
`;

const particleFloat = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 0.2; }
  50% { opacity: 0.6; }
  100% { transform: translateY(-100px) translateX(100px); opacity: 0.2; }
`;

const scanLineAnimation = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

// Styled Components
const JoinMeetingContainer = styled.div`
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
`;

const BackgroundElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
`;

const GradientOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
  
  &.orb1 {
    top: -100px;
    left: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(32, 100, 226, 0.6) 0%, rgba(9, 9, 121, 0.2) 70%);
    animation: ${orbMove1} 25s ease-in-out infinite;
  }
  
  &.orb2 {
    bottom: -150px;
    right: -150px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(76, 0, 255, 0.6) 0%, rgba(25, 0, 94, 0.2) 70%);
    animation: ${orbMove2} 30s ease-in-out infinite;
  }
  
  &.orb3 {
    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(0, 212, 255, 0.5) 0%, rgba(9, 9, 121, 0.1) 70%);
    animation: ${orbMove3} 20s ease-in-out infinite;
  }
`;

// Component for floating particles
const FloatingParticles = () => {
  return (
    <ParticlesContainer>
      {[...Array(30)].map((_, i) => {
        const size = Math.random() * 5 + 2;
        const delay = i * 0.5;
        const duration = Math.random() * 10 + 15;
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
  z-index: 2;
`;

const Particle = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: ${particleFloat} 15s infinite ease-in-out;
`;

// Grid pattern for tech feel
const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(10, 101, 237, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(10, 101, 237, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 1;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  height: 100vh;
  padding: 20px;
  z-index: 10;
  position: relative;
`;

const JoinCard = styled.div`
  display: flex;
  width: 80%;
  max-width: 1000px;
  height: auto;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(21, 24, 33, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;
  
  @media (max-width: 992px) {
    width: 90%;
    flex-direction: column;
  }
  
  @media (max-width: 576px) {
    width: 95%;
  }
`;

const VideoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: rgba(21, 24, 33, 0.9);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(10, 101, 237, 0.05) 0%, rgba(76, 0, 255, 0.05) 100%);
    z-index: -1;
  }
  
  @media (max-width: 992px) {
    padding: 20px;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 576px) {
    height: 220px;
  }
`;

const VideoPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #2a2a3a;
  border-radius: 16px;
`;

const VideoControls = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const ControlButton = styled.button`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1e2a 0%, #262b3c 100%);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #0a65ed 0%, #361cb7 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(10, 101, 237, 0.4);
  }
  
  svg {
    transition: all 0.3s ease;
  }
  
  @media (max-width: 576px) {
    width: 48px;
    height: 48px;
  }
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(15, 18, 27, 0.7);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #0a65ed, #361cb7);
  }
  
  @media (max-width: 992px) {
    padding: 30px;
  }
  
  @media (max-width: 576px) {
    padding: 20px;
  }
`;

const LogoText = styled.h1`
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(to right, #0a65ed, #361cb7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${float} 6s ease-in-out infinite;
  text-shadow: 0 5px 15px rgba(10, 101, 237, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2rem;
  }
`;

const Tagline = styled.p`
  color: #a0a0b8;
  font-size: 1.2rem;
  margin-bottom: 40px;
  text-align: center;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 30px;
  }
`;

const MeetingInput = styled.input`
  width: 80%;
  padding: 15px;
  margin-bottom: 25px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(21, 24, 33, 0.8);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:focus {
    border-color: #0a65ed;
    box-shadow: 0 0 10px rgba(10, 101, 237, 0.3);
  }
  
  &::placeholder {
    color: #676778;
  }
  
  @media (max-width: 576px) {
    padding: 12px;
    margin-bottom: 20px;
  }
`;

const JoinButton = styled.button`
  width: 80%;
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #0a65ed, #361cb7);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(10, 101, 237, 0.3);
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 0.5px;
  animation: ${glowAnimation} 3s infinite;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(10, 101, 237, 0.5);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 576px) {
    padding: 12px;
  }
`;

export default JoinMeeting;