import { prismaClient } from "../../../../infra/database/prismaClient";

export class GetUserById {
	async execute(id: string) {
		const user = await prismaClient.user.findFirst({
			where: {
				id,
			},
		});

		return user;
	}
}
