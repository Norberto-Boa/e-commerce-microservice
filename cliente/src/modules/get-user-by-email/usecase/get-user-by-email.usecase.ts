import type { User } from "@prisma/client";
import { prismaClient } from "../../../infra/database/prismaClient";

export class GetUserByEmailUseCase {
	async execute(email: string): Promise<User | null> {
		const user = await prismaClient.user.findFirst({
			where: {
				email,
			},
		});

		return user;
	}
}
