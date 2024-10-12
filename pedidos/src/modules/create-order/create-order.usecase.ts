import { prismaClient } from "../../infra/database/prismaClient";


type CreateOrderRequest = {
  clientId: string;
  items: [
    {
      productId: string,
      quantity: number
    }
  ]
}

export class CreateOrderUseCase {
  constructor() { }

  async execute(data: CreateOrderRequest) {
    // Request to Product API to validate the order
    // Use AXIOS

    const order = await prismaClient.order.create({
      data: {
        customerId: data.clientId,
        status: "pending",
        OrderItems: {
          createMany: {
            data: data.items
          }
        }
      }
    })

    return order;
  }
}

// 2:05:00