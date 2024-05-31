import { prismaClient } from "../../../database/prismaClient";
import { kafkaConsumer } from "../kafka.consumer";

type CustomerConsumer = {
  email: string,
  id: string,
}

export async function createCustomerConsumer() {
  console.log("CUSTOMER_CONSUMER...")
  const consumer = await kafkaConsumer("CUSTOMER_CREATED");
  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageToString = message.value!.toString();
      const customer = JSON.parse(messageToString) as CustomerConsumer;

      await prismaClient.customer.create({
        data: {
          email: customer.email,
          externalId: customer.id
        }
      });
    }
  });
}

createCustomerConsumer();