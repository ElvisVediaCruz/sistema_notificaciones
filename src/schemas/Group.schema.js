import Joi from "joi";

export const createGroupSchema = Joi.object({
    name: Joi.string().min(1).required()
});

export const addMemberSchema = Joi.object({
    user_id: Joi.number().integer().positive().required()
});

export const groupParamsSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

export const memberParamsSchema = Joi.object({
    id:      Joi.number().integer().positive().required(),
    user_id: Joi.number().integer().positive().required()
});

export const createWorkerSchema = Joi.object({
    user_name: Joi.string().min(3).required(),
    password:  Joi.string().min(6).required()
});
