import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";

export const signJwt = (
    payload: Object,
    keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options: SignOptions
) => {
const privateKey = Buffer.from(
    config.get<string>(keyName),
    'base64'
).toString('ascii');
return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
});
};
