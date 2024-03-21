import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const UpdateSchema = joi.object({
    id:joi.string().min(24).max(24).required(),
    email: joi.string().email(),
    userName: joi.string().alphanum().min(3).max(25),
    phone: joi.string().min(10).max(10),
    address: joi.string().alphanum().min(3).max(25),
    statuse: joi.string().valid('Active', 'Inactive'),
    file: generalFields.file,
});

export const DeletAdminAndRestore = joi.object({
    id:joi.string().min(24).max(24).required(),
});


export const excelUserDataSchema = joi.object({
    userName: joi.string().alphanum().min(3).max(25).required(),
    cardnumber: joi.string().required(),
    email: joi.string().email().required(), 
    phone: joi.string().required().min(10).max(10), 
    address: joi.string().alphanum().min(3).max(25).required(),
    gender: joi.string().valid('Male', 'Female').required(),
    role: joi.string().valid( 'Candidate').required(), 
});



export const updatPassword = joi.object({
    oldPassword: generalFields.password.required(),
    newPassword:generalFields.password.required(),
    Cpassword: joi.string().valid(joi.ref('newPassword')).required(),
});
