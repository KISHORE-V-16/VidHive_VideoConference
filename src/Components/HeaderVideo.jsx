import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AiOutlineLogout } from 'react-icons/ai'
import Zoomish_logo from '../asserts/logo.png';
import { useNavigate } from 'react-router-dom';
import { MdCallEnd, MdScreenShare } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import { Video } from 'lucide-react';

const HeaderVideo = ({ hangUp }) => {

    const toaststyles = {
        position: "top-center",
        autoClose: 1300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast",
    }

    const navigate1 = useNavigate();

    return (
        <>
            <HeaderCss>
                <div className="container">
                    <div className="header1">
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

                                <span className="logo-text">VidHive</span>
                            </div>
                        </div>
                        <div className="middle">
                            <h3>{"small meet"}</h3>
                        </div>
                        <div className="right-side">
                            <button className='logout-btn' onClick={() => { hangUp(); }}><MdCallEnd /></button>
                        </div>
                    </div>
                </div>
            </HeaderCss>
        </>
    )
}

const HeaderCss = styled.div`

.container{
    display: flex;
    flex-flow: column;
    
.header1{

    z-index:100;
    width:102%;
    height:3rem;
    background-color: #15181b;
    padding-left: 5px;
    padding-top: 5px;
    padding-bottom: 10px;
    padding-right: 35px;
    display: flex;
    justify-content: space-between;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-weight: 600;
    font-size:20px;
    align-items :center ;
    
    .left-side{

      .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left:2rem;
      
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
    }

    .middle{
        display: flex;
        gap:10px;
    
        margin-left: -100px;
        color: whitesmoke;
        .name-dsg{
            color:#0373fc;
        }
    }

    .right-side{
        .logout-btn{
            width: 50px;
            height: 30px;
            margin-right: 10px;
            background-color: #c41b1b;
            color: whitesmoke;
                border: none;
                border-radius: 10px;
                transition: all .3s ease-in-out;
            svg{
                font-size: 25px;
                
            }
        }

        .logout-btn:hover{
            color: red;
            background-color: whitesmoke;
            font-size: 25px;
            box-shadow: 1px 1px 20px black;
            transform:scale(1.09);
        }
    }
}

}


`

export default HeaderVideo