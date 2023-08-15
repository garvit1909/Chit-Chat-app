import React, { useEffect, useState } from 'react'
import './box.css'
import { Box,Button,Stack,Text, useToast } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import GroupChatModal from '../combine/GroupChatModal'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from '../combine/ChatLoading'
import { getSender } from '../../config2/chatLogic'
const ChatBox = ({fetchAgain}) => {
  const[loggedUser,setLoggedUser]=useState();
   const {user,selectedChat,setSelectedChat,chats,setChats}=ChatState();
   const toast=useToast();

   const fetchChats= async()=>{
    try {
      const config={
        headers:{
          Authorization: `Bearer ${user.token}`
        },
      };

      const {data} = await axios.get('/api/chat',config);
  setChats(data);

    } catch (error) {
      toast({ 
          title: 'Error Occured',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom-left',
        });
        
    }
   };

   useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
   },[fetchAgain]);



  return (
      <Box className='chatbox'  d={{base: selectedChat ?"none":"flex", md:"flex"}}
      flexDir='column'
      alignItems='center'>
        <Box pb={3}
        d='flex'
        px={3}
        w='100%'
        justifyContent='space-between'
        alignItems='center'
        fontSize='40px'
        color='white'
        fontWeight='500'
        paddingTop='20px'
        borderBottom='1px'
        borderColor='rgb(36,36,36)'
        top='0px'
        >
    
      Messages...<sup><i  class="fa fa-bell" aria-hidden="true"></i></sup>
    {/* <Button  top='0px' fontSize='15px' marginLeft='50px'  width='40px'><i  class="fa fa-bell" aria-hidden="true"></i></Button>  */}
    
  <GroupChatModal>
         <Button
         d='flex'
         marginTop='10px'
         marginBottom='10px'
         backgroundColor='white'
         color='black'
         marginLeft='50px'
         fontSize={{base:"17px", md:"10px", lg:"17px"}}
         rightIcon={<AddIcon/>}
         >New Group Chat </Button>
         </GroupChatModal>
      </Box>
      <Box
      d="flex"
      flexDirection='coloumn'
      p={3}
      w="100%"
      h="100%"
      // overflowY="auto"
      >
         { chats?
          (
<Stack overflowY="scroll">
{chats.map((chat)=>(
  <Box
  onClick={()=>setSelectedChat(chat )}
  cursor='pointer'
  bg={selectedChat===chat?  "rgba(236, 90, 11, 0.874)":"rgba(25, 24, 24, 0.4)"}
  color={selectedChat===chat? "black": "white"}
  px={3}
  width='260px'
  marginTop='12px'
  marginLeft='5px'
  fontWeight='500'
  fontSize='15px'
  py={2}
  borderRadius='10px'
  textAlign='center'
  paddingLeft='25px'
  key={chat._id}
  >
    <Text><i class="fa fa-arrow-right" aria-hidden="true"></i> {!chat.isGroupChat? getSender(loggedUser,chat.users):chat.chatName}</Text>
  </Box>
)
)}
</Stack>
          ):(
<ChatLoading/>
          )
         }
      </Box>
      </Box>
  
  )
}

export default ChatBox
