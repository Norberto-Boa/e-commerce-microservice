import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../../../../infra/database/prismaClient";

export class GetRoleByIdUseCase {
	async execute(id: string) {
		const role = await prismaClient.role.findFirst({
			where: {
				id,
			},
		});

		return role;
	}
}
