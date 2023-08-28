import multer from 'multer';
import customErrorHandler from '../service/customErrorHandler.js';
import path from 'path'; 
import fs from 'fs';
import { Product } from '../models/index.js';
import productSchema from '../validators/productValidators.js'

const storage=multer.diskStorage({
    destination:(req,res,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    },
});

const handleMultipleData=multer({//this returns a function
    storage,
    limits:{fileSize:1000000*5},
}).single('image');

const productController={
    async store(req,res,next){
        handleMultipleData(req,res,async (err)=>{
            if(err){
                return next(customErrorHandler.serverError(err.message));
            }

            const filePath=req.file.path;
            
            //validation

            const{error}=productSchema.validate(req.body);
            if(error){
                //delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    if(err){
                        return next(
                            customErrorHandler.serverError(err.message)
                        );
                    }
                });
                return next(error);
            }  
            console.log(filePath);
            const {name ,price,size}=req.body;
            let document;
            try{
                document=await Product.create({
                    name,
                    price,
                    size,
                    image:filePath,
                });
            }catch(err){
                return next(err);
            }
            res.status(201).json(document);


        });
    },
    update(req,res,next){
        handleMultipleData(req,res,async (err)=>{
            if(err){
                return next(customErrorHandler.serverError(err.message));
            }
            if(req.file){
                const filePath=req.file.path;
            }
            //validation

            const{error}=productSchema.validate(req.body);
            if(error){
                //delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    if(err){
                        return next(
                            customErrorHandler.serverError(err.message)
                        );
                    }
                });
                return next(error);
            }  

            const {name ,price,size}=req.body;
            let document;
            try{
                document=await Product.findOneAndUpdate(
                    {_id:req.params.id},{
                    name,
                    price,
                    size,
                    ...(req.file && {image:filePath}),
                },
                {new : true}
                );
            }catch(err){
                return next(err);
            }
            res.status(201).json(document);


        });

    },
    async index(req,res,next){
        let documents;
        try{
            documents=await Product.find().select('-updatedAt -__v').sort({_id:-1});
        }catch(err){
            return next(customErrorHandler.serverError())
        }
        return res.json(documents);
    },
    async show(req,res,next){
        let document;
        try{
            document=await Product.findOne({_id:req.params.id}).select('-updatedAt -__v');
        }catch(err){
            return next(customErrorHandler.serverError());
        }
        return res.json(document);
    },
    async destroy(req,res,next){
        let document;
        try{
            document=await Product.findOneAndRemove({_id:req.params.id});
            if(!document){
                return next(new Error('Nothing to delete'));
            }
            let imagePath=document._doc.image;
            fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
                if(err){
                    return next(customErrorHandler.serverError());
                }
                return res.json(document);
            });

        }catch(err){
            return next(customErrorHandler.serverError());
        }
    },
    async getProduct(req,res,next){
        let document;
        try{
            document=Product.findOne({_id:req.params.id}).select('-updatedAt -__v');
        }catch(err){
            return next(customErrorHandler.serverError());
        }
        return res.json(document);
    },
    async getProducts(req,res,next){
        let documents;
        try{
            documents = await Product.find({_id: { $in: req.body.ids },}).select('-updatedAt -__v');
            
        }catch (err){
            return next(customErrorHandler.serverError());
        }
        return res.json(documents);
    }

}

export default productController;