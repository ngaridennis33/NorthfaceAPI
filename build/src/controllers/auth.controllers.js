"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.verifyEmailHandler = exports.logoutUserHandler = exports.refreshAccessTokenHandler = exports.loginUserHandler = exports.registerUserHandler = void 0;
const crypto_1 = __importDefault(require("crypto")); // Performs various hashing, encryption and decryption methods.
const bcryptjs_1 = __importDefault(require("bcryptjs")); //Hashing algorithm to  enhance the security of password storage.
const user_service_1 = require("../services/user.service");
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("config"));
const appError_1 = __importDefault(require("../utils/appError"));
const jwt_1 = require("../utils/jwt");
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const email_1 = __importDefault(require("../utils/email"));
// Define options for HTTP cookies
const cookiesOptions = {
    // Set the 'httpOnly' option to true
    // This means that the cookie is accessible only through HTTP(S) requests
    // and cannot be accessed via client-side scripts (JavaScript running in the browser)
    httpOnly: true,
    // Set the 'sameSite' option to 'lax'
    // This controls when cookies are sent with cross-site requests
    // 'lax' means cookies will only be sent in a top-level navigation (e.g., following a link)
    // and will not be sent along with cross-site requests initiated by third-party websites
    // This is a security measure to prevent unauthorized websites from making requests to your server on behalf of the user
    sameSite: 'lax',
};
// This describes how long the accessTokens are going to last.
const accessTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get('accessTokenExpiresIn') * 60 * 1000), maxAge: config_1.default.get('accessTokenExpiresIn') * 60 * 1000 });
// This explains how long the refreshTokens are going to last.
const refreshTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get('refreshTokenExpiresIn') * 60 * 1000), maxAge: config_1.default.get('refreshTokenExpiresIn') * 60 * 1000 });
// POST /api/auth/register - Register User Handler
const registerUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const verifyCode = crypto_1.default.randomBytes(32).toString('hex');
        const verificationCode = crypto_1.default.createHash('sha256').update(verifyCode).digest('hex');
        const user = yield (0, user_service_1.createUserService)({
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            verificationCode,
        });
        // Handle sending the email with the verification code.
        const redirectUrl = `${config_1.default.get('origin')}8000/api/auth/verifyemail/${verifyCode}`;
        try {
            yield new email_1.default(user, redirectUrl).sendVerificationCode();
            yield (0, user_service_1.updateUserService)({ id: user.id }, { verificationCode });
            res.status(201).json({
                status: 'success',
                message: `An email with a verification code has been sent to: ${email}`,
            });
        }
        catch (error) {
            yield (0, user_service_1.updateUserService)({ id: user.id }, { verificationCode: null });
            return res.status(500).json({
                status: 'error',
                message: 'There was an error sending email, please try again',
            });
        }
    }
    catch (err) {
        // Catch any errors thrown in the try block
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            // Check if the error is a known Prisma client error
            if (err.code === 'P2002') {
                // Check if the Prisma error code is 'P2002'
                return res.status(409).json({
                    status: 'fail',
                    message: 'Email already exists, please use another email address',
                });
            }
        }
        // If the error is not a known Prisma client error or has a different code, pass it to the next middleware
        next(err);
    }
});
exports.registerUserHandler = registerUserHandler;
// POST /api/auth/login - Login Registered user
const loginUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield (0, user_service_1.findUniqueUserService)(
        // Check if the email is in the database.
        { email: email.toLowerCase() }, 
        // If the email is in the db, return these fields.
        { id: true, email: true, password: true, verified: true });
        if (!user) {
            return next(new appError_1.default(400, 'Invalid email or password'));
        }
        // Check if user is verified
        if (!user.verified) {
            return next(new appError_1.default(401, 'You are not verified, please verify your email to login'));
        }
        // if the user doesn't exist or the decrypted hashed password is not correct, return error.
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return next(new appError_1.default(400, 'Invalid email or password'));
        }
        // Sign Tokens
        const { access_token, refresh_token } = yield (0, user_service_1.signTokens)(user);
        // Save the tokens in a cookie
        res.cookie("access_token", access_token, accessTokenCookieOptions);
        res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
        // Set a cookie 'logged_in' with the value true, commonly used for tracking login status. Setting httpOnly to false makes it accessible to client-side JavaScript.
        res.cookie('logged_in', true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        res.status(200).json({
            status: 'success',
            access_token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUserHandler = loginUserHandler;
// POST /api/auth/refresh - refreshAccessTokenHandler
const refreshAccessTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        const message = 'Could not refresh Access Token';
        if (!refresh_token) {
            return next(new appError_1.default(403, message));
        }
        // Validate the refresh token
        const decoded = (0, jwt_1.verifyJwt)(refresh_token, 'refreshTokenPublicKey');
        if (!decoded) {
            return next(new appError_1.default(403, message));
        }
        // Check if the user has a valid session
        const session = yield connectRedis_1.default.get(decoded.sub);
        if (!session) {
            return next(new appError_1.default(403, message));
        }
        // Check of the user still exists
        const user = yield (0, user_service_1.findUniqueUserService)({ id: JSON.parse(session).id });
        if (!user) {
            return next(new appError_1.default(403, message));
        }
        // Sign new access Token
        const access_token = (0, jwt_1.signJwt)({ sub: user.id }, 'accessTokenPrivateKey', {
            expiresIn: `${config_1.default.get('accessTokenExpiresIn')}m`,
        });
        // 4. Add Cookies
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('logged_in', true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        // 5. Send response
        res.status(200).json({
            status: 'success',
            access_token,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.refreshAccessTokenHandler = refreshAccessTokenHandler;
// DELETE /api/auth/logout - Logout user handler
function logout(res) {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.cookie('logged_in', '', { maxAge: 1 });
}
const logoutUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectRedis_1.default.del(res.locals.user.id);
        logout(res);
        res.status(200).json({
            status: 'success',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.logoutUserHandler = logoutUserHandler;
// POST /api/auth/verify - Verify Email Handler
const verifyEmailHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verificationCode = crypto_1.default
            .createHash('sha256')
            .update(req.params.verificationCode)
            .digest('hex');
        const user = yield (0, user_service_1.updateUserService)({ verificationCode }, { verified: true, verificationCode: null }, { email: true });
        if (!user) {
            return next(new appError_1.default(401, 'Could not verify email'));
        }
        // Redirect to the frontend email verified page
        const redirectUrl = `${config_1.default.get('origin')}3000/verifyemailsuccess?title=Email%20Verification%20Complete&res=Your%20email%20has%20been%20verified%20successfully.`;
        res.redirect(redirectUrl);
    }
    catch (err) {
        if (err.code === 'P2025') {
            return res.status(403).json({
                status: 'fail',
                message: `Verification code is invalid or user doesn't exist`,
            });
        }
        next(err);
    }
});
exports.verifyEmailHandler = verifyEmailHandler;
const forgotPasswordHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user from the collection
        const email = req.body.email.toLowerCase();
        const user = yield (0, user_service_1.findUserService)({ email: req.body.email.toLowerCase() });
        const message = `A reset verification email has been sent to: ${email} if the associated email address is registered with a user. The email reset link will expire in 10 minutes.`;
        if (!user) {
            return res.status(200).json({
                status: 'success',
                message,
            });
        }
        if (!user.verified) {
            return res.status(403).json({
                status: 'fail',
                message: 'Account not verified',
            });
        }
        if (user.provider) {
            return res.status(403).json({
                status: 'fail',
                message: 'We found your account. It looks like you registered with a social auth account. Try signing in with social auth.',
            });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const passwordResetToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        yield (0, user_service_1.updateUserService)({ id: user.id }, {
            passwordResetToken,
            passwordResetAt: new Date(Date.now() + 10 * 60 * 1000),
        }, { email: true });
        try {
            const url = `${config_1.default.get('origin')}3000/resetpassword?token=${resetToken}`;
            yield new email_1.default(user, url).sendPasswordResetToken();
            res.status(200).json({
                status: 'success',
                message,
            });
        }
        catch (err) {
            yield (0, user_service_1.updateUserService)({ id: user.id }, { passwordResetToken: null, passwordResetAt: null });
            return res.status(500).json({
                status: 'error',
                message: 'There was an error sending email',
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.forgotPasswordHandler = forgotPasswordHandler;
const resetPasswordHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user from the collection
        const passwordResetToken = crypto_1.default
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');
        const user = yield (0, user_service_1.findUserService)({
            passwordResetToken,
            passwordResetAt: {
                gt: new Date(),
            },
        });
        if (!user) {
            return res.status(403).json({
                status: 'fail',
                message: 'Invalid token or token has expired',
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 12);
        // Change password data
        yield (0, user_service_1.updateUserService)({
            id: user.id,
        }, {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetAt: null,
        }, { email: true });
        logout(res);
        res.status(200).json({
            status: 'success',
            message: 'Password data updated successfully',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.resetPasswordHandler = resetPasswordHandler;
