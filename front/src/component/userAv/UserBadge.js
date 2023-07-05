import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'
import { Box } from '@chakra-ui/react'

const UserBadge = ({user,handleFunction}) => {
  return (
    <Box
    display="inline"
    px={2}
    py={1}
    marginRight="10px"
    marginBottom="10px"
fontSize={12}
backgroundColor='red'
color='white'
cursor="pointer"
width="120px"
borderRadius="5px"

onClick={handleFunction}
    >
{user.name}
<CloseIcon  right="0px" pl={1}/>
    </Box>
  )
}

export default UserBadge
