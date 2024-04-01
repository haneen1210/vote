import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";

export const definition=joi.object({
    description:joi.string().min(10).max(150).required(),
});


export const getspecificdefinition=joi.object({
    definitionID:joi.string().min(24).max(24).required(),
});

export const updatedefinitionSchema=joi.object({
    id:joi.string().min(24).max(24).required(),
    description:joi.string().min(10).max(150).required(),
});



