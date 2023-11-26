import React,{useState,useEffect,useRef} from 'react';
import "./chat.scss";
import { alluserRoute,host } from '../../utils/APIRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Contacts from '../../components/contacts/Contacts';
import Welcome from '../../components/contacts/Welcome';
import ChatContainer from '../../components/contacts/ChatContainer';
import {io} from "socket.io-client";
// import ChatInput from '../../components/contacts/ChatInput';

const Chat = () => {
  const socket =useRef();
  const navigate=useNavigate();
  const[contacts,setContacts]=useState([]);
  const [currentuser,setCurrentuser]=useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  // const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate("/login");
      } else {
        setCurrentuser(await JSON.parse(localStorage.getItem("chat-app-user")));
      }
    };
  
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentuser) {
        if (currentuser.isAvtarImageSet) {
          const data = await axios.get(`${alluserRoute}/${currentuser._id}`);
          setContacts(data.data);
          console.log(data.data);
        } else {
          navigate("/avtar");
        }
      }
    };
  
    fetchContacts();
  }, [currentuser, navigate]);
  useEffect(()=>{
    socket.current=io(host);
    // socket.current.emit("add-user",currentuser._id);
    if (currentuser) {
      socket.current.emit("add-user", currentuser._id);
    }

    return () => {
      // Cleanup socket connection when component unmounts
      socket.current.disconnect();
    };

  },[currentuser])
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <div className='chat'>
      <div className="chat_container">
        <Contacts contacts={contacts} changeChat={handleChatChange}/>
        {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} currentuser={currentuser} socket={socket}/>
          )}
      </div>

    </div>
  )
}

export default Chat