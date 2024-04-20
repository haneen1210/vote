import joi from "joi";
import { generalFields, validation } from "../../middleware/validation.js";


export const communication=joi.object({
    socialMedia: joi.array().items(joi.object({
        image: joi.object({
            url: joi.string().required().uri() // Validate image URL as URI
        }).required(),
        link: joi.string().required().uri().min(10), // Validate link as URI with minimum length of 10 characters
    })).required(),
    phone: joi.string().required().min(10).max(10),
    address: joi.string().required().min(3),
    logo: joi.string().uri(),
   email: generalFields.email,
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
