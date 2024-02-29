"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define a custom error class named AppError that extends the built-in Error class
class AppError extends Error {
    // Constructor for creating instances of the AppError class
    constructor(statusCode = 500, message) {
        // Call the constructor of the parent class (Error) and set the error message
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        // Determine the status based on the first digit of the statusCode
        // If the first digit is '4', set status to 'fail'; otherwise, set it to 'error'
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // Set the isOperational property to true, indicating that the error is operational
        this.isOperational = true;
        // Capture the stack trace for better debugging information
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
