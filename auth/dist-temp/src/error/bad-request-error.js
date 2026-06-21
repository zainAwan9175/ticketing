import { CustomError } from "./custom-error.js";
export class BadRequestError extends CustomError {
    message;
    statuscode = 400;
    constructor(message) {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
