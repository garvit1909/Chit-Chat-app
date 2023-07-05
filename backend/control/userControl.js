const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generateToken = require("../conti/token");
// const { options } = require("../routes/userRouter");

 
// for sign up
const entry = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter All The Details");
  }

  const exists = await User.findOne({ email });

  if (exists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Some Error Occurred, Please Try Again");
  }
});


// for login
const Auth=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
  
    if (!email || !password) {
    res.status(400);
    throw new Error("Please Enter All The Details");
  }

  const user= await User.findOne({email});

  if(user && (await  user.matchPassword(password))){
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
  } );}
  else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

// for all users ? search =charanjot, this search query is used to replace the geet/post function. it belongs to mongo db query
 const allUser =asyncHandler(async(req,res)=>{
      const keyword=req.query.search
      ?{
         $or:[
        {name:{ $regex:req.query.search, $options :  "i"}},
        {email:{ $regex:req.query.search , $options: "i"}},
         ],
      }
      :{};
    const users= await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users); 
 });

module.exports = {entry,Auth,allUser};

