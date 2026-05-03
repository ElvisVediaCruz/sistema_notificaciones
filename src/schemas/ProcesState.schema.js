import Joi from "joi";

export const procesStateParamsSchema = Joi.object({
    id_process:       Joi.number().integer().positive().required(),
});
export const processStateSchema = Joi.array().items(
    Joi.object({
        id_process_state: Joi.number().integer().positive().required(),
        active: Joi.boolean().strict().required(),
        id_state:         Joi.number().integer().positive().required()
    }).unknown(false)
).min(1)
