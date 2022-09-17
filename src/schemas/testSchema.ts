import joi from "joi";

const testSchema = joi.object({
    name: joi.string().required().messages({
        "any.required": "Você deve informar um nome!"
    }),
    pdfUrl: joi.string().uri().required().messages({
        "any.required": "Você deve informar uma url válida!"
    }),
    category: joi.string().valid("Projeto", "Prática", "Recuperação").required().messages({
        "any.required": "Você deve informar uma categoria!",
        "string.valid": "Informe uma categoria válida: Prova, Prática ou Recuperação"
    }),
    discipline: joi.string().required().messages({
        "any.required": "Você deve informar uma disciplina!"
    }),
    teacher: joi.string().required().messages({
        "any.required": "Você deve informar um(a) instrutor(a)!"
    })
});



export default testSchema;