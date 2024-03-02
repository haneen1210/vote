import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
export const signupSchema = joi.object({
    userName: joi.string().alphanum().min(3).max(25).required(),
    cardnumber: joi.number().positive().required(),
    email: generalFields.email,
    password: generalFields.password,
    Cpassword: joi.string().valid(joi.ref('password')).required(),
    phone: joi.string().required().min(10).max(10),
    address: joi.string().alphanum().min(3).max(25).required(),
    gender: joi.string().valid('Male', 'Female').required(),
    role: joi.string().valid('User', 'Admin', 'Candidate'),
    file: generalFields.file.required(),

});
export const signinSchema = joi.object({
    email: generalFields.email,
    password: generalFields.password,
});


export const sendcodeSchema = joi.object({
    email: generalFields.email,
});

export const forgotPasswordSchema = joi.object({
    email: generalFields.email,
    password: generalFields.password,
    code: joi.string().alphanum().min(4).max(4).required(),
});
