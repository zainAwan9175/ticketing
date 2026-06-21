import { CustomError } from './custom-error.js';
export class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to database';
    statuscode = 500;
    constructor() {
        super();
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
