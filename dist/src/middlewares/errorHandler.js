"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
function errorHandlerMiddleware(err, req, res, next) {
    console.log(err);
    if (err.type) {
        return res.sendStatus(errorTypeToStatusCode(err.type));
    }
    return res.sendStatus(500);
}
exports.errorHandlerMiddleware = errorHandlerMiddleware;
function errorTypeToStatusCode(errorType) {
    if (errorType === 'conflict')
        return 409;
    if (errorType === 'not_found')
        return 404;
    if (errorType === 'unauthorized')
        return 401;
    return 400;
}
