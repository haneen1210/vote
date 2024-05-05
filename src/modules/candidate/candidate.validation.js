import joi from "joi";


export const getspecificCandidate=joi.object({
    CandidateID:joi.string().min(24).max(24).required(),
});


export const requestWithdrawal=joi.object({

    voteId: joi.string().hex().length(24).required().messages({
        "string.base": "Vote ID should be a string",
        "string.hex": "Vote ID must be a valid ObjectId",
        "string.length": "Vote ID should be 24 characters long",
        "any.required": "Vote ID is required"
    }),
    reason: joi.string().min(10).max(500).required().messages({
        "string.base": "Reason should be a string",
        "string.min": "Reason should be at least 10 characters long",
        "string.max": "Reason should not exceed 500 characters",
        "any.required": "Reason is required"
    })
});

