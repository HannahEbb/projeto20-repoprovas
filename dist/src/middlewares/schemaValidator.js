"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaValidator = void 0;
function schemaValidator(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body);
        if (validation.error) {
            return res.status(422).send(validation.error);
        }
        next();
    };
}
exports.schemaValidator = schemaValidator;
