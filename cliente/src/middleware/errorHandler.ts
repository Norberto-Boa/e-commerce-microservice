import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (error instanceof ZodError) {
		const formattedErrors = error.errors.map((err) => err.message); // Extract only messages
		return res.status(400).json({
			message: formattedErrors, // Send array of messages
		});
	}

	return res.status(500).json({
		message: error.message,
	});
};
