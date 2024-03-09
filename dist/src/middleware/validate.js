"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
// middleware that will parse the schemas and return error messages to the user.
const zod_1 = require("zod"); //declaration and validation library designed to help you define and enforce data schemas.
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            params: req.params,
            query: req.query,
            body: req.body,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                status: 'fail',
                errors: error.errors,
            });
        }
        next(error);
    }
};
exports.validate = validate;
