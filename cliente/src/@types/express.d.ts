import { Request } from "express";

declare module "express" {
	export interface Request {
		user?: {
			id: string;
			name: string;
			role: string;
		};
	}
}
