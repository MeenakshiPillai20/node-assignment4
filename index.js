const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CONSTANTS = require("./config/constant");
const userdata = require('./public/data.json')
const path = require("path")
const fs = require("fs")

const app = express();

app.use(bodyParser.json());

var encoder = bodyParser.urlencoded();

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/register.html'))
})

const dirpath = path.join(__dirname,'public')
const filepath = `${dirpath}/data.json`
// // fs.writeFileSync(filepath,"")
const file = fs.readFileSync(filepath)
const words = JSON.parse(file);
// console.log(words)


app.post('/register',encoder,function(req,res){

    const data = req.body;
    let fileData = []; 
    console.log("Regististering the user");
    console.log("Received user details => ",data);
    const file = fs.readFileSync(filepath)
    const words = JSON.parse(file);

   
    // fileData.push(data)
    // fileData.push(words)
    // console.log(fileData)
    // fs.readFileSync(filepath,function(err,data){
    //   if (err){
    //     console.log("error")
    //  }
    //  if (data && data.length > 0){
    //   fileData = data;
    //   fileData.push(data)
    //   console.log("file..........................",fileData)
    //  }
    //})
    // var newData = JSON.stringify(data,null,5)
  //   fs.writeFile('data.json',JSON.stringify(data),function(err){
  //     console.log("error")
  // }) 
  // fs.writeFileSync(filepath, JSON.stringify(fileData))
  fs.writeFileSync(filepath, JSON.stringify(data))
              // fs.appendFile(filepath,data)
              // fs.appendFileSync(filepath,JSON.parse(data))

    const password = data.password;
    const roundsOfSalt = 10;
    bcrypt.hash(password,roundsOfSalt,function(err,hashedPassword){
        if(err){
          console.log(err)
          res.status(500).sendFile(path.join(__dirname + '/public/error.html'))
        }
        else{
          console.log("Here is a hashed password =>",hashedPassword);
          bcrypt.compare(password, hashedPassword, function(err,result){
            if(err){
                console.log(err)
            }
            console.log("hashed password maches result =>",result)

           
            res.status(200).sendFile(path.join(__dirname + '/public/success.html'))
          })
        }
      })

      
})

app.post('/login',encoder,function(req,res,next){

    const loginData = req.body;
    console.log("User logging in");
    if((loginData.username === userdata.username) && (loginData.password === userdata.password)){
        console.log("Received login data =>", loginData);
        const jwtToken = jwt.sign(loginData, CONSTANTS.SECRET_KEY);
       
        res.status(200).sendFile(path.join(__dirname + '/public/main.html'))
        // res.render(loginPath, { token: jwtToken});
    }
    else{
        res.status(400).send({message: "Invalid parameters in the request body"});
    }
})

// app.get('/login',function(req,res){
//     console.log("Hitting student page")
//     const token = req.headers["authorization"].split(" ")[1]
//     const SECRET_KEY = "secretKey@123"; 
//     const decoded = jwt.verify(token, SECRET_KEY)
//     console.log("this is decoded",decoded)
//     // const sid = req.query.id
//     // const data = studentData(sid);
//     res.send(decoded)
// })

app.listen(4000,function(){
    console.log("Server is started at port 4000 : http://localhost:4000/register.html")
});