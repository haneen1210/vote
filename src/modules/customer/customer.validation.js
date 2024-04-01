import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";

export const customer=joi.object({
   
    email: joi.string().email(),
    userName: joi.string().alphanum().min(3).max(25),
    phone: joi.string().min(10).max(10),
    address: joi.string().alphanum().min(3).max(25),
    statuse: joi.string().valid('Active', 'Inactive'),
    file: generalFields.file,
});


export const getspecificcustomer=joi.object({
    customerID:joi.string().min(24).max(24).required(),
});

export const updatecustomerSchema=joi.object({
    id:joi.string().min(24).max(24).required(),
    email: joi.string().email(),
    userName: joi.string().alphanum().min(3).max(25),
    phone: joi.string().min(10).max(10),
    address: joi.string().alphanum().min(3).max(25),
    statuse: joi.string().valid('Active', 'Inactive'),
    file: generalFields.file,
});




