
import mongoose, { Schema, model ,Types} from 'mongoose';
const Resultschema = new Schema({

    userId:[{type:Types.ObjectId, ref:'User',}],
    candidateId:[{type:Types.ObjectId, ref:'User',}],
    VoteId:[{type:Types.ObjectId, ref:'Vote',}],
}
,{
    timestamps:true,
});


const ResultModel= mongoose.models.Result || model('Result',Resultschema);
export default ResultModel;

