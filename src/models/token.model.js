import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true,
        },
        ip: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
        isValid: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

// TTL index to auto-remove expired tokens
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model("Token", tokenSchema);
