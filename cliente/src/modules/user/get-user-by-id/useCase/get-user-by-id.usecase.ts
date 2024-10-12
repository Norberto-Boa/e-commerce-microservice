import type { User } from "@prisma/client";
import { prismaClient } from "../../../../infra/database/prismaClient";

export class GetUserByIdUseCase {
	async execute(id: string): Promise<User | null> {
		const user = await prismaClient.user.findFirst({
			where: {
				id,
			},
		});

		return user;
	}
}
