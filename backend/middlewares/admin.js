import { User } from "../models/index.js"
import customErrorHandler from "../service/customErrorHandler.js";
const admin=async (req,res,next)=>{

        try{
            const user=await User.findOne({_id:req.user._id});
            console.log(user.role);
            if(user.role==='admin'){
                next();
            }
            else{
                return next(customErrorHandler.unAuthorized());
            }
        }catch(err){

            return next(customErrorHandler.serverError(err.message));
        
    }
}

export default admin;