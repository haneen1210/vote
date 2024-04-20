
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

}
,{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
});
Plansschema.virtual('item',{
    localField:'_id',
    foreignField:'planId',
    ref:'item',
});


const PlansModel= mongoose.models.Plans || model('Plans',Plansschema);
export default PlansModel;

