// using express , create sever

// 1: import express
const express = require('express')

//import data services
const dataService = require('./services/data.service')
// import cors
const cors = require('cors')
// import jsonwebtoken
const jwt = require('jsonwebtoken')


// 2: create a server app using express

const app = express()

//using cors define origin to server app
app.use(cors({
  origin:['http://localhost:4200']
}))

// 3: set up port for server app
// to parse json data
app.use(express.json())

app.listen(3000,()=>{
    console.log('server start at port 3000');
})
 // appplication specific middleware

 const appMiddleWare = (req,res,next)=>{
  console.log('this is application specific middleware');
  next()
 }

 app.use(appMiddleWare)
//router specific middleware
//token validation

const jwtMiddleWare = (req,res,next)=>{
  console.log('inside router specific middleware');

  //get token from request header x-access-token key
  let token = req.headers['x-access-token']
  
try{
  let data = jwt.verify(token,'superkey1234')
  console.log(data);
  req.currentAcno = data.currentAcno
  next()
}
catch{
  res.status(404).json({
    status:false,
    message:"Authentication failed....please Log In......"
  });
}
};


//http request 
// app.get('/',(req,res)=>{
//   res.send("GET method")
// })

// app.post('/',(req,res)=>{
// res.send("get post")
// })

// app.patch('/',(req,res)=>{
//     res.send("get patch")
// })

// app.put('/',(req,res)=>{
// res.send("get put")
//  })

// app.delete('/',(req,res)=>{
// res.send("get delete")
// })   

//http request -rest api bank api

//1:login api
app.post('/login',(req,res)=>{
  console.log('inside login function');
  console.log(req.body);
  dataService.login(req.body.acno,req.body.pswd)
  .then((result)=>{
    res.status(result.statusCode).json(result)
  })
     
})

app.post('/register',(req,res)=>{
  console.log('inside register function');
  console.log(req.body);
  dataService.register(req.body.acno,req.body.pswd,req.body.uname)
  .then((result)=>{
    res.status(result.statusCode).json(result)
  })
     
})

app.post('/deposit',jwtMiddleWare,(req,res)=>{
  console.log('inside deposit function');
  console.log(req.body);
  dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amount)
  .then((result)=>{
    res.status(result.statusCode).json(result)
  })
     
})


app.post('/withdraw',jwtMiddleWare,(req,res)=>{
  console.log('inside withdraw function');
  console.log(req.body);
  dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amount)
  .then((result)=>{
    res.status(result.statusCode).json(result)
  })
     
})

app.post('/getBalance',jwtMiddleWare,(req,res)=>{
  console.log('inside getbalance function');
  console.log(req.body);
  dataService.getBalance(req.body.acno)
  .then((result)=>{
    res.status(result.statusCode).json(result)
  })
     
})

app.post('/gettransaction',jwtMiddleWare,(req,res)=>{
  console.log('inside transaction function');
  console.log(req.body);
  dataService.gettransaction(req.body.acno)
  .then((result)=>{
    res.status(result.statusCode).json(result)
  })
     
})

app.delete('/deleteAccount/:acno',jwtMiddleWare,(req,res)=>{
  console.log('inside deleteAccount function');
  dataService.deleteAccount(req.params.acno)
  .then((result)=>{
    res.status(result.statusCode).json(result)
  })
     
})












