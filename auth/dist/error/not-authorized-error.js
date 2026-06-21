import { CustomError } from './custom-error.js';
export class NotAuthorizedError extends CustomError {
    statuscode = 401;
    constructor() {
        super('Not authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Not authorized' }];
    }
}
