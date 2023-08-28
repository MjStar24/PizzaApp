import customErrorHandler from "../service/customErrorHandler.js";
import jwtService from "../service/jwtService.js";

const auth=async (req,res,next)=>{

    let authHeader=req.headers.authorization;
    if(!authHeader){
        return next(customErrorHandler.unAuthorized());
    }

    const token=authHeader.split(' ')[1];

    try {
        const hello=await jwtService.verify(token);
        console.log(hello);
        const {_id,role}=await jwtService.verify(token);
        const user={
            _id,
            role
        }

        req.user=user;
        next();


    }catch(err){
        return next(customErrorHandler.unAuthorized());
    }

}

export default auth;