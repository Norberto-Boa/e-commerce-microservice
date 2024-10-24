import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (error instanceof ZodError) {
		const formattedErrors = error.errors.map((err) => ({
			field: err.path.join("."),
			message: err.message,
		})); // Extract only messages
		return res.status(400).json({
			errors: formattedErrors, // Send array of messages
			message: "Invalid data",
		});
	}

	return res.status(500).json({
		message: error.message,
	});
};
