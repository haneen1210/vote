import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";

export const plans=joi.object({
    planName:joi.string().min(10).max(30).required(),
    description:joi.string().min(10).max(150).required(),
});


export const getspecificplans=joi.object({
    PlansID:joi.string().min(24).max(24).required(),
});

export const updateplansSchema=joi.object({
    id:joi.string().min(24).max(24).required(),
    planName:joi.string().min(10).max(30).required(),
    description:joi.string().min(10).max(150).required(),
});
