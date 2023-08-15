import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import ChatBox from "../component/combine/ChatBox";
import Mychats from "../component/combine/Mychats";
import  MessageBox from '../component/combine/MessageBox';
import { useState } from "react";
const Chatpage=()=>{
 const {user} = ChatState();
 const [fetchAgain,setFetchAgain]=useState(false);

 return(

    <div >  
      <Box  display='flex' flexDirection='row'>
        {user && <Mychats/>}
    
      {user && <MessageBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
       {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
 )

};

export default Chatpage;
