/*
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

*/
import mongoose, { Schema, model, Types } from 'mongoose';

const ResultSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User' },  // Reference to a single User
    candidateId: { type: Types.ObjectId, ref: 'User' },  // Reference to a single User as a candidate
    VoteId: { type: Types.ObjectId, ref: 'Vote' },  // Reference to a single Vote
}, {
    timestamps: true,  // Automatically add createdAt and updatedAt timestamps
});

const ResultModel = mongoose.models.Result || model('Result', ResultSchema);
export default ResultModel;