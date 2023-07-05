const express=require('express');
const {protect}=require('../errorMiddle/authmiddle');
const route=express.Router();
const {accessChat,fetchChat,createGroupChat,renameGroupChat,addGroupChat,removeGroupChat} =require('../control/chatControl');

route.route('/').post(protect,accessChat);
route.route('/').get(protect,fetchChat);
route.route('/group').post(protect,createGroupChat);
route.route('/grprename').put(protect,renameGroupChat);
route.route('/grpremove').put(protect,removeGroupChat);
route.route('/grpadd').put(protect,addGroupChat);

module.exports=route;