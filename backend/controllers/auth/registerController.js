import Joi from 'joi';
import customErrorHandler from '../../service/customErrorHandler.js';
import {User,refreshToken} from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwtService from '../../service/jwtService.js';
import { REFRESH_SECRET } from '../../config/index.js';



const registerControllers={
    async register(req,res,next){



        const registerSchema=Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            repeat_password:Joi.ref('password'),
        })
        

        const {error} =registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try{

            const exist=await User.exists({email:req.body.email});
            if(exist){
                return next(customErrorHandler.alreadyExist('This email is already taken'));
            }
        }catch(err){
            return next(err);
        }


        //hash password
        const{name,email,password}=req.body;

        const hashedPassword=await bcrypt.hash(password,10);

        

        const user=new User({
            name,
            email,
            password:hashedPassword
        })

        let access_token;
        let refresh_token;
        try{
            const result=await user.save();
            console.log(result);
            access_token=jwtService.sign({_id:result._id,role:result.role});
            refresh_token=jwtService.sign({_id:result._id,role:result.role},'1y',REFRESH_SECRET);

            //storage in database
            await refreshToken.create({token:refresh_token});

        }catch(err){
            return next(err)
        }

        res.json({access_token,refresh_token});
        
    }

}

export default registerControllers;