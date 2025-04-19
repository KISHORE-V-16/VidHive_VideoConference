import React,{useEffect} from 'react';
import styled, { keyframes } from 'styled-components';
import { AiOutlineLogout } from 'react-icons/ai';
import Logo from '../asserts/logo.png';
import { useNavigate } from 'react-router-dom';
import { fireAuth } from '../Utils/firebase';
import { signOut } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { Video, Users, Shield } from 'lucide-react';

const Header = ({ createmeet, create1on1meet, videoconferenceapp, mymeeting }) => {
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const toastStyles = {
        position: "top-center",
        autoClose: 1300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast",
    };

    useEffect(() => {
      const authMethod = localStorage.getItem('authMethod');
  
      if (authMethod === 'firebase') {
          const unsubscribe = onAuthStateChanged(fireAuth, (currentUser) => {
              if (!currentUser) {
                  setTimeout(() => {
                      navigate('/Login');
                  }, 2500);
              }
          });
  
          return () => unsubscribe();
      }
  }, []);
  

  const handleLogout = () => {
    const authMethod = localStorage.getItem('authMethod');

    if (authMethod === 'firebase') {
        signOut(fireAuth)
            .then(() => {
                toast.dark('Successfully Logged Out (Firebase)', toastStyles);
                localStorage.clear();
            })
            .catch((error) => {
                console.error('Firebase logout error:', error);
                toast.error('Logout failed. Please try again.', toastStyles);
            });
    } else if (authMethod === 'custom') {
        localStorage.clear();
        toast.dark('Successfully Logged Out (Custom)', toastStyles);
    } else {
        localStorage.clear();
        toast.dark('Logged Out', toastStyles);
    }

    setTimeout(() => {
        navigate('/Login');
    }, 1000);
};


    return (
        <HeaderContainer>
            <div className="header-top">
                <div className="logo-container">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <defs>
                            <linearGradient id="videoGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#0373fc" />
                                <stop offset="100%" stopColor="#361cb7" />
                            </linearGradient>
                        </defs>

                        <Video stroke="url(#videoGradient)" strokeWidth={2} />
                    </svg>

                    <LogoText>VidHive</LogoText>
                </div>

                <div className="welcome-container">
                    <span className="welcome-text">Hello,</span>
                    <span className="username">{username}</span>
                </div>

                <button className="logout-button" onClick={handleLogout}>
                    <AiOutlineLogout />
                    <span className="logout-text">Logout</span>
                </button>
            </div>

            <div className="header-navigation">
                <button className="nav-button" onClick={() => navigate('/')}>
                    Dashboard
                </button>

                {createmeet && (
                    <button className="nav-button" onClick={() => navigate('/common/create')}>
                        Create Meet
                    </button>
                )}

                {create1on1meet && (
                    <button className="nav-button">
                        Create One on One Meet
                    </button>
                )}

                {videoconferenceapp && (
                    <button className="nav-button">
                        Video Conference Meet
                    </button>
                )}

                {mymeeting && (
                    <button className="nav-button">
                        My Meetings
                    </button>
                )}
            </div>
        </HeaderContainer>
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
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(to right, #0a65ed, #361cb7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${float} 6s ease-in-out infinite;
  text-shadow: 0 5px 15px rgba(10, 101, 237, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;


const HeaderContainer = styled.header`
  width: 100%;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  z-index:10;
  .vidhive-logo{
    width: 40px;
    height: 40px;
    color:whitesmoke;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0rem 0.4rem;
    border-bottom:1px solid #3e3e3e;
    background-color: #15181b;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      img {
        width: 40px;
        height: 40px;
      }
      
      .logo-text {
        font-size: 1.5rem;
        font-weight: 600;
        background: linear-gradient(to right, #0373fc, #361cb7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    
    .welcome-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .welcome-text {
        color: #ffffff;
        font-size: 1rem;
      }
      
      .username {
        color: #0373fc;
        font-size: 1rem;
        font-weight: 600;
      }
    }
    
    .logout-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #0373fc;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      svg {
        font-size: 1.2rem;
      }
      
      &:hover {
        background-color: #0262d6;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(3, 115, 252, 0.4);
      }
    }
  }
  
  .header-navigation {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    background-color: #15181b;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    overflow-x: auto;
    
    .nav-button {
      background-color: #0373fc;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: white;
        color: #0373fc;
        border-color: #0373fc;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(3, 115, 252, 0.4);
      }
    }
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .header-top {
      padding: 0.75rem;
      
      .logo-container {
        .logo-text {
          font-size: 1.25rem;
        }
        
        img {
          width: 35px;
          height: 35px;
        }
      }
      
      .welcome-container {
        display: none;
      }
      
      .logout-button {
        padding: 0.4rem;
        
        .logout-text {
          display: none;
        }
      }
    }
    
    .header-navigation {
      padding: 0.5rem 1rem;
      gap: 0.5rem;
      
      .nav-button {
        padding: 0.4rem 0.75rem;
        font-size: 0.8rem;
      }
    }
  }
  
  @media (max-width: 480px) {
    .header-top {
      padding: 0.5rem;
      
      .logo-container {
        .logo-text {
          font-size: 1.1rem;
        }
        
        img {
          width: 30px;
          height: 30px;
        }
      }
    }
    
    .header-navigation {
      padding: 0.4rem 0.5rem;
      
      .nav-button {
        padding: 0.3rem 0.6rem;
        font-size: 0.75rem;
      }
    }
  }
`;

export default Header;