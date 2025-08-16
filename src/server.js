// src/server.js
import env from "./config/env.config.js";
import connectDB from "./config/db.config.js";
import app from "./app.js";

const PORT = env.PORT;
console.info(`Environment: ${env.NODE_ENV}`);

const startServer = async () => {
    try {
        const connectionInstance = await connectDB();
        console.info(
            `MongoDB connected at: ${connectionInstance.connection.host}`
        );
        app.listen(PORT, () => {
            if (env.NODE_ENV === "development") {
                console.info(`Server is running at http://localhost:${PORT}`);
            } else {
                console.info(`Server is running at PORT: ${PORT}`);
            }
        });
    } catch (err) {
        console.error("Failed to start server!!\n", err);
        process.exit(1);
    }
};

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:\n", err);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception - shutting down:\n", err);
    process.exit(1);
});

startServer();
