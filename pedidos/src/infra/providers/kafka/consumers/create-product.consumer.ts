import { prismaClient } from "../../../database/prismaClient";
import { kafkaConsumer } from "../kafka.consumer";


type productConsumer = {
  id: string,
  code: string,
  quantity: number
}

export async function createProductConsumer() {
  console.log("PRODUCT_CREATED")
  const consumer = await kafkaConsumer("PRODUCT_CREATED");
  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageToString = message.value!.toString();
      const customer = JSON.parse(messageToString) as productConsumer;

      await prismaClient.product.create({
        data: {
          externalId: customer.id,
          code: customer.code,
          quantity: customer.quantity
        }
      });
    }
  });
}

createProductConsumer();