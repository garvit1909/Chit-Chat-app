const jwt= require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler=require("express-async-handler");

const protect= asyncHandler(async(req,res,next)=>{
 let token;


if(
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
){
    try {
         token=req.headers.authorization.split(" ")[1];
//   the token is bearer token- it comprise of" bearer  fr45g7hhts43" token in thjis Form we have to remove bearer, so we split  
 // decodes token id
 const decoded= jwt.verify(token,process.env.JWT_SECRET);

 req.user=await User.findById(decoded.id).select("-password");

 next();
    } catch (error) {
        res.status(401);
        throw new Error("Not Authorized");
    }
}
if(!token){
 res.status(401);
        throw new Error("Not Authorized token not present");
    }

});
module.exports={protect};