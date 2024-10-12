import { prismaClient } from "../../../infra/database/prismaClient";
import { hash } from "bcryptjs";
import { KafkaSendMessage } from "../../../infra/provider/kafka/producer";
import { GetRoleByNameUseCase } from "../../get-role-by-name/get-role-by-name.usecase";

type CreateClientRequest = {
	name: string;
	email: string;
	password: string;
	phone: string;
	role_id: string;
};

export class CreateClientUseCase {
	async execute(data: CreateClientRequest) {
		const client = await prismaClient.user.findFirst({
			where: {
				email: data.email,
			},
		});

		if (client) throw new Error("Customer already exists!");

		const encryptedPassword = await hash(data.password, 10);

		const createdClient = await prismaClient.user.create({
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
			id: createdClient.id,
			email: createdClient.email,
		});

		return createdClient;
	}
}
