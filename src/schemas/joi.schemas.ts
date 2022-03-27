import { object, string, number } from "joi";

export const checkVerifyCodeSchema = object({
    email: string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    code: string().min(6).max(6).required(),
});

export const VerifyCodeSchema = object({
    email: string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});


export const resetPasswordSchema = object({
    email: string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    code: string().min(6).max(6).required(),
    password: string(),

});

export const RegisterSchema = object({
    email: string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    code: string().min(6).max(6).required(),
    password: string(),
    fullName: string().min(3).max(35).required(),
});

export const updateUserSchema = object({
    user: {
        password: string(),
        fullName: string().min(3).max(35),
        profileImage: string(),
    }
});