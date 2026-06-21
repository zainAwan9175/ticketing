import { CustomError } from '../error/custom-error.js';
export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error('Error:', err);
    // if (err instanceof RequestValidationError) {
    // 	return res.status(err.statuscode).send({ errors: err.serializeErrors() });
    // }
    // if (err instanceof DatabaseConnectionError) {
    // 	return res.status(err.statuscode).send({ errors:  err.serializeErrors() });
    // }
    if (err instanceof CustomError) {
        return res.status(err.statuscode).send({ errors: err.serializeErrors() });
    }
    res.status(500).send({
        errors: [{ message: err.message || 'Something went wrong' }],
    });
};
