import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const refreshTokenSchema=mongoose.Schema({

    token:{type:String,},
},{timestamps:false});

export default mongoose.model('Refresh',refreshTokenSchema,'refreshers');