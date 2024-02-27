import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";
export const addAdminSchema = joi.object( {
        userName: joi.string().alphanum().min(3).max(25).required(),
       // cardnumber:joi.number().positive().required(),
        email: generalFields.email,
        password:generalFields.password,
        //Cpassword: joi.string().valid(joi.ref('password')).required(),
        //phone:joi.string().required().min(10).max(10),
        //address:joi.string().alphanum().min(3).max(25).required(),
        //gender: joi.string().valid('Male', 'Female').required(),
        role:joi.string().valid('User', 'Admin', 'Candidate').required(),
        //file:generalFields.file.required(),
        statuse: joi.string().valid('Active', 'Inactive')

});
export const UpdateAdminSchema = joi.object({
    id:joi.string().custom(validation).required(),
    email: joi.string().email(),
    userName: joi.string().alphanum().min(3).max(25),
    phone:joi.string().min(10).max(10),
    address:joi.string().alphanum().min(3).max(25),
    statuse: joi.string().valid('Active', 'Inactive'),
});

export const DeletAdminAndRestore = joi.object({
    id:joi.string().custom(validation).required(),

});
