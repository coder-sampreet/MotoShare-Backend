import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import env from "./env.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Custom log levels with "http" included
 */
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        http: "magenta",
        debug: "blue",
    },
};
winston.addColors(customLevels.colors);

/**
 * Development log format - colorized & human readable
 */
const devFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, requestId }) => {
        return `${timestamp} [${level}]${requestId ? ` [req:${requestId}]` : ""}: ${
            stack || message
        }`;
    })
);

/**
 * Production log format - JSON structured logs
 */
const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, requestId }) => {
        return JSON.stringify({
            timestamp,
            level,
            message,
            ...(stack ? { stack } : {}),
            ...(requestId ? { requestId } : {}),
        });
    })
);

/**
 * Always log to console
 */
const transports = [
    new winston.transports.Console({
        handleExceptions: true,
    }),
];

/**
 * Only add file logging in production
 */
if (env.NODE_ENV === "production") {
    transports.push(
        // Daily rotated error logs
        new DailyRotateFile({
            filename: path.join(logDir, "error-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            level: "error",
            zippedArchive: true,
            maxSize: process.env.LOG_MAX_SIZE || "20m",
            maxFiles: process.env.LOG_MAX_FILES || "30d",
            handleExceptions: true,
        }),

        // Daily rotated combined logs
        new DailyRotateFile({
            filename: path.join(logDir, "combined-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: process.env.LOG_MAX_SIZE || "20m",
            maxFiles: process.env.LOG_MAX_FILES || "14d",
        })
    );
}

/**
 * Create the logger
 */
const logger = winston.createLogger({
    levels: customLevels.levels,
    level: env.LOG_LEVEL || (env.NODE_ENV === "production" ? "info" : "debug"),
    format: env.NODE_ENV === "development" ? devFormat : prodFormat,
    transports,
    exitOnError: false,
});

/**
 * Handle uncaught exceptions & unhandled rejections
 */
if (env.NODE_ENV === "production") {
    logger.exceptions.handle(
        new winston.transports.File({
            filename: path.join(logDir, "exceptions.log"),
        })
    );

    logger.rejections.handle(
        new winston.transports.File({
            filename: path.join(logDir, "rejections.log"),
        })
    );
}

/**
 * Morgan stream integration
 */
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

export default logger;
