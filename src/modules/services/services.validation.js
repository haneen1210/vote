import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";

export const Services=joi.object({
    title:joi.string().min(10).max(30).required(),
    description:joi.string().min(10).max(150).required(),
});


export const getspecificService=joi.object({
    ServiceID:joi.string().min(24).max(24).required(),
});

export const updateServiceSchema=joi.object({
    id:joi.string().min(24).max(24).required(),
    title:joi.string().min(10).max(30).required(),
    description:joi.string().min(10).max(150).required(),
});
