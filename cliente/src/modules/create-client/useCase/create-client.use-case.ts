import { prismaClient } from "../../../infra/database/prismaClient";
import { KafkaSendMessage } from "../../../infra/provider/kafka/producer";

type CreateClientRequest = {
	name: string;
	email: string;
	password: string;
	phone: string;
};

export class CreateClientUseCase {
	async execute(data: CreateClientRequest) {
		const client = await prismaClient.client.findFirst({
			where: {
				email: data.email,
			},
		});

		if (client) throw new Error("Customer already exists!");

		const createdClient = await prismaClient.client.create({
			data: {
				...data,
			},
		});

		const kafkaProducer = new KafkaSendMessage();
		await kafkaProducer.execute("CUSTOMER_CREATED", {
			id: createdClient.id,
			email: createdClient.email,
		});

		return createdClient;
	}
}
