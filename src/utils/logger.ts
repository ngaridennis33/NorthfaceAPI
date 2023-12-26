// Update the logger files to save the logs in the Mongo db

import winston, { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    });

    // Create Winston logger
    const logger = createLogger({
        transports: [new transports.Console()],
        format: format.combine(
            format.json(),
            format.timestamp(),
            format.prettyPrint()
        )
});

export default logger;