import joi from "joi";


export const getspecificCandidate=joi.object({
    CandidateID:joi.string().min(24).max(24).required(),
});


export const requestWithdrawal=joi.object({
    
    voteName: joi.string().min(3).max(25).required().messages({
        "string.base": "Vote name should be a string",
        "string.min": "Vote name should be at least 3 characters long",
        "string.max": "Vote name should not exceed 25 characters",
        "any.required": "Vote name is required"
    }),
    reason: joi.string().min(10).max(500).required().messages({
        "string.base": "Reason should be a string",
        "string.min": "Reason should be at least 10 characters long",
        "string.max": "Reason should not exceed 500 characters",
        "any.required": "Reason is required"
    })
});

