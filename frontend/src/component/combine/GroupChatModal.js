import React, { Children, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  FormControl,
  Input,
} from '@chakra-ui/react'
import UserBadge from '../userAv/UserBadge'
import { useDisclosure } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import { Button } from '@chakra-ui/react';
import  UserList from '../userAv/UserList';
import { Box } from '@chakra-ui/react';

const GroupChatModal = ({children}) => {
     const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName,setGroupChatName]=useState();
  const [selectedUsers,setSelectedUsers] =useState([]);
  const [search,setSearch]=useState("");
  const [loading, setLoading]=useState(false);
  const [searchResult,setSearchResult]=useState([]);

  const toast= useToast();


  const {user,chats,setChats} =ChatState();


  const handleSubmit=async()=>{
    if(!groupChatName || !selectedUsers){
            toast({ 
          title: 'Please fill all the fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'top-left',
        });
        return;
     }
     try {
                 const config={
        headers:{
          Authorization: `Bearer ${user.token}`,
        },}
        const {data} = await axios.post('/api/chat/group',{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((u)=>u._id)),
      },config);

      setChats([data, ...chats]);
      onClose();
     } catch (error) {
        toast({ 
          title: 'Failed to create!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'top-left',
        });
     }
    };
  

  const handleGroup=(usertoAdd)=>{
     if(selectedUsers.includes(usertoAdd)){
      toast({ 
          title: 'User already present',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'top-left',
        });
        return;
     }
     setSelectedUsers([...selectedUsers,usertoAdd])
  };

   const DeleteGroup=(delUser)=>{
  setSelectedUsers(
    selectedUsers.filter((sel)=>sel._id !== delUser._id)
  )
   }

  const handleSearch= async(query)=>{
      setSearch(query);

      if(!query){
        return;
      }
      try {
        setLoading(true)
           const config={
        headers:{
          Authorization: `Bearer ${user.token}`
        },};
        const {data} = await axios.get(`/api/user?search=${search}`,config);
        console.log(data);
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
      }};
  return (
    <>
      <span   onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color="white" backgroundColor="rgb(36,36,36)">
          <ModalHeader fontSize="30px" color="white">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody d='flex' flexDir='column' alignItems='center'>
          <FormControl>
            <Input  placeholder='Chat Name' marginBottom="20px"
            onChange={(e)=>setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
            <Input marginBottom="10PX"  placeholder='Add users eg:Garvit, kinmin, Kushagra'
            onChange={(e)=>handleSearch(e.target.value)}/>
          </FormControl>
<Box w='100%' d='flex' flexWrap='wrap'> 
{selectedUsers.map((u)=>(
  <UserBadge
  key={user._id}
  user={u}
  handleFunction={()=>DeleteGroup(u)}
  />
))}
</Box>

 {loading?(
    <div>loading...</div>)
    :(
    searchResult?.slice(0,4).map((user)=>(
  <UserList
  key={user._id}
  user={user}
  handleFunction={()=>handleGroup(user)}
  />

 ))
    )
   }
          </ModalBody>

          <ModalFooter>
            <Button  onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
  }


export default GroupChatModal
