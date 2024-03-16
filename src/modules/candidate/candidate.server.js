import userModel from "../../../DB/models/admin.model.js";
import VoteModel from "../../../DB/models/vote.model.js";


export const getcandidate = async (req, res, next) => {
    const Candidate = await userModel.find({ role: 'Candidate' });
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
