import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";



export const createVoteSchema = joi.object({
    voteName: joi.string().min(3).max(25).required(),
    VotingStatus: joi.string().valid('Active', 'Inactive').required(),
    description: joi.string().min(10).max(100).required(),
    StartDateVote:joi.date().required(),
    EndDateVote:joi.date().required(),
    file: generalFields.file.required(),
});

export const updateVoteSchema = joi.object({
    id: joi.string().custom(validation).required(),
    VotingStatus: joi.string().valid('Active', 'Inactive').required(),
});

export const getspecificvote=joi.object({
    id:joi.string().min(24).max(24).required(),
});

export const addExistingCandidateToVote=joi.object({
    userName: joi.string().alphanum().min(3).max(25).required(),
    voteName: joi.string().min(3).max(25).required(),
    
});
export const getspecificCandidate=joi.object({
    CandidateID:joi.string().min(24).max(24).required(),
});