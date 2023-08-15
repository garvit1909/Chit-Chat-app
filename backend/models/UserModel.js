 const mongoose = require("mongoose");
  const bcrypt=require("bcryptjs");

 const userSchema=mongoose.Schema({
    name:{type:"String",required:true},
    email:{type:"String",required:true ,unique:true},
    password:{type:"String",required:true},
    pic:{type:"String",
        required:true,
        default:"https://www.dpforwhatsapp.in/img/no-dp-images/7.webp"},
    
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
   },
    {
 timestamp:true,
    }
 );
userSchema.methods.matchPassword=async function(enterPassword){
   return await bcrypt.compare(enterPassword,this.password);
}
 userSchema.pre('save', async function(next){
  if(!this.isModified){
   next();
  }
  const set=await bcrypt.genSalt(8);
  this.password=await bcrypt.hash(this.password,set);
 });
const User=mongoose.model("User",userSchema);
module.exports = User;