import { prismaClient } from "../../infra/database/prismaClient"


type CreateProductRequest = {
  name: string,
  code: string,
  quantity: number,
  price: number
}

export class CreateProductUseCase {
  constructor() { }

  async execute({ name, code, quantity, price }: CreateProductRequest) {
    const product = await prismaClient.product.findFirst({
      where: {
        code: code
      }
    });

    if (product) throw new Error("Product already exists!")

    const productCreated = await prismaClient.product.create({
      data: {
        name,
        code,
        quantity,
        price
      }
    });

    return productCreated;
  }
}