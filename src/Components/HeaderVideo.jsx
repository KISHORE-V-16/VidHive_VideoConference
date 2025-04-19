import React from 'react';
import styled,{keyframes} from 'styled-components';
import { MdCallEnd } from 'react-icons/md';
import { Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeaderVideo = ({ hangUp }) => {
    const navigate1 = useNavigate();

    return (
        <HeaderCss>
            <div className="container">
                <div className="left-side">
                    <div className="logo-container">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <defs>
                                <linearGradient id="videoGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#0373fc" />
                                    <stop offset="100%" stopColor="#ffffff" />
                                </linearGradient>
                            </defs>

                            <Video stroke="url(#videoGradient)" strokeWidth={2} />
                        </svg>

                        <LogoText>VidHive</LogoText>
                    </div>
                </div>
                <div className="middle">
                    <h3>Meeting Room</h3>
                </div>
                <div className="right-side">
                    <button className='end-call-btn' onClick={hangUp}>
                        <MdCallEnd />
                    </button>
                </div>
            </div>
        </HeaderCss>
    );
};

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;


const LogoText = styled.h1`
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(to right, #0a65ed, #361cb7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${float} 6s ease-in-out infinite;
  text-shadow: 0 5px 15px rgba(10, 101, 237, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2rem;
  }
`;

const HeaderCss = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: #15181b;
    width: 100%;
    
    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4rem;
        padding: 0 0.5rem;
        max-width: 100%;
        
        @media (min-width: 768px) {
            padding: 0 1rem;
        }
    }
    
    .left-side {
        .logo-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            
            svg {
                @media (max-width: 480px) {
                    width: 24px;
                    height: 24px;
                }
            }
            
            .logo-text {
                font-size: 1.25rem;
                font-weight: 600;
                background: linear-gradient(to right, #0373fc, #361cb7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                
                @media (min-width: 768px) {
                    font-size: 1.5rem;
                }
                
                @media (max-width: 480px) {
                    font-size: 1rem;
                }
            }
        }
    }
    
    .middle {
        display: flex;
        align-items: center;
        
        h3 {
            color: whitesmoke;
            margin: 0;
            font-size: 1rem;
            
            @media (min-width: 768px) {
                font-size: 1.25rem;
            }
            
            @media (max-width: 480px) {
                display: none;
            }
        }
    }
    
    .right-side {
        .end-call-btn {
            width: 40px;
            height: 40px;
            background-color: #c41b1b;
            color: whitesmoke;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease-in-out;
            cursor: pointer;
            
            svg {
                font-size: 20px;
            }
            
            &:hover {
                background-color: #e02222;
                transform: scale(1.05);
                box-shadow: 0 0 10px rgba(196, 27, 27, 0.5);
            }
        }
    }
`;

export default HeaderVideo;