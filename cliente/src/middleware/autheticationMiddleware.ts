import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
	name: string;
	id: string;
	role: string;
	iat: number;
	exp: number;
}

export function isAuth(req: Request, res: Response, next: NextFunction) {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Token not provided" });
	}

	const secret = process.env.JWT_SECRET_KEY ?? " ";
	const decoded = jwt.verify(token, secret) as DecodedToken;
	req.user = decoded;

	next();
}
