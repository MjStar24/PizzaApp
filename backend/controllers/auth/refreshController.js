import Joi from 'joi';
import { User, refreshToken } from '../../models/index.js';
import customErrorHandler from '../../service/customErrorHandler.js';
import jwtService from '../../service/jwtService.js';
import { REFRESH_SECRET } from '../../config/index.js';

const refreshController={
    async refresh(req,res,next){
        //validation
        const refreshSchema=Joi.object({
            refresh_token:Joi.string().required(),
        });
        const {error}=refreshSchema.validate(req.body);
        
        if(error){
            next(error);
        }

        //database
        let refreshtoken;
        try{
            refreshtoken=await refreshToken.findOne({token:req.body.refresh_token});
            if(!refreshtoken){
                return next(customErrorHandler.unAuthorized("Invalid refresh token"));
            }

        let userId;
        try{
            const {_id}=await jwtService.verify(refreshtoken.token,REFRESH_SECRET);
            userId=_id;
        }catch(err){
            return next(customErrorHandler.unAuthorized("Invalid refresh token"));
        }

        const user=await User.findOne({_id:userId});
        if(!user){
            return next(customErrorHandler.unAuthorized("Useer not Found"));
        }

        //tokens
        const access_token=jwtService.sign({_id:user._id,role:user.role});
        const refresh_token=jwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET);

        await refreshToken.create({token:refresh_token});
        res.json({access_token,refresh_token});

        }catch(err){

            return next(new Error('Something went wrong'+err.message));
        }


    }
}

export default refreshController;