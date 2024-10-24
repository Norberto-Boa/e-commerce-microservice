import type { Request, Response } from "express";
import type { CreateClientUseCase } from "../useCase/create-user.use-case";
import type { GetRoleByNameUseCase } from "../../../role/get-role-by-name/usecase/get-role-by-name.usecase";
import { createUserValidator } from "../validators/create-user";

export class CreateCustomerController {
	private getRoleByNameUseCase: GetRoleByNameUseCase;
	private createClientUseCase: CreateClientUseCase;

	constructor(
		getRoleByNameUseCase: GetRoleByNameUseCase,
		createClientUseCase: CreateClientUseCase,
	) {
		this.getRoleByNameUseCase = getRoleByNameUseCase;
		this.createClientUseCase = createClientUseCase;
	}

	async handle(req: Request, res: Response) {
		const { name, roleName, password, email, phone } =
			createUserValidator.parse(req.body);

		if (
			roleName === "Admin" ||
			roleName === "Support Agent" ||
			roleName === "Manager"
		) {
			throw new Error("You must be verified to create a user with this role!");
		}

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
