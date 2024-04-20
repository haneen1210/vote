import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";


export const contect=joi.object({
    fullName: joi.string().alphanum().min(3).max(25).required(),
    email: generalFields.email,
    phone: joi.string().required().min(10).max(10),
    message: joi.string().required().min(10).max(200),
});

export const getspecificcontect=joi.object({
  contectID:joi.string().min(24).max(24).required(),
});

export const updatecontectSchema=joi.object({
    id:joi.string().min(24).max(24).required(),
    fullName: joi.string().alphanum().min(3).max(25).required(),
    email: generalFields.email,
    phone: joi.string().required().min(10).max(10),
    message: joi.string().required().min(10).max(200),
});
