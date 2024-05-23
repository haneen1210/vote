import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const UpdateSchema = joi.object({
    id:joi.string().min(24).max(24).required(),
    email: joi.string().email(),
    userName: joi.string().alphanum().min(3).max(25),
    phone: joi.string().min(10).max(10),
    address: joi.string().alphanum().min(3).max(25),
    statuse: joi.string().valid('Active', 'Inactive'),
    cardnumber: joi.number().positive().required(),
    gender: joi.string().valid('Male', 'Female').required(),
    file: generalFields.file,
});

export const updateProfileSchema = joi.object({
    email: joi.string().email(),
    userName: joi.string().alphanum().min(3).max(25),
    phone: joi.string().min(10).max(10),
    address: joi.string().alphanum().min(3).max(25),
    statuse: joi.string().valid('Active', 'Inactive'),
    file: generalFields.file,
});

export const signupSchemacandidate = joi.object({
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

export const updatecandidate = joi.object({
    id: joi.string().required(), 
    userName: joi.string().alphanum().min(3).max(25).required(),
    cardnumber: joi.number().positive().required(),
    email: generalFields.email,
    phone: joi.string().required().min(10).max(10),
    address: joi.string().alphanum().min(3).max(25).required(),
    gender: joi.string().valid('Male', 'Female').required(),
    file: generalFields.file.required(),
    AdminID:joi.string().min(24).max(24).required(),
});

export const UpdateStatuseUser = joi.object({
    idUser:joi.string().min(24).max(24).required(),
    statuse: joi.string().valid('Active', 'Inactive'),
   
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


export const manageWithdrawalRequest = joi.object({
    requestId: joi.string().min(24).max(24).required(),
    status: joi.string().valid('Pending', 'Approved', 'Rejected').required()
});


