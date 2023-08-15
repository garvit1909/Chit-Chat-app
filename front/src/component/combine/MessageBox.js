import React from "react";

import { ChatState } from "../../Context/ChatProvider";
// import SingleChat from "./SingleChat";
import SingleChat from "./SingleChat";
import { Box } from "@chakra-ui/react";

const MessageBox=({fetchAgain,setFetchAgain})=>{
    const {selectedChat} =ChatState();

    return(
        <Box d={{base:selectedChat?"flex" :"none",md:"flex"}}
        // alignItems="center"
        // flexDir="column"
        // p={3}
        // color='gray'
        // fontSize='25px'
        // borderRadius="1g"
        // borderWidth="1px"
        // borderColor='rgb(53,52,52)'
        w={{base:"100%", md:"68%"}}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default MessageBox;