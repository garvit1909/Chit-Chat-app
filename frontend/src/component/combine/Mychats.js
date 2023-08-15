import React, { useState } from 'react'
import { Avatar, useToast } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react' 
import { Spinner } from '@chakra-ui/spinner'
import {useHistory} from 'react-router-dom'
import { Input } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import ChatLoading from '../combine/ChatLoading'
import UserList from '../userAv/UserList'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import "./chat.css"
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
// import { Input } from '@chakra-ui/react'
import {Image }from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import axios from 'axios'
import { getSender } from '../../config2/chatLogic'
const Mychats = () => {
  const [search,setSearch]=useState();
  const [loading, setLoading]=useState();
  const [searchResult,setSearchResult]=useState();
  const [loadingChat,setLoadingChat]=useState();


const {user,setSelectedChat,chats,setChats,notification,setNotification}=   ChatState();
  const history=useHistory();
   const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler=()=>{
      localStorage.removeItem('userInfo');
      history.push('/')
  }
 const toast =useToast();
  const handleSearch= async ()=>{
    if(!search){
      toast({ 
          title: 'Please Enter something in search',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'top-left',
        });
        return;
    }
    try {
      setLoading(true)
      const config={
        headers:{
          Authorization: `Bearer ${user.token}`
        },
      };

      const {data} = await axios.get(`/api/user?search=${search}`,config);



      setLoading(false);
      setSearchResult(data);
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
  };

  const accessChat=async (userId)=>{
       try {
        setLoading(true);

        const config={
           headers:{
            'Content-type':'application/json',
          Authorization: `Bearer ${user.token}`
        },
        };
          const {data} = await axios.post('/api/chat',{userId},config);

          if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);
setSelectedChat(data);
setLoadingChat(false);
onClose();

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
  }



  return (
    <div className="chat">
      <Box width='300px' backgroundColor='black'>
  <Image src='https://i.pinimg.com/originals/38/f7/a9/38f7a9744218ea7bb0acd3d0b197b54a.jpg' className='logo' alt='Dan Abramov' /></Box>
  <Tooltip label="Search Users to chat" placement='bottom-end' hasArrow aria-label='A tooltip'>

     <Button className='search' colorScheme='gray' variant=' ' justifyContent='start' onClick={onOpen}> <i class="fa fa-search"   aria-hidden="true"></i>
    <Text d={{base:"none",md:"flex"}} > Search Users...</Text>
     </Button>
     
     </Tooltip>
     <Tooltip label="Contact details of chat users " placement='bottom-end' hasArrow aria-label='A tooltip'>
     <Button className='search call' colorScheme='gray' variant='' justifyContent='start'> <i class="fa fa-phone-square" aria-hidden="true"></i>Phone</Button></Tooltip>
     <Tooltip label="Unread Messages" placement='bottom-end' hasArrow aria-label='A tooltip'>
<Menu>
  <MenuButton   className="search message" fontSize="18px" fontWeight="500"  colorScheme="gray"  variant='' justifyContent='start'>
    <i class="fa fa-book"    aria-hidden="true"></i> Notifications
  </MenuButton>
  <MenuList pl={2}>
    {!notification.length && "No new messages"}
{notification.map(notif=>(
  <MenuItem key={notif._id} onClick={()=>{
    setSelectedChat(notif.chat)
    setNotification(notification.filter((n)=>n!==notif));
  }}>
    {notif.chat.isGroupChat?
    `New Message in ${notif.chat.chatName}`:
    `New message  from ${getSender(user,notif.chat.users)}`}
  </MenuItem>
))}
  </MenuList>
</Menu>
     </Tooltip>
     <Tooltip label="Settings" placement='bottom-end' hasArrow aria-label='A tooltip'>
     <Button className='search  setting' colorScheme='gray' variant='' justifyContent='start'> <i class="fa fa-cog"   aria-hidden="true"></i>Settings</Button>
</Tooltip>
     <Menu>
  <MenuButton display='inline' width='250px' height='70px' marginLeft='20px' marginTop='200px'   as={Button} backgroundColor=' rgb(0,0,0,0.8)' className='menu' color='white' borderRadius='10px'>
    <Box display='flex' >
     <Avatar marginRight='15px'  marginTop='5px' cursor="pointer" size="md" name={user.name} src={user.pic} />
     <Box marginTop='10px'>
    <Text className='userName' > {user.name}</Text>
    <Text className='userEmail'> {user.email}</Text>
    </Box>
    </Box>
  </MenuButton>
  <MenuList>
    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
  <ProfileModal user={user}>
    <MenuItem>My Profile</MenuItem>
</ProfileModal>
  </MenuList>
</Menu>

<Drawer placement='left'  onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay/> 
    <DrawerContent width="400px" backgroundColor="rgb(17,17,17)">
      <DrawerHeader fontSize="30px" color="white" borderBottomWidth="1px" borderBottomColor="black" marginBottom="15px">Search Users</DrawerHeader>
    
    <DrawerBody>
    <Box d='flex' pb={2}>
    <Input color="white" placeholder='Search by name or Email'
    mr={2}
    value={search}
    width="200px"
    onChange={(e)=> setSearch(e.target.value)}/>
    <Button  padding="3px" onClick={handleSearch}>
      Go
    </Button>
   </Box>
   {loading?(
    <ChatLoading/>)
    :(
 searchResult?.map((user)=>(
  <UserList
  key={user._id}
  user={user}
  handleFunction={()=>accessChat(user._id)}
  />

 ))
    )
   }
   
 {loadingChat && <Spinner ml="auto" d="flex"/>}
          </DrawerBody>
        </DrawerContent>  
</Drawer>
    </div> 
  );
};

export default Mychats;
