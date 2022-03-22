import * as jwt from "jsonwebtoken";
export interface result {
  error?: any;
  username?: string;
}

export const auth = (token: string, secretKey: string): result => {
  if (!token) return { error: "access denied...", username: '' };
  try {
    const userVerified = jwt.verify(token, secretKey);

    const decodedToken: any = jwt.decode(token);

    if (userVerified) return { username!: decodedToken._id, error: '' };

    throw "invalid token...";
  } catch ({message}) {
    return { error:message, username: '' };
  }
};
