import { kafka } from "./index";

export class KafkaSendMessage {
	async execute(topic: string, payload: any): Promise<void> {
		const producer = kafka.producer({
			allowAutoTopicCreation: true,
		});

		await producer.connect();
		await producer.send({
			topic,
			messages: [{ value: JSON.stringify(payload) }],
		});
		await producer.disconnect();
	}
}
