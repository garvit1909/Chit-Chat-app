import React, { useState } from 'react'
import { VStack } from '@chakra-ui/react'
import { Input,InputGroup,InputRightElement } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import {useHistory} from 'react-router-dom'
import axios from 'axios';
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import {Button} from '@chakra-ui/react'
const Sign = () => {
  const [show,setShow]=useState(false);
const [name,setName]=useState();
const [email,setEmail]=useState();
const [password,setPassword]=useState();
const [confirmpassword,setConfirmpassword]=useState();
const [pic,setPic]=useState();
const [loading,setLoading]=useState(false);
const toast=useToast();
const history=useHistory();

   const handle=() =>setShow(!show);

   const  postDetails=(pics)=>{
    setLoading(true);
    if(pics===undefined){
  toast({ 
          title: 'Please Select an Image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        return;
    }
    if(pics.type==='image/jpeg' || pics.type==='image/png'){
      const data= new FormData();
      data.append('file',pics);
      data.append('upload_preset','chit-chat');
      data.append('cloud_name','dqgw3l8gc');
     fetch('https://api.cloudinary.com/v1_1/qgw3l8gc/image/upload?upload_preset=chit-chat&api_key=856726838562174',
     {  method:'post',
        body:data,
      }).then((res)=>res.json())
.then((data)=>{
  setPic(data.url.toString());
  console.log(data.url.toString());
  setLoading(false);
})
.catch((err)=>{
  console.log(err);
  setLoading(false);
});  }
    else{
      toast({
          title: 'Please Select an Image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false);
        return;
    }
   };

   const submitHandler=async()=>{
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
      toast({
          title: 'Please Fill All The Details.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false);
        return;
    }
    if(password!==confirmpassword){
      toast({
          title: 'Enter Correct Password',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        return;
    }
    try {
      
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };
      const {data}= await axios.post("/api/user",
      {name,email,password,pic},
      config);
        toast({
          title: 'You Are Signed Up',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        localStorage.setItem('userInfo',JSON.stringify(data));
        setLoading(false);
        history.push('/chats')
    } catch (error) {
      toast({
          title: 'Error Occured!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false);
      
    }
   };
  return (
    <VStack spacing='15px' color='black'>
<FormControl isRequired>
  <FormLabel>Name</FormLabel>
  <Input  placeholder='Enter Your Name'
  onChange={(e)=>setName(e.target.value)}/>
</FormControl>
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
 <FormControl isRequired>
  <FormLabel> Confirm Password</FormLabel>
   <InputGroup size='md'>
  <Input placeholder='Confirm Password ' type={show? "text":"password"} 
  onChange={(e)=>setConfirmpassword(e.target.value)}/>
        <InputRightElement width='4.5rem' onClick={handle}>
        <Button h='1.75rem' size='sm'>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
 </FormControl>
 <FormControl id="pic">
  <FormLabel>Upload Your Picture</FormLabel>
  <Input  type='file'
  accept='image/*'
  paddingTop={1}
  onChange={(e)=>postDetails(e.target.files[0])}/>
</FormControl>
<Button colorScheme='red' width='100%' color='white' onClick={submitHandler}  isLoading={loading}>Sign-Up</Button>
    </VStack>
  )
}

export default Sign;
