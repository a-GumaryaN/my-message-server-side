import hashMaker from "./modules";

const Combinator = (email: string, code: string): string => {
    return email + code;
}

export const create_verify_hash = ({ email, code }:
    { email: string, code: string }): string => {
    return hashMaker(Combinator(email, code), 'md5', 'utf-8', 'hex');
}

export const check_verify_hash = ({ email, code, input_verify_hash }:
    { email: string, code: string, input_verify_hash: string }): boolean => {
    const verify_hash = hashMaker(email + code, 'md5', 'utf-8', 'hex');
    if (verify_hash === input_verify_hash) return true;
    return false
}