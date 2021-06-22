import joi from 'joi';

const RegisterSchema = joi.object({
    value: joi.number().greater(0).required(),
    description: joi.string().min(1).required()
});

export {
    RegisterSchema
}