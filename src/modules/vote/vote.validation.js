import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";
/*

const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
export const createVoteSchema = joi.object({
    voteName: joi.string().min(3).max(25).required(),
    VotingStatus: joi.string().valid('Active', 'Inactive').required(),
    description: joi.string().min(10).max(100).required(),
    StartDateVote: joi.string().pattern(datePattern).required().custom((value, helpers) => {
        const date = moment(value, 'MM/DD/YYYY hh:mm A').format('MM/DD/YYYY HH:mm');
        return date;
    }),
  EndDateVote: joi.string().pattern(datePattern).required().custom((value, helpers) => {
    const date = moment(value, 'MM/DD/YYYY hh:mm A').format('MM/DD/YYYY HH:mm');
    return date;
}),
    file: generalFields.file.required(),
    AdminID:joi.string().min(24).max(24).required(),
});
*/
const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

export const createVoteSchema = joi.object({
    voteName: joi.string().min(3).max(25).required(),
    VotingStatus: joi.string().valid('Active', 'Inactive').required(),
    description: joi.string().min(10).max(100).required(),
    StartDateVote: joi.string().pattern(datePattern).required().custom((value, helpers) => {
        const date = moment(value, 'MM/DD/YYYY hh:mm A').toDate();
        return helpers.date.date = date;
    }),
    EndDateVote: joi.string().pattern(datePattern).required().custom((value, helpers) => {
        const date = moment(value, 'MM/DD/YYYY hh:mm A').toDate();
        return helpers.date.date = date;
    }),
    file: generalFields.file.required(),
    AdminID: joi.string().min(24).max(24).required(),
});



export const updateVoteSchema = joi.object({
    id: joi.string().custom(validation).required(),
    VotingStatus: joi.string().valid('Active', 'Inactive').required(),
});

export const getspecificvote=joi.object({
    id:joi.string().min(24).max(24).required(),
});

export const addAndRemoveCandidateToVote=joi.object({
    userName: joi.string().alphanum().min(3).max(25).required(),
    voteName: joi.string().min(3).max(25).required(),
    
});
export const getspecificCandidate=joi.object({
    CandidateID:joi.string().min(24).max(24).required(),
});

export const join=joi.object({
    idvote:joi.string().min(24).max(24).required(),
    idcandidate:joi.string().min(24).max(24).required(),
});


export const updatejoin1=joi.object({
    idvote:joi.string().min(24).max(24).required(),
    idcandidate:joi.string().min(24).max(24).required(),
    id:joi.string().min(24).max(24).required(),
});


export const findUserVotes=joi.object({
    userId:joi.string().min(24).max(24).required(),
   
});

     