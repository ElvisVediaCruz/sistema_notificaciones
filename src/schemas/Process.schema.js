import Joi from "joi";

const name      = Joi.string().min(1);
const price     = Joi.number().min(0);
const day_alert = Joi.number().integer().min(1).max(31);
const id_client = Joi.number().integer().positive();

export const createProcessSchema = Joi.object({
    name:      name.required(),
    price,
    day_alert: day_alert.required()
});

// id_client excluido — reasignar proceso a otro cliente no está soportado
export const updateProcessSchema = Joi.object({
    name:      name.optional(),
    price:     price.optional(),
    day_alert: day_alert.optional()
});

export const updateProcessParamsSchema = Joi.object({
    id_process: Joi.number().integer().positive().required(),
    id_client: Joi.number().integer().positive().required()
})

export const processParamsSchema = Joi.object({
    id_process: Joi.number().integer().positive().required()
});

export const processClientParamsSchema = Joi.object({
    id_client: Joi.number().integer().positive().required()
});

export const activeProcessSchema = Joi.object({
    active: Joi.boolean().required()
});