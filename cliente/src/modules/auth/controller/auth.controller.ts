import type { Request, Response } from "express";
import { loginValidator } from "../validators/loginValidator";
import { LoginUseCase } from "../useCases/login.use-case";

export class AuthController {
	async handle(req: Request, res: Response) {
		const { email, password } = loginValidator.parse(req.body);

		const authenticate = new LoginUseCase();
		const token = await authenticate.execute({
			email,
			password,
		});

		return res.json({ token });
	}
}
