import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Image, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { Button } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const ProfileModal= ({user,children}) => {
    const {isOpen,onOpen,onClose} =useDisclosure();
  return (
    <>
     {children?(<span onClick={onOpen}>{children}</span>)
    :( <IconButton marginLeft="500px"  borderRadius="50%"
        d={{base:"flex"}}
        icon={<ViewIcon/>}
        onClick={onOpen} />
 ) }
      <Modal  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="rgb(36,36,36)" borderRadius='15px'  zIndex='10'>
          <ModalHeader display="flex" justifyContent="center" fontSize='36px' marginBottom='0px'
          fontFamily='Work sans'  color="white"  > {user.name}</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
        <Image 
        borderRadius='full'
        boxSize='180px'
        src={user.pic}
        alt={user.name}
        marginLeft="100px"
      />
 <Text display="flex" fontSize="20px" justifyContent="center" marginTop='10px' color="gray" textAlign="center"  > {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Close
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
   
  </>
  );
};

export default ProfileModal