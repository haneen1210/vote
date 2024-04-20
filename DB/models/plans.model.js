
import mongoose, { Schema, model ,Types} from 'mongoose';
const Plansschema = new Schema({
planName:{
    type:String,
    required:true,
},
description:{
    type:String,
    required:true,
},
item:{
    type:[{type:Types.ObjectId, ref:'User',}],
    required:true,
},

}
,{
    timestamps:true,
});


const PlansModel= mongoose.models.Plans || model('Plans',Plansschema);
export default PlansModel;

