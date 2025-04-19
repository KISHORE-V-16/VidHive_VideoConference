import React from 'react';
import styled from 'styled-components';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaSmile, FaFrown,FaUserAstronaut } from 'react-icons/fa';
import { BsThreeDotsVertical ,BsPersonWorkspace} from 'react-icons/bs';
import { MdScreenShare, MdStopScreenShare,MdSmartToy ,MdOutlineFace} from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';

const FooterVideo = ({
    newMessageCount,
    chatOpen,
    toggleChat,
    emotion_detect,
    emotionDetectionOn,
    useAvatar,
    toggleAvatar,
    isVideo,
    isMuted,
    isScreensharing,
    toggleVideo,
    toggleAudio,
    toggleScreenSharing
}) => {
    return (
        <FooterContainer>
            <div className="controls-container">
                <div className="left-controls">
                    <IconButton onClick={toggleAvatar} className={useAvatar ? "active-avatar" : ""}>
                        <FaUserAstronaut/>
                        <span className="tooltip">AI Avatar</span>
                    </IconButton>
                    <IconButton onClick={emotion_detect} className={emotionDetectionOn ? "active" : ""}>
                        {emotionDetectionOn ? <FaFrown /> : <FaSmile />}
                        <span className="tooltip">Emotion Detection</span>
                    </IconButton>
                </div>
                
                <div className="center-controls">
                    <IconButton onClick={toggleAudio} className={!isMuted ? "danger" : ""}>
                        {isMuted ? <FaMicrophone /> : <FaMicrophoneSlash />}
                        <span className="tooltip">{isMuted ? "Mute" : "Unmute"}</span>
                    </IconButton>
                    <IconButton onClick={toggleVideo} className={!isVideo ? "danger" : ""}>
                        {isVideo ? <FaVideo /> : <FaVideoSlash />}
                        <span className="tooltip">{isVideo ? "Stop Video" : "Start Video"}</span>
                    </IconButton>
                    <IconButton onClick={toggleScreenSharing} className={isScreensharing ? "active-green" : ""}>
                        {!isScreensharing ? <MdScreenShare /> : <MdStopScreenShare />}
                        <span className="tooltip">{isScreensharing ? "Stop Sharing" : "Share Screen"}</span>
                    </IconButton>
                    <IconButton>
                        <BsThreeDotsVertical />
                        <span className="tooltip">More</span>
                    </IconButton>
                </div>
                
                <div className="right-controls">
                    <IconButton onClick={toggleChat} className={chatOpen ? "active" : ""}>
                        <BiMessageDetail />
                        {(newMessageCount > 0 && !chatOpen) && (
                            <NotificationBadge>{newMessageCount}</NotificationBadge>
                        )}
                        <span className="tooltip">Chat</span>
                    </IconButton>
                </div>
            </div>
        </FooterContainer>
    );
};

const FooterContainer = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: #15181b;
    width: 100%;
    
    .controls-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0rem 0.7rem;
        height: 4rem;
        max-width: 100%;
        
        @media (min-width: 768px) {
            padding:0rem 0.7rem; 
        }
    }
    
    .left-controls, .right-controls {
        display: flex;
        gap: 0.5rem;
        
        @media (min-width: 768px) {
            gap: 1rem;
        }
    }
    
    .center-controls {
        display: flex;
        gap: 0.5rem;
        
        @media (min-width: 768px) {
            gap: 1rem;
        }
    }
    
    .avatar-icon {
        width: 20px;
        height: 20px;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21v-2a7 7 0 0 0-14 0v2"/></svg>');
        background-position: center;
        background-repeat: no-repeat;
        color:white;
    }
`;

const IconButton = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 18px;
    border-radius: 50%;
    color: white;
    svg{
        color: white;
    }
    background-color: #000000;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        transform: scale(1.05);
        background-color: #3a3a3a;
    }
    
    &.active {
        background-color: #0373fc;
        box-shadow: 0 0 10px rgba(3, 115, 252, 0.5);
    }
    
    &.active-avatar {
        background-color: #8a2be2;
        box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
    }
    
    &.active-green {
        background-color: #1bf870;
        color: #000;
        box-shadow: 0 0 10px rgba(27, 248, 112, 0.5);
    }
    
    &.danger {
        background-color: #c41b1b;
        box-shadow: 0 0 10px rgba(196, 27, 27, 0.5);
    }
    
    .tooltip {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
    }
    
    &:hover .tooltip {
        opacity: 1;
        visibility: visible;
    }
    
    @media (max-width: 480px) {
        width: 36px;
        height: 36px;
        font-size: 16px;
    }
`;

const NotificationBadge = styled.span`
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ff4d4d;
    color: white;
    font-size: 10px;
    min-width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2px;
    border: 2px solid #15181b;
`;

export default FooterVideo;