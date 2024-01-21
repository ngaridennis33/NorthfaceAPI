import config from 'config';

export function getEnvVariable(key: string): string {
const value = config.get<string>(key)


if (!value || value.length === 0) {
console.error(`The environment variable ${key} is not set.`);
throw new Error(`The environment variable ${key} is not set.`);
}

return value;
}