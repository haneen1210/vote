
import mongoose, { Schema, model ,Types} from 'mongoose';
const commentSchema = new Schema({
text:{
    type:String,
    required:true,
},

image:{
    type:Object,
   
},
userId:{
    type:Types.ObjectId,
    ref:'User',
    required:true,
},
userName:{
    type:String,
    ref:'User',
    required:true,
},
image: {// صورة الشخص يلي بعلق
    type: Object,
    ref:'User',
    required: true,
},

postId:{type:Types.ObjectId,ref:'Post',required:true},
like:[{type:Types.ObjectId, ref:'User',}],
unlike:[{type:Types.ObjectId, ref:'User',}],
isDeleted:{type:Boolean,default:false},

}
,{
    timestamps:true,
});
const commentModel= mongoose.models.comment || model('comment',commentSchema);
export default commentModel;
