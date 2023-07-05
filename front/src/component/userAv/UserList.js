import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
 import { Avatar, Box,Text } from '@chakra-ui/react';
const UserList = ({user,handleFunction} )=> {
    
  return (
    <Box 
    onClick={handleFunction}
    marginTop="10px"
    cursor='pointer'
    bg="rgb(10,10,10)"
    color="white"
    _hover={{
        backgroundColor:'rgba(236, 90, 11, 0.874)',
        color:"black",
        fontWeight:"500",
    }}
    w='100%'
    d='flex'
    alignItems='center'
    px={3}
    py={2}
    mb={2}
    borderRadius='10px'>

    <Avatar
     mr={2}
     size='sm'
     cursor='pointer'
     name={user.name}
     src={user.pic}
    />
<Box>
    <Text>{user.name}</Text>
    <Text fontSize='xs'>
        <b>Email :</b>
 {user.email}
    </Text>
</Box>
    </Box>
  )
}

export default UserList
