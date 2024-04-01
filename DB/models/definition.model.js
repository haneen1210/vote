
import mongoose, { Schema, model ,Types} from 'mongoose';
const definitionschema = new Schema({

description:{
    type:String,
    required:true,
},

}
,{
    timestamps:true,
});


const definitionModel= mongoose.models.definition || model('definition',definitionschema);
export default definitionModel;

