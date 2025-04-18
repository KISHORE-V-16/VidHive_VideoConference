import React, { useEffect, useId, useState } from 'react'
import styled from 'styled-components'
import Header from './Header'
import { ToastContainer, toast } from 'react-toastify';
import {collection,addDoc,updateDoc, doc,onSnapshot} from 'firebase/firestore';
import { firestore1 } from '../Utils/firebase';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Mymeet1on1comp = (userdetails) => {


    const [meetname,setmeetname] = useState('');
    const [invitename,setinvitename] = useState('');
    const [date,setdate] = useState('');

    const toaststyles =  {
        position: "bottom-right",
        autoClose: 1300, 
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: false, 
        draggable: true, 
        progress: undefined,
      }

      const userscollections = collection(firestore1,'userscollections');
      const [userdata,setuserdata] = useState([]);

      useEffect(()=>{

        const usercollection__data =  onSnapshot(userscollections,(snapshot)=> {
          const data = snapshot.docs.map(doc =>( {
            emailid:doc.data().emailid,
            name1:doc.data().name,
           uid:doc.data().uid,
        }));
        setuserdata(data);
    
        })
        return ()=>{
        usercollection__data();
        }
          
      },[]);


    const generate_meetingID = () =>{
            let meetingID="";
            const temp = "12345qwertyuobngdslkasxmopwGQWMVALSKYIE7895236DMCopasqwe1526"

            const maxl1 = temp.length;

            for(let i=0;i<10;i++){
                meetingID += temp.charAt(Math.floor(Math.random() * maxl1));
            }

            return meetingID;
    }

    const meetcollections = collection(firestore1,'Meetings');
    const [meetdata,setmeetdata] = useState([]);
    

    useEffect(()=>{

      const meetcollection__data =  onSnapshot(meetcollections,(snapshot)=> {
        const data = snapshot.docs.map(doc =>({
          "Createdby":doc.data().CreatedBY,
          "meetid":doc.data().meetID,
          "invitedusers":doc.data().invitedUsers,
          "maxusers":doc.data().maxUsers,
          "meetingdate":doc.data().meetingDate,
          "meetingname":doc.data().meetingName,
          "meetingtype":doc.data().meetingType,
          "status":doc.data().status,
          "id":doc.id,
      }));
      setmeetdata(data);
  
      })
      return ()=>{
        
      meetcollection__data();
   
  }})

 
    useEffect(()=>{
        const meetids = localStorage.getItem('userdetails');
        const userdetails = meetdata.filter((data)=>data.meetid == meetids);
if(userdetails[0]){
    
    const meetingup = userdetails[0].meetingdate
        setinvitename(userdetails[0].invitedusers);
        setdate(meetingup);
        console.log(meetingup);
        setmeetname(userdetails[0].meetingname);
        
}
    },[userdetails]);



    const updateformdata = () =>{
        if(!meetname || meetname.length <10 || !date){
        if(!meetname){
            toast.warn("Enter the proper meet Name",toaststyles);
        }
        if (meetname && meetname.length < 10 ) {
            
            toast.warn("Enter a minimum length of meet name",toaststyles);
        }
        if (!date){
            console.log(date);
            toast.warn("Enter a Proper date of an meet",toaststyles);
        }
        
    }
    else{

        const verificationstatus = (meetdate) =>{
            
            const now = moment();
            const date1 = moment(new Date()).format('DD-MM-YYYY');
            

            if(date1==meetdate){
                    return "true";
                }
            else if(date1 < meetdate){
                console.log("done future");
                return "future";
            }
            else if(date1 > meetdate){
                console.log("before");
                return "cancelled";
            }
        
      }
      
      const currentuser = userdata.filter((data)=>data.name1 == localStorage.getItem('username'));

    const newinvite = userdata.filter((data)=>data.uid == localStorage.getItem('userid'))[0];
     
    const singleuserdata = userdata.filter((data)=>data.name1 == invitename);
    
    const meetID = generate_meetingID();
    const iduser = meetdata.filter((data)=>data.invitedusers == localStorage.getItem('userid'))[0].id;
    const docref = doc(firestore1,'Meetings',iduser);

    const updatedform = {
        "createduser":currentuser[0].name1,
        "CreatedBY":currentuser[0].uid,
        "meetID":meetID,
        invitedUsers:[singleuserdata[0] ?singleuserdata[0].uid  :newinvite[0].uid ],
        "maxUsers":1,
        "meetingDate":moment(date).format('DD-MM-YYYY'),
        "meetingName":meetname,
        "meetingType":"1-on-1",
        "status":`${
        verificationstatus(moment(date).format('DD-MM-YYYY'))
        }`,
    };

    updateDoc(docref,updatedform)
    .then(res => {
        
        toast.dark('SuccessFully Updated the data',toaststyles);
    })
    .catch(error => {
       
        toast.warn('Retry Again Or else Network Problem',toaststyles);
    });

    }

}

  return (
<>

<OneCss>
    <ToastContainer/>
<div className="container">

<div className="body">
   <div className="sub-body">
    <div className="meet-dsg">
    <label htmlFor="text">Meeting Name</label>
    <input type="text" name="name" className='meet-name' value={meetname}
         onChange={(e)=>setmeetname(e.target.value)} placeholder='Meeting Name'/>
    </div>
   
    <div className="select-dsg">
        <label htmlFor="text">Invite User</label>
        <select name="option" className="sub-select-dsg" value={invitename}
         onChange={(e)=>setinvitename(e.target.value)}  >
            <option value="John Wick">John Wick</option>
            <option value="Donald Trump">Donald Trump</option>
            <option value="Sharmila">Sharmila</option>
            <option value="Nandhini">Nandhani</option>
            <option value="Ramya">Ramya</option>
            <option value="Sharu Khan">Sharu Khan</option>
        </select>
    </div>
    <div className="date-dsg">
        <label htmlFor="date">Date</label>
        <input type="date" name="date" placeholder='DD-MM-YYYY' value={date}
        onChange={(e) => {
            setdate(e.target.value);
          }} min={new Date().toISOString().split('T')[0]}/>
    </div>
    <div className="btn-body">
        <button className='btn-cancel'>Cancel</button>
        <button className='btn-submit' onClick={()=>{updateformdata();}}>Submit</button>
    </div>
</div>
</div>
</div>
</OneCss>
</>
  )
}

const OneCss = styled.div`
.container{
    width: 80%;
    height: 30rem;
   margin-top: 10px;
   margin-left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to left,#4c4c4c,#161617);
    .body{
        display: flex;
        flex-flow: column;
        align-items: center;
        width: 15rem;
        height: 12rem;
        padding: 30px;
        border-radius: 20px;
        border: 1.5px solid whitesmoke;
        box-shadow: 1px 1px 50px #0a65ed;
        font-size: 15px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-weight: 500;
        color: #0a65ed;

        .sub-body{
            display: flex;
            flex-flow: column;
            gap:30px;
        }

        input{
            width: 12rem;
            height: 30px;
        }

        .meet-dsg{
            display: flex;
            flex-flow: column;
            gap: 10px;

        }

        .select-dsg{
            display: flex;
            flex-flow: column;
            gap: 10px;

            select{
            width: 12.5rem;
            height: 38px;
            }
        }

        .date-dsg{
            display: flex;
            flex-flow: column;
            gap:5px;
        }

        .btn-body{
            display: flex;
            gap: 40px;
            width: max-content;
            border-radius: 10px;
            border: none;
            
            button{
            width: 80px;
            font-size: 15px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: 600;
            padding: 10px;
            color: whitesmoke;
            border-radius: 5px;
            border: none;
            transition: all .3s ease-in;

            }

            .btn-cancel{
            background-color: #c91515dc;
            }

            .btn-submit{
                background-color: #0a65ed;
            }

            .btn-submit:hover{
                transform: scale(1.09);
                color: #0a65ed;
                background-color: whitesmoke;
                box-shadow: 1px 1px 20px #0a65ed;
            }

            .btn-cancel:hover{
                transform: scale(1.09);
                color: #be566d;
                background-color: whitesmoke;
                box-shadow: 1px 1px 20px #be566d;
            }
        }
    }
}

`

export default Mymeet1on1comp