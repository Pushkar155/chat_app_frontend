import React,{useState,useEffect,useRef} from 'react';
import "./chatcontainer.scss";
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { recieveMessageRoute, sendMessageRoute } from '../../utils/APIRoutes';
import styled from "styled-components";

const ChatContainer = ({currentChat,currentuser,socket}) => {

    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [message,setMessage]=useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        if(currentChat){
        const fetchData = async () => {
            try {
                const response = await axios.post(recieveMessageRoute, {
                    from: currentuser._id,
                    to: currentChat._id
                });
                setMessage(response.data);
            } catch (error) {
                // Handle error appropriately
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }
    }, [currentChat,currentuser]);
    // console.log(message.message);

    const handelsendmessage = async (msg)=>{
        await axios.post(sendMessageRoute,{
            from:currentuser._id,
            to:currentChat._id,
            message:msg,
        });
        socket.current.emit("send-msg",{
            to:currentChat._id,
            from:currentuser._id,
            message:msg,
        });

        const msgs =[...message];
        msgs.push({ fromSelf: true, message: msg });
        setMessage(msgs);
    };
    
    useEffect(() => {
        if (socket.current) {
          socket.current.on("msg-recieve", (msg) => {
            setArrivalMessage({ fromSelf: false, message: msg });
          });
        }
      }, [socket]);

      useEffect(() => {
        arrivalMessage && setMessage((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage]);
    
      useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [message]);

  return (
        <>
        {currentChat && (
            <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${currentChat.avtarImage}`}
                      alt=""
                    />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout/>
            </div>
            <div className="chat-messages">
                {message.map((message)=>{
                    return(
                        <div className={`message ${message.fromSelf ? "sended" : "recived" }`}>
                            <div className="content">
                                <p>
                                    {message.message}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
             <ChatInput handleSendMsg={handelsendmessage}/>
        
             </Container>)
        }
        </>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 80% 10%;
    gap: 0.1rem;
    overflow: hidden;
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        .user-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar {
            img {
            height: 3rem;
            }
        }
        .username {
            h3 {
            color: white;
            }
        }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
        }
        }
        .message {
        display: flex;
        align-items: center;
        .content {
            max-width: 40%;
            overflow-wrap: break-word;
            padding: 1rem;
            font-size: 1.1rem;
            border-radius: 1rem;
            color: #d1d1d1;
            background-color: #9900ff22;
            border:1px solid #EE90EE;
            @media screen and (min-width: 720px) and (max-width: 1080px) {
            max-width: 70%;
            }
        }
        }
        .sended {
        justify-content: flex-end;
        .content {
            border:1px solid #9090EE;
            background-color: #4f04ff21;
            
        }
        }
        .recieved {
        justify-content: flex-start;
        .content {
            background-color: red;
        }
        }
  }    grid-template-rows: 15% 70% 15%;
  @media (max-width: 768px) {
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        .user-details {
        display: flex;
        align-items: center;
        gap: 1px;
        .avatar {
            img {
            height: 1.5rem;
            }
        }
        .username {
            h3 {
            color: white;
            font-size:10px;
            }
        }
        }
    }
    .button{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        border-radius: 10px;
        background-color: #9a86f3;
        border: none;
        cursor: pointer;
        svg {
            font-size: 0.7rem;
            color: #ebe7ff;
          }
}
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
        }
        }
        .message {
        display: flex;
        align-items: center;
        .content {
            // max-width: 40%;
            overflow-wrap: break-word;
            padding: 0.8rem;
            font-size: 9px;
            border-radius: 1rem;
            color: #d1d1d1;
            background-color: #9900ff22;
            border:1px solid #EE90EE;
            @media screen and (min-width: 720px) and (max-width: 1080px) {
            max-width: 70%;
            }
        }
        }
        .sended {
        justify-content: flex-end;
        .content {
            border:1px solid #9090EE;
            background-color: #4f04ff21;
            
        }
        }
        .recieved {
        justify-content: flex-start;
        .content {
            background-color: red;
        }
        }
  } 

  }
  
`;

export default ChatContainer