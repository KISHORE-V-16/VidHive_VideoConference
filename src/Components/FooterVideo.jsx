import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RiUserSettingsFill, RiVoiceRecognitionLine } from 'react-icons/ri'
import Zoomish_logo from '../asserts/logo.png';
import { useNavigate } from 'react-router-dom';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdScreenShare, MdStopScreenShare } from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import AI_ON from '../asserts/AI_ON.png';
import AI_OFF from '../asserts/AI_OFF.png';
import { FaSmile, FaFrown } from 'react-icons/fa';

const FooterVideo = ({newMessageCount,chatOpen ,toggleChat, emotion_detect, emotionDetectionOn, useAvatar, toggleAvatar, isVideo, isMuted, isScreensharing, toggleVideo, toggleAudio, toggleScreenSharing }) => {

    return (
        <>
            <HeaderCss>
                <div className="header1">
                    <div className="left-side">
                        <IconButton onClick={() => toggleAvatar()}>
                            <img src={useAvatar ? AI_ON : AI_OFF} alt="AI Avatar" />
                        </IconButton>
                        <div className="icons-l" onClick={() => { emotion_detect(); }}>
                            {
                                (emotionDetectionOn) ? <FaFrown /> : <FaSmile />
                            }
                        </div>
                    </div>
                    <div className="middle">
                        <div className="icons-s" onClick={() => (toggleAudio())}>
                            {
                                (isMuted) ? (<FaMicrophone />) : (<FaMicrophoneSlash />)
                            }
                        </div>
                        <div className="icons-s " onClick={() => toggleVideo()}>
                            {
                                (isVideo) ? (<FaVideo />) : (<FaVideoSlash />)
                            }
                        </div>
                        <div className="icons-g" onClick={() => toggleScreenSharing()}>
                            {
                                (!isScreensharing) ? (<MdScreenShare />) : (<MdStopScreenShare />)
                            }
                        </div>
                        <div className="icons-s">
                            {
                                (<BsThreeDotsVertical />)
                            }
                        </div>

                    </div>
                    <div className="right-side">
                        <button className="chat-btn" onClick={toggleChat}>
                            <BiMessageDetail />
                            {(newMessageCount > 0 && !chatOpen) && (
                                <NotificationBadge>{newMessageCount}</NotificationBadge>
                            )}
                        </button>
                    </div>
                </div>

            </HeaderCss>
        </>
    )
}

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: 25px;
  background-color: #ff4d4d;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
`;

const IconButton = styled.button`
    width: max-content;
    font-size: 19px;
    border-radius: 15px;
    color: white;
    background-color: black;
    box-shadow: 1px 1px 10px #0373fc;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    border: none;
    transition: all .5s ease-in-out;

    &:hover {
        transform: scale(1.09);
        color: black;
        background-color: #0056b3;
        box-shadow: 1px 1px 10px black;
    }

    img {
        width: 40px;  // Adjust size as needed
        height: 40px;
        border-radius: 50%;
    }
`;

const HeaderCss = styled.div`

.header1{
    margin-left: -17px;
    z-index:100;
    padding: 10px;
    width:78.3rem;
    height:3rem;
    background-color: #15181b;

    display: flex;
    justify-content: space-between;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-weight: 600;
    font-size:20px;
    align-items :center ;

    .icons-l{
    
        width: max-content;
        padding: 10px;
        font-size: 19px;
        border-radius: 15px;
        color: whitesmoke;
        background-color: black;
        box-shadow: 1px 1px 10px #0ac0e0;
        cursor: pointer;

        &:hover {
            transform:scale(1.09);
            transition: all .5s ease-in-out;
            color: white;
            background-color: #0056b3;
            box-shadow: 1px 1px 10px black;
        }
    }

    .left-side{

        
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap:20px;
                    padding-left: 15px;
                    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                    font-weight: 600;
                    background: linear-gradient(to right,#0373fc,#361cb7);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    width:5rem;
                    font-size: 30px;
                
    }

    .icons-s{

        width: max-content;
        padding: 10px;
        font-size: 19px;
        border-radius: 15px;
        color: white;
        background-color: black;
        box-shadow: 1px 1px 10px #0373fc;
        cursor: pointer;

        &:hover {
            transform:scale(1.09);
            transition: all .5s ease-in-out;
            color: black;
            background-color: #0056b3;
            box-shadow: 1px 1px 10px black;
        }
    }

    .middle{
        display: flex;
        flex-flow: row;
        justify-content: space-evenly;
        width: 16rem;
        color: whitesmoke;
        .name-dsg{
            color:#0373fc;
        }

        .icons-g{

            width: max-content;
            padding: 10px;
            font-size: 19px;
            border-radius: 15px;
            color: #03ff39;
            background-color:black; 
            box-shadow: 1px 1px 10px #1bf870;
            cursor: pointer;

            &:hover {
                transform:scale(1.09);
                transition: all .5s ease-in-out;
                color: black;
                background-color: #1bf870;
                box-shadow: 1px 1px 10px black;
            }
        }
    }

    .right-side{
        .chat-btn{
            width: max-content;
            padding: 8px;
            background-color: #0f0f0f;
            color: whitesmoke;
            border: none;
            margin-right: 19px;
            border-radius: 10px;
            transition: all .3s ease-in-out;
            box-shadow: 1px 1px 10px #0373fc;
            font-size: 20px;
        }

        .chat-btn:hover{
            transform:scale(1.09);
            transition: all .5s ease-in-out;
            color: black;
            background-color: #0056b3;
            box-shadow: 1px 1px 10px black;
        }
    }
}
`

export default FooterVideo