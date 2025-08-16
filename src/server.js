// src/server.js
import env from "./config/env.config.js";
import connectDB from "./config/db.config.js";
import app from "./app.js";
import logger from "./config/logger.config.js";

const PORT = env.PORT;
logger.info(`Environment: ${env.NODE_ENV}`);

const startServer = async () => {
    try {
        const connectionInstance = await connectDB();
        logger.info(
            `MongoDB connected at: ${connectionInstance.connection.host}`
        );
        app.listen(PORT, () => {
            if (env.NODE_ENV === "development") {
                logger.info(`Server is running at http://localhost:${PORT}`);
            } else {
                logger.info(`Server is running at PORT: ${PORT}`);
            }
        });
    } catch (err) {
        logger.error("Failed to start server!!");
        process.exit(1);
    }
};

process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Promise Rejection:\n", err);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception - shutting down:\n", err);
    process.exit(1);
});

startServer();
