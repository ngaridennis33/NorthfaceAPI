"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVariable = void 0;
const config_1 = __importDefault(require("config"));
function getEnvVariable(key) {
    const value = config_1.default.get(key);
    if (!value || value.length === 0) {
        console.error(`The environment variable ${key} is not set.`);
        throw new Error(`The environment variable ${key} is not set.`);
    }
    return value;
}
exports.getEnvVariable = getEnvVariable;
//# sourceMappingURL=helpers.js.map