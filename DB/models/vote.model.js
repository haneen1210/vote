import mongoose, { Schema, model,Types} from "mongoose";
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
    image: {
        type: Object,
        required: true,
    },


    StartDateVote: { type: Date, required: true },
    EndDateVote: { type: Date, required: true },

    isDeleted: {
        type: Boolean,
        default: false,
    },

   candidates: [{ type:Types.ObjectId, ref: 'User' }],
   Posts: [{ type:Types.ObjectId, ref: 'Post' }],
   join1:[{type:Types.ObjectId, ref:'User',}],
  
}, {
    timestamps: true,
}

);

const VoteModel = mongoose.models.Vote || model('Vote', VoteSchema);
export default VoteModel;




