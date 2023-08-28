import express from 'express';
import {APP_PORT,DB_URL} from './config/index.js';
import errorHandler from './middlewares/errorHandler.js';
const app=express();
app.use(express.json());
import routes from './routes/index.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

console.log(__dirname);

mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology:true});

const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error :'));
db.once('open',()=>{
    console.log('connected..');
})

global.appRoot=path.resolve(__dirname);

//to catch multipart data
app.use(express.urlencoded({extended:false}));

app.use('/api',routes);
app.use('/uploads',express.static('uploads'));



app.use(errorHandler);
app.listen(APP_PORT,()=>{
    console.log(`Listening to server ${APP_PORT}`);
})