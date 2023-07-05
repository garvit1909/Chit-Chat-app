const express=require("express");
const dotenv=require("dotenv")
const {chats}=require("./data/data");
const connecti = require("./conti/database");
const userRouter=require("./routes/userRouter");
const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");
const {notFound,errorHandler}=require("./errorMiddle/error"); 
const app=express();
dotenv.config();
connecti();

app.use(express.json()); 



app.get('/', function(req,res){
    res.send("this is my api successfully")
})



app.use('/api/user',userRouter);
app.use('/api/chat',chatRoutes);
app.use('/api/message', messageRoutes);


app.use(notFound);
app.use(errorHandler);
// app.get('/chats/api',function(req,res){
//   res.send(chats);
// })
// app.get('/chats/api/:id',(req,res)=>{
//   // console.log(req.params.id);
//   const singleChat=chats.find((c)=>c._id===req.params.id);
//   res.send(singleChat);
// })

const PORT= process.env.PORT || 5000
const server = app.listen(PORT,console.log(`server started on port ${PORT}`));


const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5000",
    // credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
 socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id)
    socket.emit("connected");});

    socket.on("join chat",(room)=>{
      socket.join(room);
      console.log("User joined Room"+ room);
    });

    socket.on('typing',(room)=>socket.in(room).emit("typing"));
    socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"));
 socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup",()=>{
    console.log("user disconnected");
    socket.leave(userData._id);
  });

 });