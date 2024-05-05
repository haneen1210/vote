// نموذج طلب الانسحاب WithdrawalModel
import mongoose, { Schema, model, Types } from 'mongoose';

const WithdrawalSchema = new Schema({
    candidateId: { type: Types.ObjectId, ref: 'User', required: true },
    voteId: { type: Types.ObjectId, ref: 'Vote', required: true },
    reason: { type: String, required: true }, // سبب الانسحاب
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected']
    },
}, {
    timestamps: true,
});

const WithdrawalModel = mongoose.models.Withdrawal || model('Withdrawal', WithdrawalSchema);
export default WithdrawalModel;
