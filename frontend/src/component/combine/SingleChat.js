import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box,Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull } from '../../config2/chatLogic';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import './message.css';
import UpdateGroup from './updateGroup';
import ScrollableChat from '../ScrollableChat';
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000"; 
var socket, selectedChatCompare;
const SingleChat = ({fetchAgain, setFetchAgain}) => {
       
  const [loading,setLoading]=useState(false);
  const [messages,setMessages]=useState([]);
  const [newMessage,setNewMessage]=useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

 const toast=useToast();

  

  const {user,selectedChat, setSelectedChat}=ChatState()

const fetchMessage=async()=>{
    if(!selectedChat) return;

    try {
         const config={
        headers:{
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
       const {data} = await axios.get(`/api/message/${selectedChat._id}`,config);
    
    setMessages(data);
    setLoading(false);
    socket.emit("join chat", selectedChat._id);
  }
     catch (error) {
     toast({ 
          title: 'Error Occured',
          description:"failed to load message",
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom-left',
        });

      }
    }; 

      const sendMessage=async()=>{
      if(newMessage){
        socket.emit("stop typing",selectedChat._id)
     try {
         const config={
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post("/api/message",{
        content:newMessage,
        chatId:selectedChat._id,
      },
      config);
      console.log(data);
    socket.emit("new message",data);
      setMessages([...messages,data]);
        
     } catch (error) {
      toast({ 
          title: 'Error Occured',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom-left',
        });
        return;
      }  
    }}

     useEffect(() => {
    socket = io(ENDPOINT);
        socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on('typing',()=>setIsTyping(true))
    socket.on("stop typing",()=>setIsTyping(false));
     },[]);



const typingHandler=(e)=>{
setNewMessage(e.target.value);

 if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
      

    
    useEffect(()=>{
fetchMessage();
selectedChatCompare=selectedChat;
    },[selectedChat]);


      useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) 
      {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessageRecieved, ...notification]);
        //   setFetchAgain(!fetchAgain);
        // }
      }
      else {
        setMessages([...messages, newMessageRecieved]);
      }});
    });
   

     
  return (
    <>
    {selectedChat?(
      <>
      <Text
      fontSize={{base:"28px" , md:"30px"}}
      w='100%'
      fontFamily='work sans'
      justifyContent='space-between'
      d='flex'
      px={2}
      pb={3}
      color='white'
      backgroundColor='black'
      height='80px'
      paddingTop="20px"
      paddingLeft="20px"
    >  

      < IconButton
      d={{base:"flex" , md:"30px"}}
      marginRight="40px"
      icon={<ArrowBackIcon/>}
      onClick={()=>setSelectedChat("")}/>

      {!selectedChat.isGroupChat ?(
        <>
        {getSender(user,selectedChat.users)}
        <ProfileModal  user={getSenderFull(user,selectedChat.users)}/>
        </>
      ):(
        <>{selectedChat.chatName}
        <UpdateGroup
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        fetchMessage={fetchMessage}/>
        {
}

</>
      )}
      </Text>
<Box
d="flex"
flexDir="column"
// bg='rgb(35,35,35,0.6)'
h="540px"
width="900px"
overflowY="auto"
borderRadius="1g"
> 


   {loading ? (
    <Spinner
  size="xl"
  color="white"
  w={20}
  display="flex"
  marginLeft="400px"
  marginTop="250px"
  h={20}

   />
  ):(
  
       <div className='message'>
      <ScrollableChat  messages={messages}/>
    </div>
)}  
</Box>

 <FormControl position="fixed" bottom={0}  isRequired>
  <Box backgroundColor="rgb(0,0,0)"  width="900px" height="130px">
    {istyping?
    (<div color="white">loading...</div>
    ):(
    <></>
    )}
<Input  variant="filled"
color="white"
bg="rgb(36,36,36)"
fontSize="20px"
width="790px"
marginTop="30px"
height="50px"
placeholder='Enter a Message....'
marginLeft="15px"
marginRight="15px"
value={newMessage}
onChange={typingHandler}/>
     <Button onClick={sendMessage}>
  <i class="fa fa-paper-plane" height="70px" color='white' aria-hidden="true"></i>
     </Button>
     </Box>
 </FormControl>

      </>
   ): (
      <Box d='flex' alignItems='center' justifyContent='center' h='100%'>
        <Text fontSize='38px'  color="white" paddingLeft='170px' paddingTop='300px' >
Click on a user to start chatting....
        </Text>
      </Box>
    )}
    </>
  )
   }

export default SingleChat


// import { FormControl } from "@chakra-ui/form-control";
// import { Input } from "@chakra-ui/input";
// import { Box, Text } from "@chakra-ui/layout";
// import "./message.css";
// import { Button, IconButton, Spinner, useToast } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { ArrowBackIcon } from "@chakra-ui/icons";
// import ProfileModal from "./ProfileModal";
// import ScrollableChat from "../ScrollableChat";
// // import Lottie from "react-lottie";
// // import animationData from "../animations/typing.json";

// import io from "socket.io-client";
// import { ChatState } from "../../Context/ChatProvider";
// import { getSender, getSenderFull } from "../../config2/chatLogic";
// import UpdateGroup from "./updateGroup";
// const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
// var socket, selectedChatCompare;

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newMessage, setNewMessage] = useState("");
//   const [socketConnected, setSocketConnected] = useState(false);
//   // const [typing, setTyping] = useState(false);
//   // const [istyping, setIsTyping] = useState(false);
//   const toast = useToast();

//   // const defaultOptions = {
//   //   loop: true,
//   //   autoplay: true,
//   //   animationData: animationData,
//   //   rendererSettings: {
//   //     preserveAspectRatio: "xMidYMid slice",
//   //   },
//   // };
//   const { selectedChat, setSelectedChat, user } =
//     ChatState();

//   const fetchMessages = async () => {
//     if (!selectedChat) return;

//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       setLoading(true);

//       const { data } = await axios.get(
//         `/api/message/${selectedChat._id}`,
//         config
//       );
//       setMessages(data);
//       setLoading(false);

//       socket.emit("join chat", selectedChat._id);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the Messages",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     }
//   };

//   const sendMessage = async () => {
//     if (newMessage) {
//       // socket.emit("stop typing", selectedChat._id);
//       try {
//         const config = {
//           headers: {
//             "Content-type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         setNewMessage("");
//         const { data } = await axios.post(
//           "/api/message",
//           {
//             content: newMessage,
//             chatId: selectedChat,
//           },
//           config
//         );
//         socket.emit("new message", data);
//         setMessages([...messages, data]);
//       } catch (error) {
//         toast({
//           title: "Error Occured!",
//           description: "Failed to send the Message",
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//           position: "bottom",
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     socket = io(ENDPOINT);
//     socket.emit("setup", user);
//     socket.on("connected", () => setSocketConnected(true));
//     // socket.on("typing", () => setIsTyping(true));
//     // socket.on("stop typing", () => setIsTyping(false));

//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     fetchMessages();

//     // selectedChatCompare = selectedChat;
//     // eslint-disable-next-line
//   }, [selectedChat]);

//   useEffect(() => {
//     socket.on("message recieved", (newMessageRecieved) => {
//       if (
//         !selectedChatCompare || // if chat is not selected or doesn't match current chat
//         selectedChatCompare._id !== newMessageRecieved.chat._id
//       ) {
//         // if (!notification.includes(newMessageRecieved)) {
//         //   setNotification([newMessageRecieved, ...notification]);
//         //   setFetchAgain(!fetchAgain);
//         // }
//       } else {
//         setMessages([...messages, newMessageRecieved]);
//       }
//     });
//   });

//   const typingHandler = (e) => {
//     setNewMessage(e.target.value);
//   }
//   //   if (!socketConnected) return;

//   //   if (!typing) {
//   //     setTyping(true);
//   //     socket.emit("typing", selectedChat._id);
//   //   }
//   //   let lastTypingTime = new Date().getTime();
//   //   var timerLength = 3000;
//   //   setTimeout(() => {
//   //     var timeNow = new Date().getTime();
//   //     var timeDiff = timeNow - lastTypingTime;
//   //     if (timeDiff >= timerLength && typing) {
//   //       socket.emit("stop typing", selectedChat._id);
//   //       setTyping(false);
//   //     }
//   //   }, timerLength);
//   // };

//   return (
//     <>
//       {selectedChat ? (
//         <>
//           <Text
//             fontSize={{ base: "28px", md: "30px" }}
//             pb={3}
//             px={2}
//             w="100%"
//             fontFamily="Work sans"
//             d="flex"
//             justifyContent={{ base: "space-between" }}
//             alignItems="center"
//           >
//             <IconButton
//               d={{ base: "flex", md: "none" }}
//               icon={<ArrowBackIcon />}
//               onClick={() => setSelectedChat("")}
//             />
//             {messages &&
//               (!selectedChat.isGroupChat ? (
//                 <>
//                   {getSender(user, selectedChat.users)}
//                   <ProfileModal
//                     user={getSenderFull(user, selectedChat.users)}
//                   />
//                 </>
//               ) : (
//                 <>
//                   {selectedChat.chatName.toUpperCase()}
//                   <UpdateGroup
//                     fetchMessages={fetchMessages}
//                     fetchAgain={fetchAgain}
//                     setFetchAgain={setFetchAgain}
//                   />
//                 </>
//               ))}
//           </Text>
//           <Box
//             d="flex"
//             flexDir="column"
//             justifyContent="flex-end"
//             p={3}
//             w="100%"
//             h="100%"
//             borderRadius="lg"
//             overflowY="hidden"
//           >
//             {loading ? (
//               <Spinner
//                 size="xl"
//                 w={20}
//                 h={20}
//                 alignSelf="center"
//                 margin="auto"
//               />
//             ) : (
//               <div className="messages">
//                 <ScrollableChat messages={messages} />
//               </div>
//             )}

//             <FormControl
//               id="first-name"
//               isRequired
//               mt={3}
//             >
//               {/* {istyping ? (
//                 <div>
//                   <Lottie
//                     options={defaultOptions}
//                     // height={50}
//                     width={70}
//                     style={{ marginBottom: 15, marginLeft: 0 }}
//                   />
//                 </div>
//               ) : (
//                 <></> */}
//               {/* )} */}
//               <Input
//                 variant="filled"
//                 bg="#E0E0E0"
//                 placeholder="Enter a message.."
//                 value={newMessage}
//                 onChange={typingHandler}
//               />
//               <Button onClick={sendMessage}>
//                 Search
//               </Button>
//             </FormControl>
//           </Box>
//         </>
//       ) : (
//         // to get socket.io on same page
//         <Box d="flex" alignItems="center" justifyContent="center" h="100%">
//           <Text fontSize="3xl" pb={3} fontFamily="Work sans">
//             Click on a user to start chatting
//           </Text>
//         </Box>
//       )}
//     </>
//   );
// };

// export default SingleChat;