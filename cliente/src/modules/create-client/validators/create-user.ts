import { z } from "zod";

export const createUserValidator = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(8),
	roleName: z.string(),
	phone: z.string().min(8),
});
