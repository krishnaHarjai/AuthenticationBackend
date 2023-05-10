import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.urlencoded({extended:true}));
app.set("view engine" , "ejs")
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017",{
    dbName:"backend",
}).then(()=>{
    console.log("Connected Successfully");
}).catch((err)=>{
    console.log("Can not connect");

})

const clientSchema = new mongoose.Schema({
    name:String,
    email:String,
})

const Client = mongoose.model("Client",clientSchema);

app.use(express.static(path.join(path.resolve(),"public")));


const currdir = path.resolve();

// app.get("/:name",(req,res)=>{
//     const name = req.params.name;
//     res.render("index",{name:name});
// })

app.get("/",(req,res)=>{
    const{token} = req.cookies;
    if(token){
        res.render("logout");
    }else{
        res.render("login");  
    }
})

app.post("/login", async (req,res)=>{
    const {name,email} = req.body;
    const client = await Client.create({name,email})

    res.cookie("token", client._id,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    });
    res.redirect("/")
})

app.get("/logout",(req,res)=>{
    res.cookie("token", null,{
        httpOnly:true,
        expires:new Date(Date.now())
    });
    res.redirect("/");
})

app.listen(2000,()=>{
    console.log("Server running successfully");

})
