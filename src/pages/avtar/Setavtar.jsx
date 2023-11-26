import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "./loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvtarRoute } from "../../utils/APIRoutes";
export default function SetAvatar() {
//   const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')){
      navigate("/login");}
  }, [navigate]);


const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const userString = localStorage.getItem('chat-app-user');
  
      if (userString) {
        const user = JSON.parse(userString);
        // console.log(user);
        // console.log(avatars[selectedAvatar]);
  
        try {
          const { data } = await axios.post(`${setAvtarRoute}/${user._id}`, {
            image: avatars[selectedAvatar],
          });
          // console.log(avatars[selectedAvatar]);
          // console.log(data);
  
          if (data.isSet) {
            user.isAvtarImageSet = true;
            user.avtarImage = data.image;
            // console.log(data);
            localStorage.setItem(
              'chat-app-user',
              JSON.stringify(user)
            );
            navigate("/");
          } else {
            toast.error("Error setting avatar. Please try again.", toastOptions);
          }
        } catch (error) {
          console.error("Error setting avatar:", error);
          toast.error("An error occurred while setting avatar.", toastOptions);
        }
      } 
      else {
        // console.log(avatars[selectedAvatar]);
        console.error("User data not found in localStorage");
      }
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      const api = `https://api.multiavatar.com/4645646`
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
  
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }

  /* Media Query for screens with a maximum width of 768 pixels */
  @media (max-width: 768px) {
    gap:1.5rem;
    /* Adjust styles for smaller screens here */
    .avatars {
      flex-direction:column;
      gap:0.8rem;
      
      .avatar{
        img{
          height:3.7rem;
        }
      }
    }
    .title-container {
      h1 {
        font-size:15px;
      }
    }
    

    .submit-btn {
      font-size: 0.6rem;
    }
  }
`;