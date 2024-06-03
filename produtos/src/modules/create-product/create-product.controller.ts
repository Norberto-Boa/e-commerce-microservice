import { Request, Response } from "express";
import { CreateProductUseCase } from "./create-product.usecase";

export class CreateProductController {
  constructor() { }

  async handle(req: Request, res: Response) {
    const useCase = new CreateProductUseCase();
    try {
      const product = await useCase.execute(req.body);
      return res.json(product);
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}