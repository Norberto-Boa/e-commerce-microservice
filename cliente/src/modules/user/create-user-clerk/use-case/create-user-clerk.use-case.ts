import { prismaClient } from "../../../../infra/database/prismaClient";
import { hash } from "bcryptjs";
import { KafkaSendMessage } from "../../../../infra/provider/kafka/producer";
import type { User } from "@prisma/client";

type CreateUserClerkRequest = {
	name: string;
	email: string;
	password: string;
	phone: string;
	role_id: string;
};

type CreateUserClerkResponse = User;

export class CreateUserClerkUseCase {
	async execute(
		data: CreateUserClerkRequest,
	): Promise<CreateUserClerkResponse> {
		const clerk = await prismaClient.user.findFirst({
			where: {
				email: data.email,
			},
		});

		if (clerk) throw new Error("Customer already exists!");

		const encryptedPassword = await hash(data.password, 10);

		const createdClerk = await prismaClient.user.create({
			data: {
				name: data.name,
				email: data.email,
				password: encryptedPassword,
				phone: data.phone,
				role_id: data.role_id,
			},
		});

		const kafkaProducer = new KafkaSendMessage();
		await kafkaProducer.execute("USER_CREATED", {
			id: createdClerk.id,
			email: createdClerk.email,
		});

		return createdClerk;
	}
}
