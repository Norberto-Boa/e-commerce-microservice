import type { Request, Response } from "express";
import type { GetRoleByNameUseCase } from "../../../role/get-role-by-name/usecase/get-role-by-name.usecase";
import type { CreateClientUseCase } from "../../create-user/useCase/create-user.use-case";
import { createUserValidator } from "../../create-user/validators/create-user";

export class CreateUserClerkController {
	private createClientUseCase: CreateClientUseCase;
	private getRoleByNameUseCase: GetRoleByNameUseCase;

	constructor(
		createClientUseCase: CreateClientUseCase,
		getRoleByNameUseCase: GetRoleByNameUseCase,
	) {
		this.createClientUseCase = createClientUseCase;
		this.getRoleByNameUseCase = getRoleByNameUseCase;
	}

	async handle(req: Request, res: Response) {
		const { name, roleName, password, email, phone } =
			createUserValidator.parse(req.body);

		const role = await this.getRoleByNameUseCase.execute(roleName);

		if (!role) {
			throw new Error("Invalid role!");
		}

		const client = await this.createClientUseCase.execute({
			name,
			role_id: role.id,
			email: email,
			password: password,
			phone: phone,
		});
		return res.status(201).json(client);
	}
}
