import { Request, Response } from "express";
import { CreateClientUseCase } from "./create-client.use-case";

export class CreateCustomerController {
  constructor() { };

  async handle(req: Request, res: Response) {
    const useCase = new CreateClientUseCase();

    try {
      const client = await useCase.execute(req.body);
      return res.status(201).json(client);

    } catch (error) {
      return res.status(400).json(error);
    }
  }
}