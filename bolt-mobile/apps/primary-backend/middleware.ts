import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // 1. Get the token from headers
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    // 2. Check if token exists
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    // 3. Verify the token
    let decoded: string | jwt.JwtPayload;
    try {
        // console.log(process.env.JWT_PUBLIC_KEY);
        decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
            algorithms: ['RS256'],
        });
    } catch (error) {
        // Handle token verification errors (e.g., malformed, expired)
        res.status(401).json({ error: "Unauthorized or Invalid Token" });
        return;
    }


    // 4. Check if decoding was successful
    // Note: jwt.verify throws an error if verification fails, so this check might be redundant if using try/catch.
    // However, if decoded is somehow null/undefined (e.g., an empty valid token was signed), this catches it.
    if (!decoded) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    // 5. Extract userId from the decoded token
    // The original code has a potential issue here with `(decoded as any).payload.sub`.
    // It should generally be `decoded.sub` or `decoded.userId` depending on how the JWT was structured.
    // Let's assume the JWT payload directly contains 'sub' (subject) which is often used for user ID.
    const userId = (decoded as any).sub; // Corrected type assertion

    if (!userId) {
        res.status(401).json({ error: "Unauthorized: User ID not found in token" });
        return;
    }

    // 6. Attach userId to the request object
    // This is where the `types.d.ts` file comes into play.
    req.userId = userId;

    // 7. Pass control to the next middleware/route handler
    next();
}