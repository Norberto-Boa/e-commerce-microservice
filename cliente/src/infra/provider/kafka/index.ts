import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
	clientId: "1",
	brokers: ["localhost:9092"],
	logLevel: logLevel.ERROR,
});

export { kafka };
