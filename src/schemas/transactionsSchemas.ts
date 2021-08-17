import joi from 'joi';

const transactionSchema = joi.object({
    userId : joi.number().greater(0).required(),
    value: joi.number().greater(0).required(),
    description: joi.string().min(1).required(),
    type: joi.string().required()
});
 export default transactionSchema
