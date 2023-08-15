const express=require('express');
const {entry,Auth,allUser}=require('../control/userControl');
const {protect} =require("../errorMiddle/authmiddle");
const route=express.Router();

route.post('/login',Auth);
route.route('/').post(entry).get(protect,allUser);


module.exports=route;