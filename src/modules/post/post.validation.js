import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";



export const createPost = joi.object({
    file:generalFields.file,
    title:joi.string().min(10).max(100).required(),
    caption:joi.string().min(10).max(100).required(),
   
});

export const createcommant = joi.object({
 id:joi.string(), 
    file:generalFields.file,
    text:joi.string().min(10).max(100).required(),
   
   
});
