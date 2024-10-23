import type { Request, Response } from "express";
import { GetRoleByNameUseCase } from "../../../role/get-role-by-name/usecase/get-role-by-name.usecase";
import { CreateClientUseCase } from "../../create-user/useCase/create-user.use-case";
import { createUserValidator } from "../../create-user/validators/create-user";

export class CreateUserClerkController {
	async handle(req: Request, res: Response) {
		const useCase = new CreateClientUseCase();
		const { name, roleName, password, email, phone } =
			createUserValidator.parse(req.body);

		const getRoleByName = new GetRoleByNameUseCase();
		const role = await getRoleByName.execute(roleName);

		if (!role) {
			throw new Error("Invalid role!");
		}

		const client = await useCase.execute({
			name,
			role_id: role.id,
			email: email,
			password: password,
			phone: phone,
		});
		return res.status(201).json(client);
	}
}
