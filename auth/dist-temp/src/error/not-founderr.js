import { CustomError } from './custom-error.js';
export class NotFoundError extends CustomError {
    reason = 'Route not found';
    statuscode = 403;
    constructor() {
        super();
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
