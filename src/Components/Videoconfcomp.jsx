import React, { useState,useEffect } from 'react'
import styled from 'styled-components'
import Header from './Header'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {toast,ToastContainer} from 'react-toastify';
import {collection,addDoc,updateDoc, doc,onSnapshot} from 'firebase/firestore';
import { firestore1 } from '../Utils/firebase';
import moment from 'moment';

const Videoconfcomp = (userdetails) => {

    const [createmeet,setcreatemeet] = useState(true);
    const [videoconferenceapp,setvideoconferenceapp] = useState(true);
 

    const [meetname,setmeetname] = useState('');
    const [invitename,setinvitename] = useState('');
    const [date,setdate] = useState('');
    
    const navigate = useNavigate();

    const toaststyles =  {
        position: "bottom-right",
        autoClose: 1300, 
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: false, 
        draggable: true, 
        progress: undefined,
        
      }

     const members = [{
        "value":"John Wick","label":"John Wick"
      },{"value":"Donald Trump","label":"Donald Trump"},{"value":"Sharmila","label":"Sharmila"},{"value":"Nandhini","label":"Nandhini"},{"value":"Ramya","label":"Ramya"},{"value":"sharu Khan","label":"sharu Khan"}];


const [selectedOption, setSelectedOption] = useState([]);

const handleChange = (selectedOption) => {
  setSelectedOption(selectedOption);
};

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

const meetingup = moment(userdetails[0].meetingdate).format('YYYY-MM-DD');
    
    setdate(meetingup);
    setmeetname(userdetails[0].meetingname);
   
}
},[userdetails]);

const submitformdata = () =>{

    if(!meetname || meetname.length < 10 || !date || selectedOption.length <=1 ){
    if(!meetname){
        toast.dark("Enter the proper meet Name",toaststyles);
    }
    if (meetname && meetname.length < 10 ) {
        
        toast.dark("Enter a minimum length of meet name",toaststyles);
    }
    if (!date) {
        toast.dark("Enter a Proper date of an meet",toaststyles);
    }
    if(selectedOption.length <= 1){
        toast.dark("Select the invite User more than 1",toaststyles);
    }
}

else{


    const verificationstatus = (meetdate) =>{
            
            const now = moment();
            const date1 = moment(new Date()).format('DD-MM-YYYY');
            console.log(date1,meetdate);
            
            if(date1==meetdate){
                    return "true";
                }
            else if(date1 < meetdate){
                console.log("done future");
                return "future";
            }
            else if(date1 > meetdate){
                return "cancelled";
            }
        
      }

    const singleuserdata = selectedOption.map((user)=>{
        return userdata.filter((data)=>data.name1 == user.label).map((data)=>{return data.uid})[0]; 
         });

         const iduser = meetdata.filter((data)=>data.invitedusers == localStorage.getItem('userid'))[0].id;
         const docref = doc(firestore1,'Meetings',iduser);

   const meetID = generate_meetingID();
   
   const updatedform = {
    "CreatedBY":userdata[0].uid,
    "meetID":meetID,
    "invitedUsers":singleuserdata,
    "maxUsers":singleuserdata.length,
    "meetingDate":moment(date).format('DD-MM-YYYY'),
    "meetingName":meetname,
    "meetingType":"Video-conference",
   "status":`${
    verificationstatus(moment(date).format('DD-MM-YYYY'))
   }`,
}
updateDoc(docref,updatedform)
.then(res => {
   
    toast.dark('SuccessFully Created Video Conference Meet',toaststyles);
})
.catch(error => {
   
    toast.dark('Retry Again Or else Network Problem',toaststyles);
});

}

}

    return (
    <>
   
    <ToastContainer/>
    <VideoCss>
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
        <Select
        isMulti
        options={members}
        value={selectedOption}
        onChange={handleChange}
      />
      <div>
      </div>
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
        <button className='btn-submit' onClick={()=>{submitformdata();}}>Submit</button>
    </div>
</div>
</div>
</div>
    </VideoCss>
    </>
  )
}

const VideoCss = styled.div`
    
    .container{
    width: 93%;
    height: 30rem;
    min-height: 30rem;
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to left,#4c4c4c,#161617);
    .body{
        display: flex;
        flex-flow: column;
        gap: 40px;
        align-items: center;
        width:15rem;
        height: max-content;
        padding: 30px;
        background-color: #282b2f;
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
            gap:15px;
        }

        input{
            width: 15rem;
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

        }

        .date-dsg{
            display: flex;
            flex-flow: column;
            gap:5px;
        }

        .btn-body{
            display: flex;
            gap: 80px;
            width: max-content;
            border-radius: 10px;
            border: none;
            justify-content: space-between;
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

export default Videoconfcomp;