import { object, string, number } from "joi";

export const getGmailSchema = object({
    email: string()
        .pattern(new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

export const getCodeSchema = object({
    email: string()
        .pattern(new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    code: string().required().min(6).max(6),
});

export const FinalRegisterSchema = object({
    email: string()
        .pattern(new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    code: string().required().min(6).max(6),
    inputUser: object({
        fullName: string().required(),
    })
});

export const updateSchema = object({
    user: object({
        fullName: string(),
        profileImage:string(),
    })
});