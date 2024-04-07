
import mongoose, { Schema, model ,Types} from 'mongoose';
const blogschema = new Schema({
titel:{
    type:String,
    required:true,
},
short_description:{
    type:String,
    required:true,
},
long_description:{
    type:String,
    required:true,
},
image: {// صورة يلي برا 
    type: Object,
    required: true,
},
}
,{
    timestamps:true,
});

const blogsModel= mongoose.models.blog || model('blog',blogschema);
export default blogsModel;

