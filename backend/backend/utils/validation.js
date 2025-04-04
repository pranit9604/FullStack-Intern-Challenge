import Joi from "joi";

const registerValidation = Joi.object({
    name: Joi.string().min(20).max(60).required().messages({
        "string.min": "Name must be at least 20 characters long",
        "string.max": "Name must not exceed 60 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
    }),
    address: Joi.string().max(400).required().messages({
        "string.max": "Address must not exceed 400 characters",
        "any.required": "Address is required",
    }),
    password: Joi.string()
        .min(8)
        .max(16)
        .regex(/[A-Z]/, "uppercase")
        .regex(/[!@#$%^&*]/, "special character")
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters long",
            "string.max": "Password must not exceed 16 characters",
            "string.pattern.name": "Password must include at least one {#name}",
            "any.required": "Password is required",
        }),
    role: Joi.string().valid("admin", "user", "store_owner").required().messages({
        "any.only": "Role must be one of 'admin', 'user', or 'store_owner'",
        "any.required": "Role is required",
    }),
});

const loginValidation = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

export default { registerValidation, loginValidation };