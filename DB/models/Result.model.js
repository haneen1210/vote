
import mongoose, { Schema, model, Types } from 'mongoose';

const ResultSchema = new Schema({
    /*
    userId: { type: Types.ObjectId, ref: 'User' },  // Reference to a single User
    candidateId: { type: Types.ObjectId, ref: 'User' },  // Reference to a single User as a candidate
    VoteId: { type: Types.ObjectId, ref: 'Vote' },  // Reference to a single Vote
 */

  VoteId: { type: String, required: true },
  candidateId: { type: String, required: true },
  userId: { type: String, required: true },

}, {
    timestamps: true,  // Automatically add createdAt and updatedAt timestamps
});

const ResultModel = mongoose.models.Result || model('Result', ResultSchema);
export default ResultModel;