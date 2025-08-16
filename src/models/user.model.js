import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            match: [/^\+?[1-9]\d{7,14}$/, "Invalid phone number format"], // E.164
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false,
        },
        avatar: {
            type: String,
            default: null,
        },
        avatarPublicId: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ["user", "host", "admin"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.avatarPublicId;
    delete user.__v;
    return user;
};

export const User = mongoose.model("User", userSchema);
