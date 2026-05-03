import Joi from "joi";

export const registerSchema = Joi.object({
    user_name: Joi.string().min(3).required(),
    password:  Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
    user_name: Joi.string().required(),
    password:  Joi.string().required()
});

export const changePasswordSchema = Joi.object({
    passwordOld: Joi.string().required(),
    passwordNew: Joi.string().min(6).required()
});
