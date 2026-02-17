import userModel from '../models/user.model.js'
import twt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import tokenBlackListModel from '../models/blacklist.model.js'
import emailService from '../services/email.services.js'

const regex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export default{

    register:async(req,res)=>{

        try {
            const{email,name,password}=req.body;
            if(!email || !password){
            return res.status(400).json({success:false,message:"invalid feilds!!"})
            }

            if(!regex.test(email)){
                return res.status(400).json({success:false,message:"invalid email!!"})
            }

            if(password.length<6){
                return res.status(400).json({success:false,message:"password should be greater than 6!!"})
            }

            const userexist=await userModel.findOne({email});

            if(userexist){
                return res.status(400).json({success:false,message:"user exist!!"})
            }
            const hashpass=await bcrypt.hash(password,10)

            const newuser=await userModel.create({
                email,name,password:hashpass
            })
           
            
            const token= twt.sign({userId:newuser._id},process.env.jwt_secret,{expiresIn:"3d"})

            res.cookie("token", token, { httpOnly: true, sameSite: 'lax' })

             res.status(201).json({
                success:true,message:"User created ",user:newuser 
            })

           await emailService.sendRegistrationEmail(newuser.email,newuser.name);

        } catch (error) {
            return res.status(400).json({success:false,message:"server error!!",error})
        }
        
    },
    login:async(req,res)=>{

        const{email,password}=req.body;
        try {
            
            if(!email || !password){
                return res.status(400).json({success:false,message:"invalid feilds!!"})
                
            }
            const user=await userModel.findOne({email})
            
            if(!user){
                return res.status(400).json({success:false,message:"user not exist !"})
                
            }
            const validpass=await bcrypt.compare(password,user.password);
            
            if(!validpass){
                return res.status(400).json({success:false,message:"incorrect password !"})
                
            }
            
            const token= twt.sign({userId:user._id},process.env.jwt_secret,{expiresIn:"3d"})
            
            res.cookie("token", token, { httpOnly: true, sameSite: 'lax' })
            
            return res.status(200).json({
                success:true,message:"User created ",user : user 
            })
        } catch (error) {
            console.log(error);
            
            return res.status(400).json({success:false,message:" error!",error})
        }



    },
    dashboard:async(req,res)=>{
        const{email,name,password}=req.body;

    },
    logout:async(req,res)=>{
    
        const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(401).json({
           success:false, message: "Unauthorized access, token is missing"
        })
    }
        res.clearCookie("token")

        return res.status(200).json({
            success:true,
        message: "User logged out successfully"
    })



    }
    
}