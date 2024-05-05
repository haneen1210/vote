import userModel from "../../../DB/models/admin.model.js";
import VoteModel from "../../../DB/models/vote.model.js";
import WithdrawalModel from "../../../DB/models/withdrawa.model.js";


export const getcandidate = async (req, res, next) => {
    const Candidate = await userModel. find({ isDeleted: false , role : 'Candidate',statuse:'Active'});
    return res.status(200).json({ message: "success", Candidate });

}
export const getspecificCandidateinvote = async (req, res) => {
    const { CandidateID } = req.params;
    const vote = await VoteModel.findOne({ "candidates": CandidateID });
    if (!vote) {
        return res.status(404).json({ message: "Vote not found" });
    }
    return res.status(200).json({ message: "Vote found", vote });

}

export const getspecificCandidate = async (req, res) => {
    const { CandidateID } = req.params;
    const candidate = await userModel.findOne({ _id: CandidateID });
    if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
    }
    return res.status(200).json({ message: "Candidate found", candidate });

}


export const getspecificCandidateinvotes = async (req, res) => {
    
    const user_id = req.user._id;
    const votes = await VoteModel.find({ candidates: user_id }).populate('candidates');
    const voteNames = votes.map(vote => vote.voteName);
    if (!votes) {
        return res.status(404).json({ message: "candidate not found" });
    }
    return res.status(200).json({ message: "candidate found", voteNames ,id:user_id });

}
export const requestWithdrawal = async (req, res) => {
   
        const { voteId, reason } = req.body;
        const user_id = req.user._id;//candidateId
        // تحقق من أن المرشح موجود وله الصلاحية
        const candidate = await userModel.findOne({ _id: user_id, role: 'Candidate' });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found or unauthorized" });
        }

        // تحقق من أن التصويت موجود
        const vote = await VoteModel.findById(voteId);
        if (!vote) {
            return res.status(404).json({ message: "Vote not found" });
        }

        // تحقق من أن المرشح مشارك في التصويت
        if (!vote.candidates.includes(user_id)) {
            return res.status(400).json({ message: "Candidate not participating in the vote" });
        }

        // أنشئ طلب انسحاب جديد
        const withdrawalRequest = await WithdrawalModel.create({user_id,voteId, reason });

        res.status(201).json({ message: "Withdrawal request submitted successfully",withdrawalRequest });
           
       

};