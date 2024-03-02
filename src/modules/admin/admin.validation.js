import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";



export const UpdateAdminSchema = joi.object({
    id: joi.string().custom(validation).required(),
    email: joi.string().email(),
    userName: joi.string().alphanum().min(3).max(25),
    phone: joi.string().min(10).max(10),
    address: joi.string().alphanum().min(3).max(25),
    statuse: joi.string().valid('Active', 'Inactive'),
    file: generalFields.file,
});

export const DeletAdminAndRestore = joi.object({
    id: joi.string().custom(validation).required(),

});

