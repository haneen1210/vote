import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";

export const blogs=joi.object({
    titel:joi.string().min(10).max(30).required(),
    short_description:joi.string().min(10).max(150).required(),
    long_description:joi.string().min(10).max(150).required(),
    file: generalFields.file.required(),
});


export const getspecificblogs=joi.object({
    blogID:joi.string().min(24).max(24).required(),
});

export const updateblogsSchema=joi.object({
    id:joi.string().min(24).max(24).required(),
    titel:joi.string().min(10).max(30).required(),
    short_description:joi.string().min(10).max(150).required(),
    long_description:joi.string().min(10).max(150).required(),
    file: generalFields.file.required(),
});
