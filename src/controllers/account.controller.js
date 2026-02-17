import accountModel from "../models/account.model.js";

export default{

    open:async(req,res)=>{
        const user=req.user;
        
        try {
            if(!user){
            return res.status(400).json({
                success:false,messsage:"user not found!"
                })
            }

        const newAccount=await accountModel.create({
            user:user._id,
        })

        return res.status(201).json({success:true , messsage:"account created",newAccount})
            
        } catch (error) {
            return res.status(400).json({success:false,message:"server error!!",error})
            
        }

    },
    getUserAccounts:async(req,res)=>{
        const accounts=await accountModel.findOne({user:req.user._id})

        return res.status(200).json({success:true , accounts})

    },
    getAccountBalance:async(req,res)=>{
        try {

        const{AccountId}=req.params;

        const account = await accountModel.findById(AccountId);

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: "Account not found"
                });
            }

            if (account.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to view this account"
                });
            }

        const balance=await account.getBalance()

        return res.status(200).json({success:true ,
        AccountId ,
        balance:balance})
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }

    },
}