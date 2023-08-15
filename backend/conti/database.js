const mongoose=require("mongoose");

const  connecti=async()=>{
  try {
     const con=await mongoose.connect(process.env.MONGO_URI,{
     });
     console.log(`mongo connected:${con.connection.host}`);
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit();
  }
}
module.exports=connecti;