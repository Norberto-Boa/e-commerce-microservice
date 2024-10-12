import type { Request, Response } from "express";
import { GetRoleByIdUseCase } from "./get-role-by-id.use-case";

export class getRoleByIdController {
	async handle(req: Request, res: Response) {
		const getRoleById = new GetRoleByIdUseCase();
		const id = "22";
		const role = getRoleById.execute(id);

		return res.status(200).json({ role });
	}
}
