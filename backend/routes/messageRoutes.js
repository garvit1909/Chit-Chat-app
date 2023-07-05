const express= require("express");
const { protect } = require("../errorMiddle/authmiddle");
 const {sendMessage} = require("../control/messageControl");
 const {allMessage} =require("../control/messageControl");
const router = express.Router()



router.route('/').post(protect,sendMessage)
router.route("/:chatId").get(protect,allMessage)



module.exports = router;

