import React from 'react';
import {BiPowerOff} from "react-icons/bi";
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const handelclick = async ()=>{
        localStorage.clear();
        navigate("/login");
    }
  return (
    <div className='button' onClick={handelclick}>
        <BiPowerOff/>
    </div>
  )
}

export default Logout