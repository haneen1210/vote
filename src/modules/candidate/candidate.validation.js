import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";

export const getspecificCandidate=joi.object({
    CandidateID:joi.string().min(24).max(24).required(),
});