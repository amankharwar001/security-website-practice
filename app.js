//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose")
const encrypt=require("mongoose-encryption")

const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect('mongodb://127.0.0.1:27017/userDB').then(()=>{
    console.log("Database is now connected...")
}).catch((err)=>{
    console.log("Database is not connected...",err)
});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

const secret=process.env.SECRET;

userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]})

const User=mongoose.model("User",userSchema)


app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const newUser=new User({
        email:username,
        password:password
    })
    newUser.save().then((data)=>{
        console.log(data)
        res.render("secrets")
    }).catch(()=>{
        console.log("register user data not store ")
    })
})

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username}).then((founditem)=>{
        if(founditem){
            if(founditem.password===password){
                res.render("secrets")
            }
        }else{
            console.log("data not found")
        }
    }).catch((err)=>{
        console.log("user not login",err)
    })
})




app.listen(3001,()=>{
    console.log("your port is starting at 3001")
})