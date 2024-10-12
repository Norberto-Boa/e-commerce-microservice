import type { Request, Response } from "express";
import { CreateClientUseCase } from "../useCase/create-user.use-case";
import { GetRoleByNameUseCase } from "../../get-role-by-name/get-role-by-name.usecase";
import { createUserValidator } from "../../../validators/create-user";

export class CreateCustomerController {
	async handle(req: Request, res: Response) {
		const useCase = new CreateClientUseCase();
		const { name, roleName, password, email, phone } =
			createUserValidator.parse(req.body);

		switch (roleName) {
			case "Admin": {
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

			case "Customer": {
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

			default:
				throw new Error("Invalid role!");
		}
	}
}
