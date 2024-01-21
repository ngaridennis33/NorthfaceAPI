// Define a custom error class named AppError that extends the built-in Error class
export default class AppError extends Error {
    // Additional properties for the custom error class
    status: string; // Represents the status of the error ('fail' or 'error')
    isOperational: boolean; // Indicates whether the error is operational or unexpected

    // Constructor for creating instances of the AppError class
    constructor(public statusCode: number = 500, public message: string) {
        // Call the constructor of the parent class (Error) and set the error message
        super(message);

        // Determine the status based on the first digit of the statusCode
        // If the first digit is '4', set status to 'fail'; otherwise, set it to 'error'
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Set the isOperational property to true, indicating that the error is operational
        this.isOperational = true;

        // Capture the stack trace for better debugging information
        Error.captureStackTrace(this, this.constructor);
    }
}