import Joi from "joi";

const name = Joi.string().min(1);
const id = Joi.number().integer().min(1);


export const createStateSchema = Joi.object({
    name: name.required()
});

export const updateStateSchema = Joi.object({
    name: name.required()
});

export const getStateByIdSchema = Joi.object({
    id: id.required()
})