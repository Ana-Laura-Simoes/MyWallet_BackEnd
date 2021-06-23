import joi from 'joi';

const SignInSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});

export {
    SignInSchema
}