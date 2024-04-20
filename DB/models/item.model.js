
import mongoose, { Schema, model ,Types} from 'mongoose';
const itemschema = new Schema({
    text:{
        type:String,
        required:true,
    },
  planId:{type:Types.ObjectId,ref:'Plans',required:true},
}
,{
    timestamps:true,
});


const itemModel= mongoose.models.item || model('item',itemschema);
export default itemModel;
