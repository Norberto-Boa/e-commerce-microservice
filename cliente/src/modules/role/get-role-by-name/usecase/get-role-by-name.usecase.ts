import { prismaClient } from "../../../../infra/database/prismaClient";

export class GetRoleByNameUseCase {
	async execute(name: string) {
		const role = await prismaClient.role.findFirst({
			where: {
				name,
			},
		});

		return role;
	}
}
