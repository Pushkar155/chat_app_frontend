import React,{useState,useEffect} from 'react';
import "./register.scss";
import {useNavigate} from 'react-router-dom';
import logo from '../../assets/box-removebg-preview.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../../utils/APIRoutes';

const Register = () => {
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
        email:"",
        password:"",
        confirmPassword:""
    });
    useEffect(()=>{
        if(localStorage.getItem('chat-app-user')){
          navigate("/chat");
        }
      })
    const handelChange=(event)=>{
        setValues({...values,[event.target.name]:event.target.value});
        // console.log(values);
    }
    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;
        console.log(values)
        if (password !== confirmPassword) {
          toast.error(
            "Password and confirm password should be same.",
            toastOptions
          );
          return false;
        } else if (username.length < 3) {
          toast.error(
            "Username should be greater than 3 characters.",
            toastOptions
          );
          return false;
        } else if (password.length < 8) {
          toast.error(
            "Password should be equal or greater than 8 characters.",
            toastOptions
          );
          return false;
        } else if (email === "") {
          toast.error("Email is required.", toastOptions);
          return false;
        }
    
        return true;
      };
    
    const handelLogin1= async (event)=>{
        event.preventDefault();
        // handleValidation();
        if(handleValidation()){
            const {password,username,email}=values;
            const {data}=await axios.post(registerRoute,{
                username,
                email,
                password,
            });
            console.log(data);
            if(data.status===false){
                toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
                toast.success("Success message", toastOptions);
                localStorage.setItem("chat-app-user",JSON.stringify(data.user));
                navigate("/chat");
            }
        }
    }

    const handellogin=()=>{
        navigate('/login')
    }

  return (
    <div className='register'>
        <div className="register_container">
            <div className="name">
                <img src={logo} alt="Logo" />
                <h1>ChatBox</h1>
            </div>
            <div className="input">
                <input type="text" placeholder="UserName" name='username' onChange={(e)=>handelChange(e)}/>
            </div>
            <div className="input">
                <input type="email" placeholder="Email" name='email' onChange={(e)=>handelChange(e)}/>
            </div>
            <div className="input">
                <input type="password" placeholder="Password" name='password' onChange={(e)=>handelChange(e)}/>
            </div>
            <div className="input">
                <input type="password" placeholder="Confirm Password" name='confirmPassword' onChange={(e)=>handelChange(e)}/>
            </div>

            <div className="Button">
                <button onClick={(event) => handelLogin1(event)}>CREATE USER</button>
            </div>

            <div className="nothave">
                <p>Already have an account?</p>
                <h5 onClick={handellogin} >LOGIN</h5>
            </div>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default Register