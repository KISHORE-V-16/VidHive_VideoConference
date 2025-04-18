import React from "react";
import styled from "styled-components";

const CustomToast = ({ imageSrc, title }) => {
    return (
        <Customstyles>
             <div className="title">SuccessFully Added to Cart</div>
      <div className="custom-toast">
       
        <img src={imageSrc} alt={title} className="toast-image" />
        <div className="toast-content">
          <h3>{title}</h3>
         
        </div>
      
      </div>
      </Customstyles>
    );

   
  }
  const Customstyles = styled.div`
  .custom-toast{
      display: flex;
      flex-flow: row;
    gap:0.9rem;
    
        img{
            padding-top: 10px;
            width: 80px;
            height: 80px;
        }
        .toast-content{
            width: 150px;
            font-size: 15px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: 500;
        }

  }
  .title{
        position: relative;
        top:0px;
        color: green;
        font-size: 16px;
        font-weight: 700;
    }
`


export default CustomToast;