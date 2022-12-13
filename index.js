 require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken") 
const port = process.env.PORT

const connect = require("./config/db")
const {userModel} = require("./model/user.model")
const {Authentication} = require("./Auth/Authentication ")
const app = express()
app.use(express.json())
app.use(cors())
app.use(authenticate)
app.use("/notes", notesRouter)


app.get("/",(req,res)=>{
    res.send("hello")
})

app.post("/signup",async(req,res)=>{
    const {email,password} =req.body

    bcrypt.hash(password, 8, async function(err, hash) {
        const user = new userModel({email,password:hash})
        await user.save()
        res.send("Sign in Sucessfull")
    });
   
})
// Authentication()
app.post("/login",async(req,res)=>{
    const {email,password} =req.body
   
    const user = await userModel.find({email})
   if(user.length>0){
    const h_pass = user[0].password
    bcrypt.compare(password, h_pass, function(err, result) {
       if(result){
        const token = jwt.sign({ "userId": user[0]._id }, 'shhhhh')
        res.send(`Log in sucessFull:${token}`)
       }
       else{
        res.send("Login failed")
       }
    });
   }
   else{
     res.send("User does not exist")
   }

   

   
})

app.listen(port,async()=>{
    await connect()
    console.log("running")
})