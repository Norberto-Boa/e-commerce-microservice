import type { Request, Response } from "express";
import { CreateClientUseCase } from "../useCase/create-user.use-case";

export class CreateCustomerController {
	async handle(req: Request, res: Response) {
		const useCase = new CreateClientUseCase();

		try {
			const client = await useCase.execute(req.body);
			return res.status(201).json(client);
		} catch (error) {
			// console.log(error.message);
			return res.status(400).json(error);
		}
	}
}
