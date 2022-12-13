//import model Account
const db = require('./db')

//import jsonwebtoken
const jwt = require('jsonwebtoken')
// login function

const login = (acno,pswd)=>{
    //check acno and pswd is presend in mongo db
    // asynchronuse function call are resolved - promise
     return db.Account.findOne({
        acno,
        password:pswd
    }).then((result)=>{
        if(result){
            //acno and pswd is present in db
            console.log('login successfully');
            //current acno
            let currentAcno = acno

          //generating token

          const token = jwt.sign({
            currentAcno:acno
          },'superkey1234')

            return{
                status:true,
                message:'login successfull',
                username:result.username,
                statusCode:200,
                token,
                currentAcno
            }
        }
        else{
            console.log('invalid account / password');
            return{
                status:false,
                message:'invalid account / password',
                statusCode:404
            }
        }
    })
    
}
// register


const register = (acno,pswd,uname)=>{
    //check acno and pswd is presend in mongo db
    // asynchronuse function call are resolved - promise
     return db.Account.findOne({
        acno,
        
    }).then((result)=>{
        if(result){
            //acno and pswd is present in db
            console.log('alredy register');
            return{
                status:false,
                message:'Accound alredy exist... please login',
                statusCode:404
            }
        }
        else{
            console.log('register successfull');
           let newAccount = new db.Account({
            acno:acno,
            password:pswd,
            username:uname,
            balance:0,
            transaction:[]
           })
           newAccount.save()
           return{
            status:true,
            message:'Register successfull',
            statusCode:200
        }

        }
    })
    
}

//deposit

const deposit = (req,acno,pswd,amount)=>{
// convert string amound to number
    let amt = Number(amount)
    return db.Account.findOne({
        acno,
        password:pswd
    }).then((result)=>{
        if(result){

            if(req.currentAcno!=acno){

                return{
                    status:false,
                    message:'operation denied... Allowed only own account transaction...',
                    statusCode:404
                }

            }
           // acno and pswd is present in db
           console.log('login successfully');
           result.balance += amt
           result.transaction.push({
            type:"CREDIT",
            amount:amt
           })
           result.save()
            return{
                status:true,
                message:`${amount} deposited succesfully`,
                statusCode:200
            }
        }
        else{
            console.log('invalid account / password');
            return{
                status:false,
                message:'invalid account / password',
                statusCode:404
            }
        }
    })
      
    
}
//withdraw

const withdraw = (req,acno,pswd,amount)=>{
    console.log('inside withdraw function');
    // convert string amound to number
        let amt = Number(amount)
        return db.Account.findOne({
            acno,
            password:pswd
        }).then((result)=>{
            if(result){
    
                if(req.currentAcno!=acno){
    
                    return{
                        status:false,
                        message:'operation denied... Allowed only own account transaction...',
                        statusCode:404
                    }
    
                }
               // acno and pswd is present in db
              // console.log('login successfully');


              //check sufficient balance
              if(result.balance < amt){
                return{
                    status:false,
                    message:'transaction failed... insufficient balance',
                    statusCode:404
                }

              }
              //perform withdraw
               result.balance -= amt
               result.transaction.push({
                type:"DEBIT",
                amount:amt
               })
               result.save()
                return{
                    status:true,
                    message:`${amount} debitted succesfully`,
                    statusCode:200
                }
            }
            else{
                console.log('invalid account / password');
                return{
                    status:false,
                    message:'invalid account / password',
                    statusCode:404
                }
            }
        })
          
        
    }
    //get balance

    const getBalance=(acno)=>{
        return db.Account.findOne({
            acno
        }).then(
            (result)=>{
                if(result){
                    let balance = result.balance

                    return{
                        status:true,
                        statusCode:200,
                        message:`Your current balance is : ${balance}`
                    }
                }

                else{

                    return{
                        status:false,
                        statusCode:404,
                        message:`invalied accound number`
                    }

                }
            }
        )
    }

    const gettransaction=(acno)=>{
        return db.Account.findOne({
            acno
        }).then(
            (result)=>{
                if(result){
                   // let balance = result.balance

                    return{
                        status:true,
                        statusCode:200,
                        transaction:result.transaction
                    }
                }

                else{

                    return{
                        status:false,
                        statusCode:404,
                        message:`invalied accound number`
                    }

                }
            }
        )
    }
    
    //delete account
     const deleteAccount = (acno)=>{
        return db.Account.deleteOne({
            acno
        }).then((result)=>{
            if(result){
                return{
                    status:true,
                    statusCode:200,
                    message:'Account delete successfully'
                }
            }
            else{
                return{
                    status:true,
                    statusCode:200,
                    message:'Invalid Account Number'
                } 
            }
        })
     }
    




module.exports = {
    login,
    register,
    deposit,
    withdraw,
    getBalance,
    gettransaction,
    deleteAccount
    
}