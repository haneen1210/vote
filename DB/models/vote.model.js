import mongoose, { Schema, model } from "mongoose";
const VoteSchema = new Schema({
    voteName: {
        type: String,
        required: true,
        unique: true,
    },

    VotingStatus: {
        type: String,
        default: 'Inactive',
        enum: ['Active', 'Inactive'],
    },

    description: {
        type: String,
        required: true,

    },
    Title: {
        type: String,
        required: true,

    },

    StartDateVote: { type: Date, required: true },
    EndDateVote: { type: Date, required: true },

    isDeleted: {
        type: Boolean,
        default: false,
    },

   // usedBy: [{ type: Types.ObjectId, ref: 'User' }],
  //  createdBy: [{ type: Types.ObjectId, ref: 'User' }],
   // updateBy: [{ type: Types.ObjectId, ref: 'User' }],

}, {
    timestamps: true,
}

);

const VoteModel = mongoose.models.Vote || model('Vote', VoteSchema);
export default VoteModel;




