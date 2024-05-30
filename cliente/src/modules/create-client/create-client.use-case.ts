import { prismaClient } from "../../infra/database/prismaClient";

type CreateClientRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export class CreateClientUseCase {
  constructor() { };



  async execute(data: CreateClientRequest) {

    const client = await prismaClient.client.findFirst({
      where: {
        email: data.email
      }
    });

    if (client) throw new Error("Customer already exists!");

    return await prismaClient.client.create({
      data: {
        ...data
      }
    })
  }
}