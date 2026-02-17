import experss from "express"
import jwt from 'jsonwebtoken'
import userModel from "../models/user.model.js";

const authmiddleware=async(req,res,next)=>{

    const token= req.cookies.token || req.header.authorization?.slipt("")[1];

    if (!token) {
    return res.status(401).json({
    message: "Unauthorized access, token is missing"})

}
    try {
        const decode=jwt.verify(token,process.env.jwt_secret)
        
        const user= await userModel.findById(decode.userId).select("-password")

        req.user=user

        return next()

    } catch (error) {
        console.log("error in verify",error);
        
    }
}
async function authSystemUserMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }
 
    const isBlacklisted = await tokenBlackListModel.findOne({ token })

    if (isBlacklisted) {    
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            })
        }

        req.user = user

        return next()
    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

}
export default {authmiddleware,authSystemUserMiddleware}