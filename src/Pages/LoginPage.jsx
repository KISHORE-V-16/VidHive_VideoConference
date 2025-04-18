import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import { firestore1, fireAuth, provider } from '../Utils/firebase';
import 'react-toastify/dist/ReactToastify.css';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import axios from 'axios';
// Import paths kept the same
import loginImg from '../asserts/loginanimation.gif';
import VidHive_logo from '../asserts/logo.png';
import Googleicon from '../asserts/Google.png';
import { Video, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.6; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 0.2; }
  50% { transform: translateY(-50px) translateX(50px); opacity: 0.8; }
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

// Real global style
const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: linear-gradient(135deg, #030b1a 0%, #0a101f 100%);
  }
`;

// Background elements styling with improved visibility
const BackgroundElementsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  opacity: 1;
  pointer-events: none;
`;

// Enhanced floating particles with improved visibility
const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`;


// Enhanced gradient orbs with improved visibility
const GradientOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 2;
  
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

// Pulse wave effect component
const PulseWaveElement = styled.div`
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
    border: 2px solid rgba(10, 101, 237, 0.4);
    animation: ${pulseAnimation} 6s infinite;
  }
  
  &:after {
    animation-delay: 2s;
  }
`;

// Video elements styled with improved visibility
const VideoElementsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  
  &:before {
    content: '';
    position: absolute;
    top: 10%;
    left: 5%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(76, 0, 255, 0.5);
    box-shadow: 0 0 20px rgba(76, 0, 255, 0.7);
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
    background: rgba(0, 212, 255, 0.5);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.7);
    animation: ${pulseAnimation} 3s infinite;
    animation-delay: 1s;
  }
`;

const LoginContainer = styled.div`
    /* Reset all default margins and padding */
    margin: 0;
    padding: 0;
    
    /* Take full width and height of viewport */
    width: 100vw;
    height: 100vh;
    
    /* Remove any scrollbars */
    overflow: hidden;
    
    /* Center the container */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index:1000;

    /* Make sure the content stays within the viewport */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;

    .login-sub-container {
        position: relative;
        z-index: 20;
        display: flex;
        width: 90%;
        max-width: 960px;
        height: auto;
        max-height: 90vh;
        border-radius: 40px;
        overflow: hidden;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
    }

    .left-side {
        flex: 1;
        background-color: rgba(21, 24, 27, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 5px 0 15px rgba(52, 22, 204, 0.5);
        
        .login-animation {
            width: 100%;
            height: auto;
            object-fit: contain;
            max-height: 400px;
        }
    }

    .right-side {
        flex: 1;
        background-color: rgba(21, 24, 27, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        box-shadow: 5px 0 15px rgba(20, 115, 182, 0.93);
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 20px;

        .logo-text {
            font-size: 2.5rem;
            font-weight: 600;
            background: linear-gradient(to right, #0373fc, #361cb7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .content-logo {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-weight: 500;
        font-size: 1.5rem;
        color: white;
        margin-bottom: 1.5rem;
        text-align: center;
        
        h3 {
            margin: 0 5px;
        }
        
        .dsg-content {
            background: linear-gradient(to left, #0a65ed, #361cb7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    /* Form styles */
    .login-form {
        width: 100%;
        max-width: 320px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .input-group {
        position: relative;
        width: 100%;
    }

    .input-field {
        width: 100%;
        height: 3rem;
        background-color: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 0.75rem 2.5rem 0.75rem 2.5rem;
        color: white;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        
        &:focus {
            outline: none;
            border-color: #0a65ed;
            box-shadow: 0 0 0 1px #0a65ed;
        }
        
        &::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
    }

    .input-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.6);
    }

    .toggle-password {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        
        &:focus {
            outline: none;
        }
    }

    .forgot-password {
        align-self: flex-end;
        color: #0a65ed;
        font-size: 0.85rem;
        text-decoration: none;
        transition: color 0.3s ease;
        margin-top: -0.5rem;
        
        &:hover {
            color: #3e84ee;
            text-decoration: underline;
        }
    }

    .login-btn {
        width: 100%;
        height: 3rem;
        border: none;
        border-radius: 8px;
        background: linear-gradient(to right, #0a65ed, #361cb7);
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 0.5rem;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(10, 101, 237, 0.5);
        }
        
        &:active {
            transform: translateY(0);
        }
    }

    .divider {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 320px;
        margin: 1.5rem 0;
        
        .line {
            flex: 1;
            height: 1px;
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .or-text {
            margin: 0 1rem;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }
    }

    .btn1 {
        width: 100%;
        max-width: 320px;
        height: 3rem;
        border-radius: 8px;
        border: none;
        background: linear-gradient(to right, #0a65ed, #361cb7);
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(67, 85, 99, 0.5);
        }
        
        .google-button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
        
        .google-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid white;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            margin-right: 10px;
        }
        
        .google-text {
            color: #e2e0e0;
            font-size: 16px;
        }
    }

    .signup-prompt {
        margin-top: 1.5rem;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        text-align: center;
        
        .signup-link {
            color: #0a65ed;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
            margin-left: 5px;
            
            &:hover {
                color: #3e84ee;
                text-decoration: underline;
            }
        }
    }

    /* Media Queries for Responsiveness */
    @media (max-width: 768px) {
        .login-sub-container {
            flex-direction: column;
            width: 95%;
            max-width: 400px;
        }
        
        .left-side, .right-side {
            width: 100%;
        }
        
        .left-side {
            border-radius: 40px 40px 0 0;
            padding: 1.5rem 1.5rem 0;
            max-height: 40vh;
        }
        
        .right-side {
            border-radius: 0 0 40px 40px;
            padding: 1rem 1.5rem 1.5rem;
        }
        
        .logo {
            margin-bottom: 10px;
            
            .logo-text {
                font-size: 2rem;
            }
        }
        
        .content-logo {
            font-size: 1.25rem;
            margin-bottom: 1rem;
        }
        
        .login-form, .btn1 {
            max-width: 100%;
        }
    }
    
    @media (max-width: 480px) {
        .login-sub-container {
            width: 100%;
            border-radius: 20px;
            max-height: 100vh;
        }
        
        .left-side {
            padding: 1rem 1rem 0;
            border-radius: 20px 20px 0 0;
            max-height: 30vh;
        }
        
        .right-side {
            padding: 0.5rem 1rem 1.5rem;
            border-radius: 0 0 20px 20px;
        }
        
        .logo {
            .logo-text {
                font-size: 1.75rem;
            }
        }
        
        .content-logo {
            font-size: 1rem;
        }
        
        .login-form {
            gap: 0.75rem;
        }
        
        .input-field {
            height: 2.75rem;
        }
        
        .login-btn, .btn1 {
            height: 2.75rem;
        }
        
        .divider {
            margin: 1rem 0;
        }
    }
`;
// Enhanced floating particles with improved visibility
const Particle = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.6); /* Increased opacity from 0.3 to 0.6 */
  border-radius: 50%;
  animation: ${floatAnimation} 15s infinite ease-in-out;
  box-shadow: 0 0 8px 2px rgba(100, 180, 255, 0.8); /* Added glow effect */
`;

// Animation components
const FloatingParticles = () => {
  return (
    <ParticlesContainer>
      {[...Array(20)].map((_, i) => {
        const size = Math.random() * 8 + 3; // Increased size range from (2-7) to (3-11)
        const delay = i * 0.5;
        const duration = Math.random() * 10 + 10;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        
        // Random color variations to make particles more noticeable
        const colors = [
          'rgba(255, 255, 255, 0.7)',
          'rgba(100, 180, 255, 0.8)',
          'rgba(120, 150, 255, 0.8)',
          'rgba(80, 120, 255, 0.7)'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <Particle 
            key={i} 
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${initialY}%`,
              left: `${initialX}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              background: randomColor
            }} 
          />
        );
      })}
    </ParticlesContainer>
  );
};

const LoginPage = () => {

    const [animationVisible, setAnimationVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formdata,setformdata] = useState({email:"",password:""});

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Enable animations after mount
        setTimeout(() => {
            setAnimationVisible(true);
        }, 100);
    }, []);

    const navigate1 = useNavigate();

    const toastStyles = {
        position: "bottom-right",
        autoClose: 1300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
    };

    const addUsersData = (name, email, uid) => {
        const getdata = collection(firestore1, 'userscollections');
        addDoc(getdata, { "name": name, "emailid": email, "uid": uid })
            .then(res => console.log("User added successfully"))
            .catch(error => console.log(error.message));
    };

    const googleSignIn = () => {
        let flag = 1;
        signInWithPopup(fireAuth, provider)
            .then((results) => {
                localStorage.setItem('username', results.user.displayName);
                localStorage.setItem('emialids', results.user.email);
                if (results.user.emailVerified) {
                    toast.dark('Successfully Logged In', toastStyles);
                    flag = 0;
                }
                setTimeout(() => {
                    navigate1('/');
                }, 2500);
                localStorage.setItem("authMethod", "firebase");
                addUsersData(results.user.displayName, results.user.email, results.user.uid);
            })
            .catch((error) => {
                console.log(error);
                navigate1('/Login');
                if (flag) {
                    toast.dark('Try Again Or There May Be No Internet Connection', toastStyles);
                }
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const login_control = () => {
        axios.post("http://localhost:5001/auth/login", formdata)
            .then((response) => {
                if (!response.data.success) {
                    toast.error(`${response.data.message}`, toastStyles);
                } else {
                    toast.success("Login Successful ...", toastStyles);
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('email', formdata.email);
                    // Save token under a consistent pattern for PrivateRoute to detect
                    const tokenKey = 'token_' + formdata.email;
                    const tokenData = {
                        token: response.data.token,
                        username: response.data.username
                    };
                    localStorage.setItem(tokenKey, JSON.stringify(tokenData));
                    localStorage.setItem("authMethod", "custom");

                    setformdata({ email: "", password: "" });
    
                    setTimeout(() => navigate1('/'), 1800);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Login failed. Please try again.", toastStyles);
            });
    };
    
    
    return (
        <>
            <GlobalStyles />
            
            <BackgroundElementsContainer className={animationVisible ? "animate" : ""}>
                {/* Gradient orbs */}
                <GradientOrb className="orb1" />
                <GradientOrb className="orb2" />
                <GradientOrb className="orb3" />
                
                {/* Video elements */}
                <VideoElementsContainer />
                
                {/* Floating particles */}
                <FloatingParticles />
                
                {/* Pulse wave */}
                <PulseWaveElement />
            </BackgroundElementsContainer>

            <LoginContainer>
                <div className="login-sub-container">
                    <div className="left-side">
                        <img src={loginImg} alt="animated_img" className="login-animation" />
                    </div>
                    <div className="right-side">
                        <div className="logo">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <defs>
                                    <linearGradient id="videoGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#0373fc" />
                                        <stop offset="100%" stopColor="#ffffff" />
                                    </linearGradient>
                                </defs>
                                <Video stroke="url(#videoGradient)" strokeWidth={2} />
                            </svg>
                            <span className="logo-text">VidHive</span>
                        </div>

                        <div className="content-logo">
                            <h3>One Platform to</h3>
                            <h3 className="dsg-content">Connect</h3>
                        </div>

                        {/* Email & Password Login Form */}
                        <div className="login-form">
                            <div className="input-group">
                                <Mail className="input-icon" size={18} color="rgba(255,255,255,0.6)" />
                                <input
                                    type="email"
                                    name="email"
                                    className="input-field"
                                    placeholder="Email"
                                    value={formdata.email}
                                    onChange={(e)=>setformdata({...formdata,[e.target.name]:e.target.value})} 
                                    required
                                />
                            </div>
                            
                            <div className="input-group">
                                <Lock className="input-icon" size={18} color="rgba(255,255,255,0.6)" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-field"
                                    name="password"
                                    placeholder="Password"
                                    value={formdata.password}
                                    onChange={(e)=>setformdata({...formdata,[e.target.name]:e.target.value})} 
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? 
                                        <EyeOff size={18} /> : 
                                        <Eye size={18} />
                                    }
                                </button>
                            </div>
                            
                            <a href="#" className="forgot-password">Forgot Password?</a>
                            
                            <button type="submit" className="login-btn" onClick={login_control}>
                                Log In
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="divider">
                            <div className="line"></div>
                            <span className="or-text">OR</span>
                            <div className="line"></div>
                        </div>

                        {/* Google Sign In Button */}
                        <button className="btn1" onClick={googleSignIn}>
                            <div className="google-button-content">
                                <img src={Googleicon} alt="Google-icon" className="google-icon" />
                                <div className="google-text">Sign In With Google</div>
                            </div>
                        </button>

                        {/* Sign Up Prompt */}
                        <div className="signup-prompt">
                            Don't have an account?
                            <Link to="/signup" className="signup-link">Sign Up</Link>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </LoginContainer>
        </>
    );
};

export default LoginPage;