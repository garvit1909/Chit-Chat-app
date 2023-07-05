 const  asyncHandler=require('express-async-handler');
const Chat =require('../models/chatModel');
const User=require('../models/UserModel');
//  access chat 
 const accessChat  = asyncHandler(async(req,res)=>{
    const {userId}=req.body;
    if(!userId){
          console.log("UserId param does not exist");
   return res.sendStatus(400);
    }

    let isChat= await Chat.find({
      isGroupChat:false,
      $and:[
         {users:{$elemMatch:{$eq:req.user._id}}},
         {users:{$elemMatch:{$eq:userId}}},
      ],
    }).populate("users","-password").populate("latestMessage");

    isChat=await User.populate(isChat,{
      path:"latestMessage.sender",
      select:"name pic email",
    });

    if(isChat.length>0){
      res.send(isChat[0]);
    }
    else{
      let Data={
        chatName:"sender",
        isGroupChat:false,
        users:[req.user._id,userId],
      };
      try {
        const createChat =await Chat.create(Data);

        const fullChat= await Chat.findOne({_id:createChat._id}).populate(
          "users",
          "-password"
        );
        res.status(200).send(fullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
    
 });

 //fetch control

 const fetchChat = asyncHandler(async(req,res)=>{
  try {
    Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
    .populate("users","-password")
    .populate("groupAdmin","-password")
    .populate("latestMessage")
    .sort({updatedAt:-1})
    .then(async (results)=>{
      results=await User.populate(results,{
              path:"latestMessage.sender",
      select:"name pic email",
      });
      res.status(200).send(results);
    })
  } catch (error) {} 
 });
 //create group chat
 const createGroupChat= asyncHandler(async(req,res)=>{
 if(!req.body.users || !req.body.name ){
  return res.status(400).send( {message: "please fill the details"})
 }
  let users= JSON.parse(req.body.users);

  if(users.length<2){
    return res.status(200).send({mssage:"Atleast two Users are required to form Group Chat"});
  }

  users.push(req.user);

  try {
     const groupChat=await Chat.create({
      chatName:req.body.name,
      users:users,
      isGroupChat:true,
      groupAdmin:req.user,
     });

      const fullGroupChat= await Chat.findOne({_id:groupChat._id}).populate(
          "users",
          "-password"
        ).populate("groupAdmin","-password");
        res.status(200).json( fullGroupChat);
    
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
 });

// rename group chat 

const renameGroupChat = asyncHandler(async(req,res)=>{
   
  const {chatId, chatName} = req.body;

  const updatename=await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new:true,
    }
  ) .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatename){
      res.status(404);
      throw new Error("Chat not Found");
    }else{
      res.send(updatename);
    }
});

// add Group Chat

const addGroupChat =asyncHandler(async(req,res)=>{
   const {chatId ,userId}=req.body;

   const add = await Chat.findByIdAndUpdate(chatId,
    {
      $push:{users:userId},
    },
    {
      new:true
    }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

     if(!add){
      res.status(404);
      throw new Error("Chat not Found");
    }else{
      res.json(add);
    }
});

// remove from group chat

const removeGroupChat =asyncHandler(async(req,res)=>{
   const {chatId ,userId}=req.body;

   const remove= await Chat.findByIdAndUpdate(chatId,
    {
      $pull:{users:userId},
    },
    {
      new:true
    }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

     if(!remove){
      res.status(404);
      throw new Error("Chat not Found");
    }else{
      res.json(remove);
    }
});


 module.exports={accessChat,fetchChat,createGroupChat,renameGroupChat,addGroupChat,removeGroupChat};
