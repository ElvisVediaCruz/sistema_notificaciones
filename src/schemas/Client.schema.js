import Joi from "joi";

const name       = Joi.string().min(1);
const nit        = Joi.string().min(1);
const price_year = Joi.number().min(0);

export const createClientSchema = Joi.object({
    name: name.required(),
    nit:  nit.required(),
    price_year
});

export const updateClientSchema = Joi.object({
    name:      name.optional(),
    nit:       nit.optional(),
    price_year: price_year.optional()
}).min(1);

export const clientParamsSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

export const activeClientSchema = Joi.object({
    active: Joi.boolean().required()
});
