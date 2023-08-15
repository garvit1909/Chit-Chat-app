import { VStack } from '@chakra-ui/react'
import React, { useState }  from 'react'
import { Input,InputGroup,InputRightElement } from '@chakra-ui/react'
import {Button} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
// import {useHistory} from "react-router-dom"
import { useHistory } from 'react-router-dom'
import axios from 'axios';
const Log = () => {
   const [show,setShow]=useState(false);
  const [email,setEmail]=useState();
const [password,setPassword]=useState();
const [loading,setLoading]=useState(false);

const toast=useToast();
const history=useHistory();

  const handle=() =>setShow(!show);


  const submitHandler=async ()=>{
    setLoading(true);
    if(!email || !password){
      toast({
          title: 'Please fill completely',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false);
        return;
    }
  
    try {
      
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };
      const {data}= await axios.post("/api/user/login",
      {email,password}, config);


     toast({
          title: 'Login Successful',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        localStorage.setItem('userInfo',JSON.stringify(data));
        setLoading(false);
        history.push('/chats');
    } catch (error) {
      toast({
          title: 'Error Occured!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false);
   };
  };
  return (
    <VStack spacing='15px' color='black'>
 <FormControl isRequired>
  <FormLabel>Email address</FormLabel>
  <Input placeholder='Enter Your Email ' type={"email"}
  onChange={(e)=>setEmail(e.target.value)}/>
</FormControl>
 <FormControl isRequired>
  <FormLabel>Password</FormLabel>
   <InputGroup size='md'>
  <Input placeholder='Enter Password ' type={show? "text":"password"} 
  onChange={(e)=>setPassword(e.target.value)}/>
        <InputRightElement width='4.5rem' onClick={handle}>
        <Button h='1.75rem' size='sm'>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>

</FormControl>
<Button colorScheme='red' width='100%' color='white' isLoading={loading} onClick={submitHandler}>Login</Button>
<Button colorScheme='blue' width='100%' color='white' isLoading={loading}  onClick={()=>{
  setEmail("guest@example.com");
  setPassword("123456789");
}}>Get Guest User Credentials</Button>
    </VStack>
  )
};

export default Log;
