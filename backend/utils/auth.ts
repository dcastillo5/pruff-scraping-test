import jwt from "jsonwebtoken";
const JWT_KEY = process.env.JWT_KEY || "";

export const verifyToken = (token: string) => {
  {
    try {
      return jwt.verify(token, JWT_KEY);
    } catch (error) {
      console.error("Error in verifyToken", error);
      return null;
    }
  }
};
