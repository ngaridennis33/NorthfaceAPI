import express from "express";
import { loginUserHandler, logoutUserHandler, refreshAccessTokenHandler, registerUserHandler, verifyEmailHandler } from "../controllers/auth.controllers";
import { validate } from "../middleware/validate";
import { loginUserSchema, registerUserSchema, verifyEmailSchema } from "../schema/user.schema";
import { requireUser } from "../middleware/require";
import { deserializeUser } from "../middleware/deserializeUser";

const router = express.Router();

router.post('/register',validate(registerUserSchema), registerUserHandler);
router.post('/login', validate(loginUserSchema), loginUserHandler);
router.post('/refresh',refreshAccessTokenHandler);
router.delete('/logout',deserializeUser, requireUser, logoutUserHandler);
router.get('/verifyemail/:verificationCode', validate(verifyEmailSchema), verifyEmailHandler);
export default router;