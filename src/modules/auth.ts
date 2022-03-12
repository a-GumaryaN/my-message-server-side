import * as jwt from "jsonwebtoken";
export interface result {
  error?: string;
  username?: string;
}

export const auth = (token: string, secretKey: string): result => {
  if (!token) return { error: "access denied..." };
  try {
    const userVerified = jwt.verify(token, secretKey);

    const decodedToken: any = jwt.decode(token);

    if (userVerified) return { username: decodedToken._id };

    throw "invalid token...";
  } catch (error: any) {
    return { error };
  }
};
