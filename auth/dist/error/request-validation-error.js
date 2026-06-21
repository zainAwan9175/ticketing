import { CustomError } from './custom-error.js';
// interface CustomError extends Error {
//   statuscode: number;
//   serializeErrors(): { message: string; field?: string }[];
// }
export class RequestValidationError extends CustomError {
    errors;
    statuscode = 400;
    constructor(errors) {
        super();
        this.errors = errors;
        // Because we are extending a built-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map((error) => {
            if (error.type === 'field') {
                return { message: error.msg, field: error.path };
            }
            else {
                return { message: error.msg };
            }
        });
    }
}
