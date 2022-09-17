import joi from "joi";
import { IAuthData } from "../types/authTypes";

const signInSchema = joi.object<IAuthData>({
    email: joi.string().email().required().messages({
        "any.required": "Você deve informar um email!",
        "string.email": "Você deve informar um formato de email válido!"
    }),
    password: joi.string().min(10).required().messages({
        "any.required": "Você deve informar a senha!"
    })
});



export default signInSchema;