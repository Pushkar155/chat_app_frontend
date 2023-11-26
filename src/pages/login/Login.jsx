import React,{useEffect, useState} from 'react';
import "./login.scss";
import {useNavigate} from 'react-router-dom';
import logo from '../../assets/box-removebg-preview.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute} from '../../utils/APIRoutes';

const Login = () => {
    const navigate=useNavigate();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };
    const [values,setValues]=useState({
        username:"",
        password:"",
    });

    useEffect(()=>{
      if(localStorage.getItem('chat-app-user')){
        navigate("/chat");
      }
    },[navigate])

    const handelChange=(event)=>{
        setValues({...values,[event.target.name]:event.target.value});
        // console.log(values);
    }
    const handleValidation = () => {
        const { password, username} = values;
        // console.log(values)
         if (username=== "" || password==="") {
          toast.error(
            "Email and Password Required ",
            toastOptions
          );
          return false;
        } else if (password.length < 8) {
          toast.error(
            "Password should be equal or greater than 8 characters.",
            toastOptions
          );
          return false;
        }
        return true;
      };
    
    const handelLogin1= async (event)=>{
        event.preventDefault();
        // handleValidation();
        if(handleValidation()){
            const {password,username}=values;
            const {data}=await axios.post(loginRoute,{
                username,
                password,
            });
            // console.log(data);
            if(data.status===false){
                toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
                console.log(data);
                localStorage.setItem("chat-app-user",JSON.stringify(data.usernamecheck));
                if(data.usernamecheck.isAvtarImageSet){
                  navigate("/chat")
                }else{
                  navigate("/avtar");
                }
                
            }
        }

    }
    const handellogin=()=>{
      navigate('/')
  }

  return (
    <div className='Login'>
        <div className="Login_container">
            <div className="name">
                <img src={logo} alt="Logo" />
                <h1>ChatBox</h1>
            </div>
            <div className="input">
                <input type="text" placeholder="UserName" name='username' min={3} onChange={(e)=>handelChange(e)}/>
            </div>
            <div className="input">
                <input type="password" placeholder="Password" name='password' onChange={(e)=>handelChange(e)}/>
            </div>
            <div className="Button">
                <button onClick={(event) => handelLogin1(event)}>Login</button>
            </div>
            <div className="nothave">
                <p>Don't have an account?</p>
                <h5 onClick={handellogin} >REGISTER</h5>
            </div>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default Login