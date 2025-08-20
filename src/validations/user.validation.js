import { z } from "zod";

const trimmedString = (field) =>
    z
        .string({ required_error: `${field} is required` })
        .trim()
        .min(1, `${field} cannot be empty`);

const passwordSchema = z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, "Password must be at least 8 characters")
    .superRefine((val, ctx) => {
        const missing = [];
        if (!/[a-z]/.test(val)) missing.push("1 lowercase letter");
        if (!/[A-Z]/.test(val)) missing.push("1 uppercase letter");
        if (!/\d/.test(val)) missing.push("1 number");
        if (!/[@$!%*#?&]/.test(val))
            missing.push("1 special character (@$!%*#?&)");
        if (missing.length) {
            ctx.addIssue({
                code: "custom",
                message: `Password must include: ${missing.join(", ")}`,
            });
        }
    });

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const updateUserSchema = z.object({
    username: trimmedString("Username")
        .toLowerCase()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be at most 50 characters")
        .regex(
            usernameRegex,
            "Username can only contain letters, numbers, and underscores"
        )
        .optional(),
    email: trimmedString("Email")
        .toLowerCase()
        .regex(emailRegex, "Please provide a valid email address")
        .optional(),
    phone: trimmedString("Phone")
        .regex(phoneRegex, "Please provide a valid phone number")
        .optional(),
});

const changePasswordSchema = z
    .object({
        oldPassword: trimmedString("Old Password"),
        newPassword: passwordSchema,
        confirmPassword: trimmedString("Confirm Password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export { updateUserSchema, changePasswordSchema };
