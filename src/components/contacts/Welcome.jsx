import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await JSON.parse(localStorage.getItem('chat-app-user'));
        setUserName(userData?.username || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
  @media (max-width: 768px) {
    img {
      height: 10rem;
    }
    span {
      font-size:15px;
      color: #4e0eff;
    }
    h1{
      font-size:15px;
    }
    h3{
      font-size:8px;
    }
  }
`;
