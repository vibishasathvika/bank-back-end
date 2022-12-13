// coonection between server and mongo db

//import mongoose

const mongoose = require('mongoose')
 //2: define the connection string  and connect db with node

 mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('mongodb connect successfully');
 })

 //3: create a model 
   const Account = mongoose.model('Account',{
    acno:Number,
    password:String,
    username:String,
    balance:Number,
    transaction:[]
   })

   //4: export model 
   module.exports = {
      Account
   }
