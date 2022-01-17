import  express from 'express';
import registerModel from '../db/RegisterSchema.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import multer from 'multer'
const saltRounds = 10
const jwtSecret="asd889asds5656asdas887";
const router = express.Router();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    tls: {
        rejectUnauthorized: false
    },
    auth: {
      user: 'nehadeore160@gmail.com',
      pass: 'nodii@2121'
    }
  });

const DIR = '../frontend/public/images/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null,"user" + '-' + fileName)
    }
});

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log(file, "line 25")
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

//registeration
router.post("/addpost", async (req, res) => {
     req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    registerModel.findOne({email:req.body.email}, (err,data)=>{
        if(err){
            res.json({"err":1, "msg":"Something went wrong in checking data"})
        }
        else if(data== null){
            let ins = new registerModel({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, contact: req.body.contact,  password: req.body.password,gender:req.body.gender})
            ins.save((e) => {
                if (e) {
                    res.json({"err":1, "msg":"Something went wrong in adding data"})
                }
                else {
                    res.json({"err":0, "msg":"New User added"})
                }
            })
        }
       else{   
        res.json({"err":0,"msg":"User already exist"})
       }
    })
})


//login
router.post("/login", (req,res)=>{
    console.log(req.body)
    let hashbcrypt = false
    registerModel.find({}, (err, data)=>{
        if(err){
            console.log(err, "line 38")
        }
        else{
            for(let i=0; i<data.length; i++){
                if(data[i].email === req.body.email){
                    hashbcrypt = bcrypt.compareSync(req.body.password, data[i].password) 
                     if(hashbcrypt){
                         const token = encryptData(data[i]);
                         res.json({"err":0,"msg":"Login Success","token":token})
                         break;
                     } 
                 }
            }
            if(!hashbcrypt){
                res.json({"err":1, "msg":"Email or Password does not Match"})
            }
        }
    })
})

//forget password
router.post("/forgetService", (req,res)=>{
    console.log(req.body) 
    registerModel.findOne({email:req.body.email},(err, data)=>{
        if(err){
            console.log("line 61")
        }
        else if(data== null){
            res.json({"err":1, "msg":"User Not Found"})
        }
        else{
            let otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
             let mailOptions = {
                from: 'nehadeore160@gmail.com',
                to: req.body.email,
                subject: "NeoSTORE Password Reset",
                html:  `<!DOCTYPE html>
                <html>
                <head>
                <style>
                .ot{
                    color:red;
                    font-weight: bold;
                }
                .n{
                    font-weight: bold;
                    font-size: 20px;
                }
                .ot1{
                    font-weight: bold;
                    color:red;
                    font-size: 25px;
                }
                </style>
                </head>
                <body>
                <h1>Neo<span class="ot1">STORE</span></h1>
                <hr/>
                Hello <span class="n"> ${data.firstname+' '+ data.lastname} </span>,
                <div>A password reset for your account was requested.</div>
               <div> Your OTP for Neo<span class="ot">STORE</span> password reset is <span class="ot1">${otp}</span> </div>
               <div>Note that this OTP is valid for 24 hours. After the time limit has expired, you will have to resubmit the request for a password reset.</div> <br/>
               <div>If you did not make this request, please Contact Us. </div>
                </body>
    </html>`
            }

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                  console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                  }   
            })
            res.json({"err":0, "otp":otp })

        }
    })
})

//reset password
router.post("/resetpassService", (req,res)=>{
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    registerModel.updateOne({email:req.body.email}, {$set:{password:req.body.password}}, (err,data)=>{
        if(err) throw err;
        else{
            res.json({"err":0, "msg":"Password Successfullyyy reset"})
        }
    })
})

//profile
router.post("/profilefetchService",(req,res)=>{
    registerModel.find({}, (err,data)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(data)
        }
    })
})

//profile picture edit
router.post("/profileeditService", (req,res) =>{
    registerModel.findOneAndUpdate({email: req.body.originalEmail}, 
    {$set: {
        firstname:req.body.firstname,
        lastname:req.body.lastname, 
        gender:req.body.gender, 
        contact:req.body.contact, 
        email: req.body.email,}},{new:true},(err,data)=>{
            if(err) throw err;
            else{
                const token = encryptData(data);
                res.json({"err":0,"msg":"Address added","token":token, "values":data})
            }
        }) 
})

//profile picture upload
router.post("/profilePicService", upload.single('profileImg'), (req,res) =>{
    console.log(req.file, "line 175")
    registerModel.findOneAndUpdate({email: req.body.email}, 
    {$set: {
        profilepic: req.file.filename}},{new:true},(err,data)=>{
            if(err) throw err;
            else{
                console.log(data, "line 197")
                const token = encryptData(data);
                res.json({"err":0,"msg":"Profile Pic Updated","token":token, "values":data})
            }
        }) 
})

//add address
router.post("/addAddressService",(req,res)=>{
    console.log(req.body, "line 162")
    // let useremail = req.params.email
   registerModel.findOneAndUpdate({email:req.body.email}, {$set:{addresses:req.body.data}},{new:true}, (err,data)=>{

        if(err){
            console.log(err)
        }
        else{
            const token = encryptData(data);
            res.json({"err":0,"msg":"Address added","token":token})
        }
    })
})

//change password
router.post("/changePaswordService",(req,res)=>{
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    registerModel.findOneAndUpdate({email:req.body.email}, {$set:{password:req.body.password}},{new:true},(err, data)=>{
        if(err){
            res.json({"err":1, "msg":"Something went wrong in checking data"})
        }
        else{
            const token = encryptData(data);
            res.json({"err":0,"msg":"Password updated successfully!!","token":token})
        }
    })
})

//footer email subscribe service
router.post("/emailSubscribeService", (req, res) => { 
    let mailOptions = {
        from:'nehadeore160@gmail.com',
        to:req.body.email,
        subject:"Subscription",
        html:`<!DOCTYPE html>
        <html>
        <head>
        <style>
         .n{
            font-weight: bold;
            font-size: 20px;
            color:purple
        }
        .ot1{
            font-weight: bold;
            color:red;
            font-size: 25px;
        }
        .heading{
            color:purple;
            font-size:25px;
        }
        </style>
        </head>
        <body>
        <h1>Neo<span class="ot1">STORE</span></h1>
        <hr/>
        Hello <span class="n"> ${req.body.email} </span>,
        <div class="heading">Thank YoU For Subscribing Us!!</div>
        </body></html>`
    }
    transporter.sendMail(mailOptions, function(error,info){
        if(error) {
            console.log(error)
        }
        else{
            console.log('Email sent: '+info.response); 
        }
    })
    res.json({"err":0, "msg":"Email Send successfully"})
})

//cart
router.post("/cartSaveService",(req,res)=>{
    registerModel.findOneAndUpdate({email:req.body.email}, {$set:{cart:req.body.data}},{new:true}, (err,data)=>{

        if(err){
          res.json({"err":1,"msg":err})
        }
        else{
            const token = encryptData(data);
            res.json({"err":0,"msg":"cart added","token":token})
        }

    })
})


//encrypt
const encryptData = (data) => {
    let pay={
        ...data._doc
    }
    const token= jwt.sign(pay, jwtSecret,{expiresIn:360000})
    return token;
}

export default router