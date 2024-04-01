
import mongoose, { Schema, model ,Types} from 'mongoose';
const Serviceschema = new Schema({
title:{
    type:String,
    required:true,
},
description:{
    type:String,
    required:true,
},

}
,{
    timestamps:true,
});


const ServicesModel= mongoose.models.services || model('services',Serviceschema);
export default ServicesModel;

