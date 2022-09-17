import joi from "joi";
import { IAuthData } from '../types/authTypes';

const signUpSchema = joi.object<IAuthData>({
    email: joi.string().email().required().messages({
        "any.required": "Você deve informar um email!",
        "string.email": "Você deve informar um formato de email válido!"
    }),
    password: joi.string().min(10).required().messages({
        "any.required": "Você deve informar a senha!",
        "string.min": "A senha deve possuir no mínimo 10 caracteres!"
    })
});


export default signUpSchema;
