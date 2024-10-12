import type { NextFunction, Request, Response } from "express";

export class CheckRole {
	isAdmin(role: string) {
		if (role !== "Admin") {
			throw new Error("You are not authorized to perform this action");
		}

		return true;
	}

	checkRoleMiddleware(role: string) {
		return (req: Request, res: Response, next: NextFunction) => {
			if (!req.user) {
				return res
					.status(403)
					.json({ message: "You are not authorized to perform this action" });
			}

			const userRole = req.user.role;

			if (userRole !== role) {
				return res
					.status(403)
					.json({ message: "You are not authorized to perform this action" });
			}

			next();
		};
	}
}
