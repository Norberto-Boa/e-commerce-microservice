import type { Request, Response } from "express";
import { CreateClientUseCase } from "../useCase/create-user.use-case";
import { GetRoleByNameUseCase } from "../../../role/get-role-by-name/usecase/get-role-by-name.usecase";
import { createUserValidator } from "../validators/create-user";

export class CreateCustomerController {
	async handleCustomer(req: Request, res: Response) {
		const useCase = new CreateClientUseCase();
		const { name, roleName, password, email, phone } =
			createUserValidator.parse(req.body);

		if (
			roleName === "Admin" ||
			roleName === "Support Agent" ||
			roleName === "Manager"
		) {
			throw new Error("You must be verified to create a user with this role!");
		}

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

	async handleClerk(req: Request, res: Response) {
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
