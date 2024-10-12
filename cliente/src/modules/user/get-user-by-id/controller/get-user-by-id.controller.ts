import { prismaClient } from "../../../../infra/database/prismaClient";
import { GetUserByIdUseCase } from "../useCase/get-user-by-id.usecase";

export class GetUserByIdController {
	async execute(id: string) {
		const getUserById = new GetUserByIdUseCase();
		const user = await getUserById.execute(id);

		if (!user) {
			throw new Error("User not found");
		}

		return user;
	}
}
