import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";
import fs from "fs";
import { getEnvVariable } from "./helpers";

export const signJwt = (
    payload: object,
    keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options: SignOptions
) => {
const privateKey = Buffer.from(getEnvVariable(keyName), "base64").toString(
    "ascii"
    );
    return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
    });
};
