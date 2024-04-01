import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";


export const communication=joi.object({
    type: joi.string().valid('email', 'whatsapp', 'facebook', 'instagram').required(),
    phone: joi.string().required().min(10).max(10),
    address: joi.string().required(),
    logo: joi.string().uri(),
});

export const getspecificcommunication=joi.object({
   communicationID:joi.string().min(24).max(24).required(),
});

export const updatecommunicationSchema=joi.object({
    id:joi.string().min(24).max(24).required(),
    type: joi.string().valid('email', 'whatsapp', 'facebook', 'instagram').required(),
    phone: joi.string().required().min(10).max(10),
    address: joi.string().required(),
    logo: joi.string().uri(),
});
